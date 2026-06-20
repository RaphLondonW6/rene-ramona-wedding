'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import { accommodations } from '@/lib/accommodations'

export default function Accommodation() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05 }
    )
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // GSAP stagger for cards
  useEffect(() => {
    const load = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsap.fromTo(
        '.accom-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: '#accommodation', start: 'top 70%' },
        }
      )
    }
    load()
  }, [])

  const priceLabel: Record<string, string> = {
    '€': 'Budget',
    '€€': 'Mid-range',
    '€€€': 'Upscale',
    '€€€€': 'Luxury',
  }

  return (
    <div
      ref={sectionRef}
      className="section-base"
      style={{ background: 'linear-gradient(180deg, #E1BF92 0%, #DFE0E1 50%, #E1BF92 100%)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="reveal text-champagne text-3xl mb-6" aria-hidden="true">✦</div>
          <h2 className="reveal section-title">{t.accommodation.title}</h2>
          <div className="reveal gold-divider my-6" />
          <p className="reveal section-subtitle !text-white">{t.accommodation.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {accommodations.map((hotel) => (
            <article
              key={hotel.id}
              className="accom-card opacity-0 flex flex-col"
              aria-label={`${hotel.name}, ${hotel.distance} ${t.accommodation.distanceFrom}`}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={hotel.image}
                  alt={hotel.name}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Distance badge */}
                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 tracking-wider">
                  {hotel.distance} {t.accommodation.distanceFrom}
                </div>
                {/* Stars */}
                <div className="absolute top-3 right-3 text-champagne text-xs">
                  {'★'.repeat(hotel.stars)}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                <span className="text-[10px] tracking-[0.2em] uppercase text-lightText mb-1">
                  {hotel.type} · <span title={priceLabel[hotel.priceRange]}>{hotel.priceRange}</span>
                </span>
                <h3 className="font-serif-display text-base text-darkText mb-2 leading-snug">
                  {hotel.name}
                </h3>
                <p className="font-body text-xs text-lightText leading-relaxed flex-1">
                  {hotel.description}
                </p>
                <a
                  href={hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-xs mt-4 w-full"
                  aria-label={`Book ${hotel.name}`}
                >
                  {t.accommodation.bookButton}
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="reveal ornament mt-16" aria-hidden="true">— ✦ —</div>
      </div>
    </div>
  )
}
