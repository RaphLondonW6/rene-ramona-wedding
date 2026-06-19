'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

const BG = '#E1BF92'

function Wave({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-0 w-full"
      style={{
        height: 'clamp(40px, 6vw, 80px)',
        display: 'block',
        ...(flip ? { bottom: 0, transform: 'scaleY(-1)' } : { top: 0 }),
      }}
      aria-hidden="true"
    >
      <path
        d="M0,0 L0,40 C180,80 360,10 540,45 C720,80 900,15 1080,50 C1260,80 1380,30 1440,40 L1440,0 Z"
        fill={BG}
      />
    </svg>
  )
}

export default function SectionImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        lineHeight: 0,
        opacity: 0,
        transform: 'translateY(40px)',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
      }}
    >
      <Wave />
      <Image
        src={src}
        alt={alt}
        width={2400}
        height={900}
        className="w-full h-auto object-cover"
        style={{ display: 'block' }}
        sizes="100vw"
      />
      <Wave flip />
    </div>
  )
}
