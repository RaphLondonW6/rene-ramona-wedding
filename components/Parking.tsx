'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
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

  const steps = [
    { src: '/images/parking/step1.jpg', label: p.step1 },
    { src: '/images/parking/step2.jpg', label: p.step2 },
    { src: '/images/parking/step3.jpg', label: p.step3 },
  ]

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

        {/* Step-by-step images — stacked vertically, full width */}
        <div className="reveal flex flex-col gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <span className="font-serif-display text-sm text-champagne tracking-widest uppercase mb-1">
                {step.label}
              </span>
              <div className="w-full overflow-hidden border border-cream/80 shadow-sm">
                <Image
                  src={step.src}
                  alt={`${step.label} — parking directions`}
                  width={1200}
                  height={900}
                  className="w-full h-auto"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="reveal ornament mt-12 text-center" aria-hidden="true">— ✦ —</div>
      </div>
    </div>
  )
}
