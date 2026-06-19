'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer
      className="py-12 px-6 text-center"
      style={{ background: '#2C2C2C', color: '#9A8878' }}
    >
      {/* Monogram */}
      <p
        className="font-serif-display text-3xl mb-4"
        style={{ color: '#A8A6A1' }}
        aria-hidden="true"
      >
        R ✦ R
      </p>

      <div
        className="mx-auto mb-6"
        style={{
          width: '60px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #A8A6A1, transparent)',
        }}
      />

      <p className="font-serif-body text-sm italic">
        {t.footer.made}{' '}
        <span className="font-serif-display not-italic" style={{ color: '#A8A6A1' }}>
          {t.footer.names}
        </span>
      </p>
      <p className="font-body text-xs mt-1 tracking-widest" style={{ color: '#6B5E54' }}>
        {t.footer.date}
      </p>

      <p className="font-body text-[10px] mt-6 tracking-wider" style={{ color: '#4A3F37' }}>
        © {new Date().getFullYear()} · René & Ramona
      </p>
    </footer>
  )
}
