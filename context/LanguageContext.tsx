'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import en from '@/locales/en.json'
import ro from '@/locales/ro.json'
import sk from '@/locales/sk.json'

export type Locale = 'en' | 'ro' | 'sk'

const translations: Record<Locale, typeof en> = { en, ro, sk }

interface LanguageContextType {
  locale: Locale
  t: typeof en
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  t: en,
  setLocale: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = l
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
