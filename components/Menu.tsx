'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'

export default function Menu() {
  const { t } = useLanguage()
  const f = t.rsvp.form
  const ff = f as any
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05 }
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
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-12">
          <div className="reveal text-champagne text-3xl mb-6" aria-hidden="true">✦</div>
          <h2 className="reveal section-title">{f.mealTitle}</h2>
          <div className="reveal gold-divider my-6" />
        </div>

        <div className="reveal space-y-8">

          {/* Starters & Canapés */}
          <div>
            <h3 className="font-serif-display text-lg text-champagne mb-3 text-center">{f.starterTitle}</h3>
            <div className="bg-white/70 p-4 border border-cream/80 text-center">
              <div className="mb-4 overflow-hidden rounded-sm">
                <Image
                  src="/images/food/canapes.jpg"
                  alt="Canapés selection"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  sizes="(max-width: 768px) 100vw, 700px"
                />
              </div>
              <p className="font-serif-body text-sm italic text-lightText mb-3">{f.starterNote}</p>
              <ul className="list-none space-y-1">
                {f.starters.map((s, i) => (
                  <li key={i} className="font-body text-sm text-darkText">{s}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Courses */}
          <div>
            <h3 className="font-serif-display text-lg text-champagne mb-3 text-center">{f.mainCourseTitle}</h3>
            <div className="bg-white/70 p-4 border border-cream/80 space-y-6 text-center">
              {/* Fish Course */}
              <div>
                <div className="mb-2 overflow-hidden rounded-sm">
                  <Image
                    src="/images/food/fish-course.jpg"
                    alt="Fish course"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                </div>
                <p className="font-body text-sm text-darkText">{(f.mainCourseItems as string[])[0]}</p>
              </div>
              {/* Traditional Course */}
              <div>
                <div className="mb-2 overflow-hidden rounded-sm">
                  <Image
                    src="/images/food/traditional-course.jpg"
                    alt="Traditional course"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                </div>
                <p className="font-body text-sm text-darkText">{(f.mainCourseItems as string[])[1]}</p>
              </div>
              {/* Main Course */}
              <div>
                <div className="mb-2 overflow-hidden rounded-sm">
                  <Image
                    src="/images/food/main-course.jpg"
                    alt="Main course"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 700px"
                  />
                </div>
                <p className="font-body text-sm text-darkText">{(f.mainCourseItems as string[])[2]}</p>
              </div>
            </div>
          </div>

          {/* Dessert */}
          <div>
            <h3 className="font-serif-display text-lg text-champagne mb-3 text-center">{f.dessertTitle}</h3>
            <div className="bg-white/70 p-4 border border-cream/80 text-center">
              <p className="font-body text-sm text-darkText">{f.dessertItem}</p>
            </div>
          </div>

          {/* Drinks Menu */}
          <div>
            <h3 className="font-serif-display text-lg text-champagne mb-3 text-center">{ff.drinksMenuTitle}</h3>
            <div className="bg-white/70 p-4 border border-cream/80 text-center">
              <ul className="list-none space-y-1">
                {(ff.drinksMenuItems as string[]).map((item: string, i: number) => (
                  <li key={i} className="font-body text-sm text-darkText">{item}</li>
                ))}
              </ul>
              <p className="font-serif-body text-xs italic text-lightText mt-3">{ff.drinksMenuNote}</p>
            </div>
          </div>

          {/* Kids Menu */}
          <div>
            <h3 className="font-serif-display text-lg text-champagne mb-3 text-center">{ff.kidsMenuTitle}</h3>
            <div className="bg-white/70 p-4 border border-cream/80 text-center">
              <ul className="list-none space-y-1">
                {(ff.kidsMenuItems as string[]).map((item: string, i: number) => (
                  <li key={i} className="font-body text-sm text-darkText">{item}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <div className="reveal ornament mt-12 text-center" aria-hidden="true">— ✦ —</div>
      </div>
    </div>
  )
}
