'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function Contact() {
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
      <div className="max-w-2xl mx-auto text-center">

        <div className="reveal text-champagne text-3xl mb-6" aria-hidden="true">✦</div>
        <h2 className="reveal section-title">{t.contact.title}</h2>
        <div className="reveal gold-divider my-6" />

        <div className="reveal bg-white/80 backdrop-blur-sm border border-cream/80 p-8 md:p-12 shadow-sm">

          <p className="font-serif-display text-3xl text-champagne mb-2">René & Ramona</p>

          <div className="gold-divider my-8" />

          {/* Email CTA */}
          <a
            href="mailto:hello@ramonapicksrene.com"
            className="btn-gold inline-flex"
            aria-label="Send an email to René and Ramona"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t.contact.emailButton}
          </a>
        </div>

        <div className="reveal ornament mt-12" aria-hidden="true">— ✦ —</div>
      </div>
    </div>
  )
}
