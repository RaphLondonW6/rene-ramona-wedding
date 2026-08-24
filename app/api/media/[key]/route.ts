import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/cloudflare'

export const runtime = 'edge'

// Serve media from R2. Supports HTTP Range requests (required for
// video scrubbing / playback on iOS Safari).
export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  const { MEDIA } = env()
  const key = params.key

  // keys are UUID.ext — reject anything else (no path traversal)
  if (!/^[a-f0-9-]{36}\.[a-z0-9]{2,5}$/i.test(key)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const rangeHeader = req.headers.get('range')

  if (rangeHeader) {
    const head = await MEDIA.head(key)
    if (!head) return new NextResponse('Not found', { status: 404 })

    const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader)
    const start = m && m[1] ? parseInt(m[1], 10) : 0
    const end = m && m[2] ? Math.min(parseInt(m[2], 10), head.size - 1) : head.size - 1
    if (start >= head.size || start > end) {
      return new NextResponse('Range not satisfiable', {
        status: 416,
        headers: { 'Content-Range': `bytes */${head.size}` },
      })
    }

    const obj = await MEDIA.get(key, {
      range: { offset: start, length: end - start + 1 },
    })
    if (!obj) return new NextResponse('Not found', { status: 404 })

    return new NextResponse(obj.body, {
      status: 206,
      headers: {
        'Content-Type': head.httpMetadata?.contentType || 'application/octet-stream',
        'Content-Range': `bytes ${start}-${end}/${head.size}`,
        'Content-Length': String(end - start + 1),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }

  const obj = await MEDIA.get(key)
  if (!obj) return new NextResponse('Not found', { status: 404 })

  return new NextResponse(obj.body, {
    status: 200,
    headers: {
      'Content-Type': obj.httpMetadata?.contentType || 'application/octet-stream',
      'Content-Length': String(obj.size),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
