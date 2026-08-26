'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const REVOLUT_URL = 'https://revolut.me/rene9d76l/pocket/BDV6gKSSGX'

export default function HoneymoonFund() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

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

        <div className="reveal ornament mt-12" aria-hidden="true">— ✦ —</div>
      </div>
    </div>
  )
}
