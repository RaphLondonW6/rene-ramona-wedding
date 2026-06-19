'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Phoenix+Cernica+Strada+Strandului+62+077145+Pantelimon+Romania'

export default function Welcome() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    const reveals = sectionRef.current?.querySelectorAll('.reveal')
    reveals?.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="section-base bg-ivory"
      style={{ background: 'linear-gradient(180deg, #E1BF92 0%, #DFE0E1 50%, #E1BF92 100%)' }}
    >
      <div className="max-w-3xl mx-auto text-center">

        {/* Ornament */}
        <div className="reveal text-champagne text-3xl mb-6" aria-hidden="true">✦</div>

        <h2 className="reveal section-title">{t.welcome.title}</h2>

        <div className="reveal gold-divider my-6" />

        {/* Venue card */}
        <div className="reveal mt-10 bg-white/70 backdrop-blur-sm p-8 md:p-12 shadow-sm border border-cream/80">

          {/* Location icon */}
          <svg
            className="w-8 h-8 text-champagne mx-auto mb-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <p className="font-serif-body text-xl md:text-2xl text-darkText leading-relaxed">
            {t.welcome.body}
          </p>

          <div className="gold-divider my-8" />

          {/* Address block */}
          <address className="not-italic font-serif-body text-lg text-lightText leading-loose">
            <strong className="font-serif-display text-darkText text-xl">Phoenix Cernica</strong>
            <br />
            Strada Strandului 62
            <br />
            077145 Pantelimon, Romania
          </address>

          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-8 inline-flex"
            aria-label="Open venue location in Google Maps"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t.welcome.mapsButton}
          </a>
        </div>

        {/* Decorative floral */}
        <div className="reveal ornament mt-12" aria-hidden="true">— ✦ —</div>
      </div>
    </div>
  )
}
