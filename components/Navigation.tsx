'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLanguage, type Locale } from '@/context/LanguageContext'

const SECTIONS = ['welcome', 'program', 'rsvp', 'menu', 'accommodation', 'honeymoon', 'parking', 'contact'] as const

export default function Navigation() {
  const { t, locale, setLocale } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)

      // Highlight active section
      const current = SECTIONS.find((id) => {
        const el = document.getElementById(id)
        if (!el) return false
        const { top, bottom } = el.getBoundingClientRect()
        return top <= 100 && bottom > 100
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMenuOpen(false)
  }, [])

  const navBg = scrolled
    ? 'bg-ivory/95 backdrop-blur-sm shadow-sm'
    : 'bg-transparent'

  const textColor = scrolled ? 'text-darkText' : 'text-white'
  const logoColor = scrolled ? 'text-champagne' : 'text-gold-light'

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">

        {/* Logo / Monogram */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`font-serif-display text-xl md:text-2xl tracking-widest ${logoColor} transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne`}
          aria-label="Scroll to top"
        >
          R&R
        </button>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-8" role="list">
          {SECTIONS.map((id) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`text-xs tracking-[0.15em] uppercase font-body transition-colors duration-200 hover:text-champagne focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${
                  activeSection === id ? 'text-champagne' : textColor
                }`}
              >
                {t.nav[id as keyof typeof t.nav]}
              </button>
            </li>
          ))}
        </ul>

        {/* Right side: language switcher + mobile menu */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher locale={locale} setLocale={setLocale} textColor={textColor} />

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden flex flex-col gap-[5px] p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne ${textColor}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!menuOpen}
      >
        <ul className="bg-ivory/98 backdrop-blur-sm px-6 py-4 flex flex-col gap-4 border-t border-cream">
          {SECTIONS.map((id) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`text-xs tracking-[0.15em] uppercase font-body text-darkText hover:text-champagne transition-colors duration-200 w-full text-left py-1 ${
                  activeSection === id ? 'text-champagne' : ''
                }`}
              >
                {t.nav[id as keyof typeof t.nav]}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

function LanguageSwitcher({
  locale,
  setLocale,
  textColor,
}: {
  locale: Locale
  setLocale: (l: Locale) => void
  textColor: string
}) {
  const locales: Locale[] = ['en', 'ro', 'sk']
  const labels: Record<Locale, string> = { en: 'EN', ro: 'RO', sk: 'SK' }

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language selection">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          <button
            onClick={() => setLocale(l)}
            className={`text-xs tracking-wider font-body transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne px-1 py-0.5 ${
              locale === l ? 'text-champagne font-bold' : `${textColor} hover:text-champagne`
            }`}
            aria-pressed={locale === l}
            aria-label={`Switch to ${l.toUpperCase()}`}
          >
            {labels[l]}
          </button>
          {i < locales.length - 1 && (
            <span className={`text-xs ${textColor} opacity-40`}>/</span>
          )}
        </span>
      ))}
    </div>
  )
}
