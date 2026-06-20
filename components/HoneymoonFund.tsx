'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const REVOLUT_URL = 'https://revolut.me/rene9d76l/pocket/BDV6gKSSGX'

export default function HoneymoonFund() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [wish, setWish] = useState('')
  const [generatedWish, setGeneratedWish] = useState('')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Simple client-side wish generator (no API key needed)
  const generateWish = () => {
    if (!wish.trim()) return
    setGenerating(true)
    const templates = [
      `Wishing René & Ramona a lifetime of joy and adventures together. ${wish} May every journey you take bring you closer and every memory be a treasure. ✨`,
      `Dear René & Ramona, as you embark on your honeymoon, may it be the first chapter of a beautiful story. ${wish} Here's to love, laughter, and happily ever after. 💛`,
      `To the beautiful couple — may your honeymoon be as magical as your love. ${wish} Wishing you sun-kissed days, starlit nights, and a love that grows deeper with every adventure. 🌍`,
      `René & Ramona, your love story inspires us all. ${wish} May your honeymoon be everything you've dreamed of and your marriage be filled with endless happiness. 🥂`,
      `What a privilege to celebrate with you both! ${wish} May your honeymoon be the perfect start to your forever together. With all our love. 💍`,
    ]
    setTimeout(() => {
      setGeneratedWish(templates[Math.floor(Math.random() * templates.length)])
      setGenerating(false)
    }, 1200)
  }

  return (
    <div
      ref={sectionRef}
      className="section-base"
      style={{ background: 'linear-gradient(180deg, #E1BF92 0%, #DFE0E1 50%, #E1BF92 100%)' }}
    >
      <div className="max-w-3xl mx-auto text-center">

        <div className="reveal text-champagne text-3xl mb-6" aria-hidden="true">✦</div>
        <h2 className="reveal section-title">{t.honeymoon.title}</h2>
        <div className="reveal gold-divider my-6" />

        {/* Travel icon */}
        <div className="reveal text-6xl mb-8" aria-hidden="true">✈️</div>

        <div className="reveal bg-white/80 backdrop-blur-sm border border-cream/80 p-8 md:p-12 shadow-sm mb-8">
          {t.honeymoon.body.split('\n').map((para, i) => (
            <p key={i} className={`font-serif-body text-xl md:text-2xl text-darkText leading-relaxed italic${i > 0 ? ' mt-4' : ''}`}>
              {para}
            </p>
          ))}

          <div className="gold-divider my-8" />

          <a
            href={REVOLUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex"
            aria-label="Contribute to the honeymoon fund via Revolut"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {t.honeymoon.contributeButton}
          </a>
        </div>

        {/* Wedding Wish Generator */}
        <div className="reveal bg-white/60 border border-cream/60 p-6 md:p-8">
          <h3 className="font-serif-display text-xl text-champagne mb-2">{t.honeymoon.wishTitle}</h3>
          <p className="font-body text-sm text-lightText mb-4">
            Craft a personal wish and send it with your contribution.
          </p>

          <textarea
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            rows={3}
            className="form-input w-full resize-none mb-4"
            placeholder={t.honeymoon.wishPlaceholder}
            aria-label="Write a personal note or wish"
          />

          <button
            onClick={generateWish}
            disabled={generating || !wish.trim()}
            className="btn-outline text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {generating ? t.honeymoon.wishGenerating : t.honeymoon.wishButton}
          </button>

          {generatedWish && (
            <div className="mt-6 p-5 bg-cream/60 border border-champagne/30 text-left">
              <p className="font-serif-body text-base text-darkText leading-relaxed italic">
                "{generatedWish}"
              </p>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(generatedWish)
                }}
                className="text-xs text-champagne underline-offset-2 hover:underline mt-3 font-body"
              >
                Copy to clipboard
              </button>
            </div>
          )}
        </div>

        <div className="reveal ornament mt-12" aria-hidden="true">— ✦ —</div>
      </div>
    </div>
  )
}
