'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const ICONS = ['💍', '📸', '🍽️', '🎶']

export default function Program() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // GSAP stagger
  useEffect(() => {
    const load = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      gsap.fromTo(
        '.timeline-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#program',
            start: 'top 70%',
          },
        }
      )
    }
    load()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="section-base"
      style={{ background: 'linear-gradient(180deg, #DFE0E1 0%, #E1BF92 100%)' }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="reveal text-champagne text-3xl mb-6" aria-hidden="true">✦</div>
          <h2 className="reveal section-title">{t.program.title}</h2>
          <div className="reveal gold-divider my-6" />
          <p className="reveal section-subtitle">{t.program.subtitle}</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — desktop only */}
          <div className="timeline-line hidden md:block" aria-hidden="true" />

          <div className="flex flex-col gap-12">
            {t.program.events.map((event, i) => {
              const isLeft = i % 2 === 0
              return (
                <div
                  key={i}
                  className={`timeline-card relative flex flex-col md:flex-row items-center gap-6 opacity-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content card */}
                  <div
                    className={`flex-1 bg-white/80 backdrop-blur-sm p-6 md:p-8 shadow-sm border border-cream/80 ${
                      isLeft ? 'md:text-right' : 'md:text-left'
                    } text-center md:text-auto`}
                  >
                    <span className="font-serif-display text-champagne text-3xl block mb-1">
                      {event.time}
                    </span>
                    <h3 className="font-serif-display text-xl text-darkText mt-2">{event.title}</h3>
                    <p className="font-serif-body text-lightText mt-1 italic">{event.description}</p>
                  </div>

                  {/* Centre dot */}
                  <div
                    className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: '#FFFFFF',
                      boxShadow: '0 0 0 4px #E1BF92, 0 0 0 5px #A8A6A1',
                    }}
                    aria-hidden="true"
                  >
                    {ICONS[i]}
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </div>
              )
            })}
          </div>
        </div>

        <div className="reveal ornament mt-16" aria-hidden="true">— ✦ —</div>
      </div>
    </div>
  )
}
