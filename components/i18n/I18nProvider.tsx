'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import en from '@/locales/en.json'
import ptBR from '@/locales/pt-BR.json'

export type Language = 'en' | 'pt-BR'

const messages = {
  en,
  'pt-BR': ptBR,
} as const

type I18nContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const getByPath = (obj: unknown, key: string): unknown => {
  return key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pt-BR')

  useEffect(() => {
    const stored = window.localStorage.getItem('conciergo.language')
    if (stored === 'en' || stored === 'pt-BR') setLanguageState(stored)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('conciergo.language', language)
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
  }, [])

  const t = useCallback(
    (key: string) => {
      const value = getByPath(messages[language], key)
      if (typeof value === 'string') return value
      const fallback = getByPath(messages.en, key)
      if (typeof fallback === 'string') return fallback
      return key
    },
    [language]
  )

  const value = useMemo<I18nContextValue>(() => ({ language, setLanguage, t }), [language, setLanguage, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('I18nProvider is missing')
  return ctx
}
