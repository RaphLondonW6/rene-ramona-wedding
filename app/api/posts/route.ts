import { NextRequest, NextResponse } from 'next/server'
import { env, waitUntil } from '@/lib/cloudflare'

export const runtime = 'edge'

const PAGE_SIZE = 12
const MAX_IMAGE_BYTES = 20 * 1024 * 1024 // 20 MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024 // 50 MB — keeps clips short & the feed fast (Workers hard cap is 100 MB)
const RATE_LIMIT = 10 // uploads per window per IP
const RATE_WINDOW_MS = 10 * 60 * 1000

const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}
const VIDEO_TYPES: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/webm': 'webm',
}

const N8N_WEBHOOK =
  'https://n8n.ramonapicksrene.com/webhook/6bdd98e4-4e3c-4b98-b00a-8ea3444cb59a'

const MAX_CAPTION_LEN = 250

type PostRow = {
  id: string
  name: string
  media_key: string
  media_type: string
  created_at: number
  caption: string | null
}

// ---------- GET /api/posts?cursor=<createdAt>_<id> ----------
export async function GET(req: NextRequest) {
  const { DB } = env()
  const cursor = req.nextUrl.searchParams.get('cursor')

  let rows: PostRow[]
  if (cursor) {
    const [ts, id] = cursor.split('_')
    const res = await DB.prepare(
      `SELECT id, name, media_key, media_type, created_at, caption FROM posts
       WHERE (created_at < ?1) OR (created_at = ?1 AND id < ?2)
       ORDER BY created_at DESC, id DESC LIMIT ?3`
    )
      .bind(Number(ts) || 0, id || '', PAGE_SIZE + 1)
      .all<PostRow>()
    rows = res.results
  } else {
    const res = await DB.prepare(
      `SELECT id, name, media_key, media_type, created_at, caption FROM posts
       ORDER BY created_at DESC, id DESC LIMIT ?1`
    )
      .bind(PAGE_SIZE + 1)
      .all<PostRow>()
    rows = res.results
  }

  const hasMore = rows.length > PAGE_SIZE
  const page = rows.slice(0, PAGE_SIZE)
  const last = page[page.length - 1]

  return NextResponse.json(
    {
      posts: page.map((r) => ({
        id: r.id,
        name: r.name,
        mediaUrl: `/api/media/${r.media_key}`,
        mediaType: r.media_type,
        createdAt: r.created_at,
        caption: r.caption || null,
      })),
      nextCursor: hasMore && last ? `${last.created_at}_${last.id}` : null,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

// ---------- POST /api/posts (multipart form) ----------
export async function POST(req: NextRequest) {
  const { DB, MEDIA } = env()

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'invalid_form' }, { status: 400 })
  }

  // Honeypot — bots fill every field
  if (String(form.get('website') || '').length > 0) {
    return NextResponse.json({ ok: true }) // pretend success
  }

  const name = String(form.get('name') || '').trim().slice(0, 60)
  const email = String(form.get('email') || '').trim().slice(0, 120)
  const caption = String(form.get('caption') || '').trim().slice(0, MAX_CAPTION_LEN) || null
  const file = form.get('file')

  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'invalid_name' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'missing_file' }, { status: 400 })
  }

  const contentType = file.type.toLowerCase()
  const isImage = contentType in IMAGE_TYPES
  const isVideo = contentType in VIDEO_TYPES
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: 'unsupported_type' }, { status: 415 })
  }
  if (isImage && file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'image_too_large' }, { status: 413 })
  }
  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return NextResponse.json({ error: 'video_too_large' }, { status: 413 })
  }

  // ---- Rate limit per IP ----
  const ip = req.headers.get('cf-connecting-ip') || 'unknown'
  const now = Date.now()
  const windowStart = now - RATE_WINDOW_MS
  const countRow = await DB.prepare(
    'SELECT COUNT(*) AS c FROM upload_log WHERE ip = ?1 AND created_at > ?2'
  )
    .bind(ip, windowStart)
    .first<{ c: number }>()
  if ((countRow?.c ?? 0) >= RATE_LIMIT) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }
  await DB.prepare('INSERT INTO upload_log (ip, created_at) VALUES (?1, ?2)')
    .bind(ip, now)
    .run()

  // ---- Store in R2 ----
  const id = crypto.randomUUID()
  const ext = isImage ? IMAGE_TYPES[contentType] : VIDEO_TYPES[contentType]
  const mediaKey = `${id}.${ext}`
  await MEDIA.put(mediaKey, file.stream(), {
    httpMetadata: { contentType },
  })

  // ---- Store metadata in D1 ----
  const mediaType = isImage ? 'image' : 'video'
  await DB.prepare(
    `INSERT INTO posts (id, name, email, media_key, media_type, content_type, size, created_at, caption)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`
  )
    .bind(id, name, email, mediaKey, mediaType, contentType, file.size, now, caption)
    .run()

  // ---- Fire n8n webhook (independent of upload success) ----
  const payload = {
    event: 'post.created',
    postId: id,
    guestName: name,
    guestEmail: email,
    mediaType,
    contentType,
    sizeBytes: file.size,
    mediaUrl: `https://www.ramonapicksrene.com/api/media/${mediaKey}`,
    feedUrl: 'https://www.ramonapicksrene.com/evidence',
    caption,
    timestamp: new Date(now).toISOString(),
  }
  waitUntil(
    fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    }).catch(() => {
      /* n8n being down must never break the upload */
    })
  )

  // Occasionally clean old rate-limit rows
  if (Math.random() < 0.05) {
    waitUntil(
      DB.prepare('DELETE FROM upload_log WHERE created_at < ?1')
        .bind(now - 60 * 60 * 1000)
        .run()
    )
  }

  return NextResponse.json({
    post: {
      id,
      name,
      mediaUrl: `/api/media/${mediaKey}`,
      mediaType,
      createdAt: now,
      caption,
    },
  })
}
