'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n, type Language } from '@/components/i18n/I18nProvider'

export default function HomePage() {
  const { language, setLanguage, t } = useI18n()
  const [theme, setTheme] = useState<'light'|'dark'>('light')

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark')
    }
  }, [])

  const toggleTheme = (newTheme: 'light'|'dark') => {
    setTheme(newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <main className="min-proto-h w-full flex flex-col transition-all duration-500 ease-in-out" style={{ background: theme === 'dark' ? '#070f1a' : '#f8fafc' }}>
      {/* Animated background blobs - only visible in dark mode or subtle in light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000" style={{ opacity: theme === 'dark' ? 1 : 0.4 }}>
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-20 login-wave-1" style={{ background: 'radial-gradient(circle, #1565C0, transparent)' }} />
        <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full opacity-15 login-wave-2" style={{ background: 'radial-gradient(circle, #E53935, transparent)' }} />
        <div className="absolute bottom-20 left-1/4 w-48 h-48 rounded-full opacity-10 login-float-1" style={{ background: 'radial-gradient(circle, #43A047, transparent)' }} />
      </div>

      {/* Top Bar Controls */}
      <div className="relative z-20 flex justify-between items-center px-6 pt-6">
        {/* Language Toggle */}
        <div className="flex bg-white/10 dark:bg-white/10 backdrop-blur-md p-1 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
          <button 
            onClick={() => setLanguage('pt-BR')} 
            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${language === 'pt-BR' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 dark:text-white/60'}`}
          >
            PT
          </button>
          <button 
            onClick={() => setLanguage('en')} 
            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${language === 'en' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 dark:text-white/60'}`}
          >
            EN
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="flex bg-white/10 dark:bg-white/10 backdrop-blur-md p-1 rounded-xl border border-black/5 dark:border-white/5 shadow-sm">
          <button 
            onClick={() => toggleTheme('light')} 
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${theme === 'light' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 dark:text-white/60'}`}
          >
            <span className="material-symbols-outlined text-[18px]">light_mode</span>
          </button>
          <button 
            onClick={() => toggleTheme('dark')} 
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${theme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 dark:text-white/60'}`}
          >
            <span className="material-symbols-outlined text-[18px]">dark_mode</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex flex-col items-center pt-8 pb-6 px-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #E53935, #C62828)' }}>
          <span className="material-symbols-outlined text-white text-[36px]" style={{ fontVariationSettings: `'FILL' 1` }}>
            water
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-headline text-center leading-tight transition-colors">
          {t('rescue.title')}
        </h1>
        <p className="text-slate-500 dark:text-white/60 text-sm mt-1 text-center transition-colors">
          {t('rescue.subtitle')}
        </p>

        {/* Alert banner */}
        <div className="mt-5 w-full flex items-center gap-2.5 rounded-2xl px-4 py-3 bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 dark:border-red-500/35 transition-all shadow-sm">
          <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px] shrink-0" style={{ fontVariationSettings: `'FILL' 1` }}>
            warning
          </span>
          <p className="text-red-800 dark:text-red-300 text-xs font-semibold leading-snug transition-colors">
            {t('rescue.alert')} <strong className="font-extrabold uppercase tracking-tight">{t('rescue.alertLevel')}</strong>
          </p>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 gap-4 pb-36">
        <Link href="/help" className="block group">
          <div className="flex items-center gap-4 rounded-2xl p-5 transition-all active:scale-[0.97] bg-white dark:bg-red-800/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_12px_32px_-8px_rgba(198,40,40,0.5)] border border-slate-100 dark:border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent dark:hidden" />
            
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-red-600 text-white shrink-0 relative z-10 shadow-lg shadow-red-600/20">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: `'FILL' 1` }}>
                sos
              </span>
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-slate-900 dark:text-white font-bold text-xl font-headline leading-tight transition-colors">{t('rescue.needHelp')}</p>
              <p className="text-slate-500 dark:text-white/65 text-sm mt-0.5 transition-colors">{t('rescue.needHelpDesc')}</p>
            </div>
            <span className="material-symbols-outlined text-slate-300 dark:text-white/50 text-[24px] relative z-10 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </Link>

        <Link href="/login?role=volunteer" className="block group">
          <div className="flex items-center gap-4 rounded-2xl p-5 transition-all active:scale-[0.97] bg-white dark:bg-blue-800/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_12px_32px_-8px_rgba(21,101,192,0.5)] border border-slate-100 dark:border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent dark:hidden" />
            
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 text-white shrink-0 relative z-10 shadow-lg shadow-blue-600/20">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: `'FILL' 1` }}>
                volunteer_activism
              </span>
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-slate-900 dark:text-white font-bold text-xl font-headline leading-tight transition-colors">{t('rescue.canHelp')}</p>
              <p className="text-slate-500 dark:text-white/65 text-sm mt-0.5 transition-colors">{t('rescue.canHelpDesc')}</p>
            </div>
            <span className="material-symbols-outlined text-slate-300 dark:text-white/50 text-[24px] relative z-10 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </Link>

        <Link href="/nearby" className="block group">
          <div className="flex items-center gap-4 rounded-2xl p-5 transition-all active:scale-[0.97] bg-white dark:bg-emerald-800/90 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_12px_32px_-8px_rgba(27,94,32,0.5)] border border-slate-100 dark:border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent dark:hidden" />
            
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-600 text-white shrink-0 relative z-10 shadow-lg shadow-emerald-600/20">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: `'FILL' 1` }}>
                map
              </span>
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-slate-900 dark:text-white font-bold text-xl font-headline leading-tight transition-colors">{t('rescue.nearbyStatus')}</p>
              <p className="text-slate-500 dark:text-white/65 text-sm mt-0.5 transition-colors">{t('rescue.nearbyStatusDesc')}</p>
            </div>
            <span className="material-symbols-outlined text-slate-300 dark:text-white/50 text-[24px] relative z-10 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </Link>
      </div>

      <footer className="relative z-10 pb-10 px-6 text-center">
        <p className="text-slate-400 dark:text-white/30 text-xs transition-colors">
          {t('rescue.emergencyInfo')}
        </p>
      </footer>
    </main>
  )
}
