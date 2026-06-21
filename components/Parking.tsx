'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function Parking() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const p = (t as any).parking

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
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
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <div className="reveal text-champagne text-3xl mb-6" aria-hidden="true">✦</div>
          <h2 className="reveal section-title">{p.subtitle}</h2>
          <div className="reveal gold-divider my-6" />
          <p className="reveal font-serif-body text-lg md:text-xl text-darkText leading-relaxed max-w-2xl mx-auto">
            {p.body}
          </p>
        </div>

        <div className="reveal text-center">
          <a
            href="/ParkingInstructions.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            {p.parkingButton ?? 'Parking Instructions'}
          </a>
        </div>

        <div className="reveal ornament mt-12 text-center" aria-hidden="true">— ✦ —</div>
      </div>
    </div>
  )
}
