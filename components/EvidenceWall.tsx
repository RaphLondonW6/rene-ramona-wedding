'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'

type Post = {
  id: string
  name: string
  mediaUrl: string
  mediaType: 'image' | 'video'
  createdAt: number
}

type UploadState =
  | { phase: 'idle' }
  | { phase: 'uploading'; msgIndex: number }
  | { phase: 'success' }
  | { phase: 'error'; message: string }

// Deterministic "random" per post so captions don't reshuffle on re-render
function pick<T>(arr: T[], seed: string): T {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return arr[Math.abs(h) % arr.length]
}

export default function EvidenceWall() {
  const { t } = useLanguage()
  const e = (t as any).evidence
  const [posts, setPosts] = useState<Post[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchPage = useCallback(async (cur: string | null) => {
    const res = await fetch(`/api/posts${cur ? `?cursor=${cur}` : ''}`)
    if (!res.ok) throw new Error('feed_failed')
    return res.json() as Promise<{ posts: Post[]; nextCursor: string | null }>
  }, [])

  // initial load
  useEffect(() => {
    fetchPage(null)
      .then((d) => {
        setPosts(d.posts)
        setCursor(d.nextCursor)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [fetchPage])

  // infinite scroll
  useEffect(() => {
    if (!cursor || !sentinelRef.current) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          setLoadingMore(true)
          fetchPage(cursor)
            .then((d) => {
              setPosts((p) => [...p, ...d.posts])
              setCursor(d.nextCursor)
            })
            .catch(() => {})
            .finally(() => setLoadingMore(false))
        }
      },
      { rootMargin: '600px' }
    )
    obs.observe(sentinelRef.current)
    return () => obs.disconnect()
  }, [cursor, loadingMore, fetchPage])

  const onPosted = useCallback((post: Post) => {
    setPosts((p) => [post, ...p])
  }, [])

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(180deg, #E1BF92 0%, #DFE0E1 50%, #E1BF92 100%)' }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs tracking-[0.15em] uppercase font-body text-darkText hover:text-champagne transition-colors"
          >
            ← {e.backToSite}
          </Link>
          <span className="font-serif-display text-lg text-champagne tracking-widest">R&R</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pb-32 pt-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-champagne text-2xl mb-3" aria-hidden="true">✦</div>
          <h1 className="font-serif-display text-4xl text-darkText mb-3">📸 {e.title}</h1>
          <p className="font-serif-body italic text-sm text-darkText/70 max-w-sm mx-auto">{e.subtitle}</p>
          <div className="gold-divider my-6" />
        </div>

        {/* Feed */}
        {loading && (
          <div className="text-center py-16 font-serif-body italic text-darkText/60">…</div>
        )}

        {!loading && posts.length === 0 && (
          <div className="bg-white/80 border border-cream/80 p-10 text-center">
            <div className="text-5xl mb-4" aria-hidden="true">🕊️</div>
            <h2 className="font-serif-display text-2xl text-darkText mb-3">{e.emptyTitle}</h2>
            <p className="font-body text-sm text-darkText/70 mb-6">{e.emptyBody}</p>
            <button onClick={() => setModalOpen(true)} className="btn-gold inline-flex">
              📸 {e.emptyCta}
            </button>
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} submittedBy={e.submittedBy} videoBadge={e.videoBadge} />
          ))}
        </div>

        {cursor && (
          <div ref={sentinelRef} className="text-center py-8 font-serif-body italic text-sm text-darkText/50">
            {e.loadMore}
          </div>
        )}

        {posts.length > 0 && (
          <p className="text-center font-body text-[11px] tracking-wide text-darkText/40 mt-10">
            {e.footer}
          </p>
        )}
      </main>

      {/* Floating + button */}
      <button
        onClick={() => setModalOpen(true)}
        aria-label={e.uploadCta}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-champagne text-white text-3xl leading-none
                   shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200
                   flex items-center justify-center animate-[fabPulse_3s_ease-in-out_infinite] motion-reduce:animate-none
                   focus:outline-none focus-visible:ring-4 focus-visible:ring-champagne/40"
      >
        +
      </button>
      <style>{`
        @keyframes fabPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.25), 0 0 0 0 rgba(201,169,110,0.5); }
          50% { box-shadow: 0 4px 20px rgba(0,0,0,0.25), 0 0 0 12px rgba(201,169,110,0); }
        }
      `}</style>

      {modalOpen && <UploadModal e={e} onClose={() => setModalOpen(false)} onPosted={onPosted} />}
    </div>
  )
}

/* ---------------- Post card ---------------- */

function PostCard({
  post,
  submittedBy,
  videoBadge,
}: {
  post: Post
  submittedBy: string[]
  videoBadge: string
}) {
  const prefix = useMemo(() => pick(submittedBy, post.id), [submittedBy, post.id])
  const time = useMemo(() => {
    const d = new Date(post.createdAt)
    return d.toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }, [post.createdAt])

  return (
    <article className="bg-white/85 border border-cream/80 shadow-sm overflow-hidden rounded-sm">
      <div className="relative">
        {post.mediaType === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.mediaUrl}
            alt={`Wedding moment shared by ${post.name}`}
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
        ) : (
          <video
            src={post.mediaUrl}
            controls
            muted
            playsInline
            preload="metadata"
            className="w-full h-auto block bg-black"
          />
        )}

        {/* Souvenir overlay ribbon — rendered live, originals untouched */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none bg-gradient-to-t from-black/55 to-transparent px-4 pt-8 pb-2 flex items-end justify-between">
          <span className="font-serif-display text-white/95 text-sm tracking-widest drop-shadow">💍 Ramona &amp; René</span>
          <span className="font-body text-white/80 text-[10px] tracking-[0.2em] uppercase drop-shadow">12 · 06 · 2027 🥂</span>
        </div>

        {post.mediaType === 'video' && (
          <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-body tracking-[0.15em] uppercase px-2 py-1 rounded-sm">
            🎬 {videoBadge}
          </span>
        )}
      </div>

      <div className="px-4 py-3 flex items-center justify-between">
        <p className="font-body text-sm text-darkText">
          <span className="text-darkText/50 italic font-serif-body">{prefix}</span>{' '}
          <span className="font-semibold">{post.name}</span>
        </p>
        <time className="font-body text-[11px] text-darkText/40">{time}</time>
      </div>
    </article>
  )
}

/* ---------------- Upload modal ---------------- */

const MAX_IMAGE_BYTES = 20 * 1024 * 1024
const MAX_VIDEO_BYTES = 95 * 1024 * 1024

async function compressImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file)
    const MAX_DIM = 1920
    const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, w, h)
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.85))
    if (!blob || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })
  } catch {
    return file // e.g. browser can't decode — let the server validate
  }
}

function UploadModal({
  e,
  onClose,
  onPosted,
}: {
  e: any
  onClose: () => void
  onPosted: (p: Post) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<UploadState>({ phase: 'idle' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // rotate loading messages
  useEffect(() => {
    if (state.phase !== 'uploading') return
    const iv = setInterval(() => {
      setState((s) =>
        s.phase === 'uploading' ? { ...s, msgIndex: (s.msgIndex + 1) % e.loadingMessages.length } : s
      )
    }, 2200)
    return () => clearInterval(iv)
  }, [state.phase, e.loadingMessages.length])

  const selectFile = (f: File | null) => {
    if (!f) return
    const isImage = f.type.startsWith('image/')
    const isVideo = f.type.startsWith('video/')
    if (!isImage && !isVideo) {
      setState({ phase: 'error', message: e.errorUnsupported })
      return
    }
    if (isVideo && f.size > MAX_VIDEO_BYTES) {
      setState({ phase: 'error', message: e.errorTooLargeVideo })
      return
    }
    setState({ phase: 'idle' })
    setFile(f)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!file) return
    setState({ phase: 'uploading', msgIndex: 0 })

    try {
      let toSend = file
      if (file.type.startsWith('image/')) {
        toSend = await compressImage(file)
        if (toSend.size > MAX_IMAGE_BYTES) {
          setState({ phase: 'error', message: e.errorTooLargeImage })
          return
        }
      }

      const fd = new FormData()
      fd.append('file', toSend)
      fd.append('name', name)
      fd.append('email', email)
      fd.append('website', '') // honeypot

      const res = await fetch('/api/posts', { method: 'POST', body: fd })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const map: Record<string, string> = {
          image_too_large: e.errorTooLargeImage,
          video_too_large: e.errorTooLargeVideo,
          unsupported_type: e.errorUnsupported,
          rate_limited: e.errorRateLimited,
        }
        setState({ phase: 'error', message: map[(data as any).error] || e.errorBody })
        return
      }
      const { post } = (await res.json()) as { post: Post }
      onPosted(post)
      setState({ phase: 'success' })
    } catch {
      setState({ phase: 'error', message: e.errorBody })
    }
  }

  const isImage = file?.type.startsWith('image/')

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={e.modalTitle}
      onClick={(ev) => ev.target === ev.currentTarget && state.phase !== 'uploading' && onClose()}
    >
      <div className="bg-ivory w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-sm shadow-2xl">

        {/* SUCCESS */}
        {state.phase === 'success' && (
          <div className="p-8 text-center relative overflow-hidden">
            <Confetti />
            <div className="text-6xl mb-4" aria-hidden="true">🍾</div>
            <h2 className="font-serif-display text-2xl text-darkText mb-3">🎉 {e.successTitle}</h2>
            <p className="font-body text-sm text-darkText/70 mb-6">{e.successBody}</p>
            <button onClick={onClose} className="btn-gold inline-flex">{e.successCta}</button>
          </div>
        )}

        {/* UPLOADING */}
        {state.phase === 'uploading' && (
          <div className="p-10 text-center">
            <div className="text-5xl mb-6 animate-bounce" aria-hidden="true">💌</div>
            <p className="font-serif-body italic text-lg text-darkText" aria-live="polite">
              {e.loadingMessages[state.msgIndex]}
            </p>
          </div>
        )}

        {/* FORM (idle & error) */}
        {(state.phase === 'idle' || state.phase === 'error') && (
          <form onSubmit={submit} className="p-6">
            <div className="text-center mb-5">
              <h2 className="font-serif-display text-2xl text-darkText mb-1">{e.modalTitle}</h2>
              <p className="font-serif-body italic text-xs text-darkText/60">{e.modalSubtitle}</p>
            </div>

            {state.phase === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-sm font-body p-3 mb-4 rounded-sm" role="alert">
                🫠 {state.message}
              </div>
            )}

            {/* Media picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="sr-only"
              onChange={(ev) => selectFile(ev.target.files?.[0] ?? null)}
            />
            {!file ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-champagne/50 hover:border-champagne bg-white/60 p-8 text-center transition-colors rounded-sm mb-4"
              >
                <div className="text-4xl mb-2" aria-hidden="true">📸</div>
                <span className="font-body text-sm text-darkText">{e.pickMedia}</span>
              </button>
            ) : (
              <div className="mb-4">
                <div className="relative rounded-sm overflow-hidden border border-cream">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl!} alt="Preview" className="w-full max-h-64 object-contain bg-black/5" />
                  ) : (
                    <video src={previewUrl!} muted playsInline className="w-full max-h-64 bg-black" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 font-body text-xs text-champagne hover:text-gold underline"
                >
                  {e.changeMedia}
                </button>
              </div>
            )}

            {/* Name */}
            <label className="block mb-4">
              <span className="font-body text-xs tracking-wider uppercase text-darkText/70">{e.nameLabel}</span>
              <input
                type="text"
                required
                minLength={2}
                maxLength={60}
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                placeholder={e.namePlaceholder}
                className="mt-1 w-full border border-cream bg-white/80 px-3 py-2.5 font-body text-sm text-darkText
                           focus:outline-none focus:border-champagne rounded-sm"
              />
            </label>

            {/* Email */}
            <label className="block mb-2">
              <span className="font-body text-xs tracking-wider uppercase text-darkText/70">{e.emailLabel}</span>
              <input
                type="email"
                required
                maxLength={120}
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder={e.emailPlaceholder}
                className="mt-1 w-full border border-cream bg-white/80 px-3 py-2.5 font-body text-sm text-darkText
                           focus:outline-none focus:border-champagne rounded-sm"
              />
            </label>

            {/* Honeypot */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-darkText/20 text-darkText font-body text-xs tracking-[0.15em] uppercase py-3 hover:bg-white/60 transition-colors rounded-sm"
              >
                {e.cancel}
              </button>
              <button
                type="submit"
                disabled={!file || !name || !email}
                className="flex-1 btn-gold justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                🥂 {e.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

/* ---------------- Confetti (CSS only, reduced-motion aware) ---------------- */

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${(i * 53) % 100}%`,
        delay: `${(i % 6) * 0.15}s`,
        emoji: ['🎉', '✨', '🥂', '💍', '🍾', '💛'][i % 6],
      })),
    []
  )
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden motion-reduce:hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute text-xl"
          style={{
            left: p.left,
            top: '-2rem',
            animation: `confettiFall 2.4s ease-in ${p.delay} forwards`,
          }}
        >
          {p.emoji}
        </span>
      ))}
      <style>{`
        @keyframes confettiFall {
          to { transform: translateY(120vh) rotate(360deg); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
