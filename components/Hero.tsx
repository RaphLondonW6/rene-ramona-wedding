'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

const WEDDING_DATE = new Date('2027-06-12T16:00:00')

function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  return time
}

export default function Hero() {
  const { t } = useLanguage()
  const countdown = useCountdown(WEDDING_DATE)
  const heroRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !overlayRef.current) return
      const y = window.scrollY
      heroRef.current.style.transform = `translateY(${y * 0.4}px)`
      overlayRef.current.style.opacity = String(1 - y / 700)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // GSAP entrance animation
  useEffect(() => {
    const loadGsap = async () => {
      const { gsap } = await import('gsap')
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo('.hero-names', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.4 })
        .fromTo('.hero-divider', { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, '-=0.6')
        .fromTo('.hero-date', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, '-=0.4')
        .fromTo('.hero-tagline', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.4')
        .fromTo('.hero-countdown', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.2')
        .fromTo('.hero-scroll', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.2')
    }
    loadGsap()
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden flex items-center justify-center">

      {/* Background video with parallax wrapper */}
      <div ref={heroRef} className="absolute inset-0 will-change-transform">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          poster="/images/hero.jpg"
        >
          <source src="/videos/main.mp4" type="video/mp4" />
          {/* Fallback image if video can't play */}
          <img
            src="/images/hero.jpg"
            alt="Wedding venue"
            className="w-full h-full object-cover object-center"
          />
        </video>
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      {/* Overlay content */}
      <div
        ref={overlayRef}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        {/* Ornamental top */}
        <div className="hero-names mb-2 opacity-0">
          <div className="text-gold-light text-sm tracking-[0.3em] uppercase font-body mb-6">
            ✦ ✦ ✦
          </div>
          <h1 className="font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-tight">
            {t.hero.names}
          </h1>
        </div>

        <div
          className="hero-divider mx-auto my-6"
          style={{
            width: '120px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #A8A6A1, transparent)',
            transformOrigin: 'center',
          }}
        />

        <p className="hero-date font-serif-body text-2xl md:text-3xl text-white tracking-[0.2em] uppercase opacity-0">
          {t.hero.date}
        </p>

        <p className="hero-tagline font-serif-body text-lg md:text-xl text-white/80 mt-6 max-w-xl mx-auto leading-relaxed italic opacity-0">
          {t.hero.tagline}
        </p>

        {/* Countdown */}
        <div className="hero-countdown mt-10 flex items-center justify-center gap-4 sm:gap-8 opacity-0">
          {(
            [
              [countdown.days, t.hero.countdown.days],
              [countdown.hours, t.hero.countdown.hours],
              [countdown.minutes, t.hero.countdown.minutes],
              [countdown.seconds, t.hero.countdown.seconds],
            ] as [number, string][]
          ).map(([val, label]) => (
            <div key={label} className="flex flex-col items-center">
              <span className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-white tabular-nums">
                {pad(val)}
              </span>
              <span className="text-gold-light text-[10px] tracking-[0.2em] uppercase mt-1 font-body">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0">
        <span className="text-white/60 text-[10px] tracking-[0.25em] uppercase font-body">
          {t.hero.scroll}
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent animate-float" />
      </div>

      {/* Bottom wave */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-0 w-full z-20"
        style={{ height: 'clamp(40px, 6vw, 80px)', display: 'block' }}
        aria-hidden="true"
      >
        <path
          d="M0,80 L0,40 C180,0 360,70 540,35 C720,0 900,65 1080,30 C1260,0 1380,50 1440,40 L1440,80 Z"
          fill="#E1BF92"
        />
      </svg>
    </div>
  )
}
