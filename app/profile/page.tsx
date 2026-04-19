'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n, Language } from '@/components/i18n/I18nProvider'
import AppHeader from '@/components/headers/AppHeader'

export default function ProfilePage() {
  const { t, language, setLanguage } = useI18n()
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  const [role, setRole] = useState<string | null>('civilian')

  useEffect(() => {
    // Check if body has dark mode class, fallback to light
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark')
    }
    const savedRole = localStorage.getItem('vnw_role')
    if (savedRole) setRole(savedRole)
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
    <main className="min-h-screen bg-surface dark:bg-inverse-surface pb-28 pt-16 transition-colors">
      <AppHeader />

      <div className="px-4 pt-8 space-y-8 max-w-2xl mx-auto w-full">
        <section>
          <h1 className="text-3xl font-extrabold font-headline text-on-surface dark:text-inverse-on-surface tracking-tight leading-tight">
            {t('profilePage.title')}
          </h1>
        </section>

        {/* User Card */}
        <div className="bg-surface-container-lowest dark:bg-surface-container-highest rounded-[2.5rem] p-6 border border-outline-variant/10 shadow-sm flex items-center gap-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[44px]">person</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-surface-container-lowest rounded-full shadow-lg border-4 border-surface-container-lowest dark:border-surface-container-highest flex items-center justify-center">
               <span className="material-symbols-outlined text-[14px] text-primary">edit</span>
            </div>
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-on-surface dark:text-inverse-on-surface font-headline leading-none">Davis Vasconcellos</h2>
            <p className="text-sm text-on-surface-variant dark:text-outline-variant font-medium mt-1">+55 (48) 99999-9999</p>
            {role && (
              <span className="inline-block mt-3 bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary-fixed text-[10px] font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-widest border border-secondary/10 shadow-sm">
                {t(`profilePage.roles.${role}`)}
              </span>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-on-surface uppercase tracking-widest px-1 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-primary" />
             {t('profilePage.settings')}
          </h3>
          
          <div className="bg-surface-container-lowest dark:bg-surface-container-highest rounded-[2rem] border border-outline-variant/10 shadow-sm overflow-hidden p-2 space-y-2">
            
            <div className="flex items-center justify-between p-4 bg-surface-container-low/30 dark:bg-surface/5 rounded-2xl border border-outline-variant/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/5">
                   <span className="material-symbols-outlined text-[20px]">language</span>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-on-surface font-headline">{t('profilePage.language')}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{t('profilePage.languageDesc')}</p>
                </div>
              </div>
              <div className="flex bg-surface-container-low p-1.5 rounded-2xl shadow-inner border border-outline-variant/5">
                <button 
                  onClick={() => setLanguage('pt-BR')} 
                  className={`px-5 py-2 text-xs font-extrabold rounded-xl transition-all ${language === 'pt-BR' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant'}`}
                >
                  PT
                </button>
                <button 
                  onClick={() => setLanguage('en')} 
                  className={`px-5 py-2 text-xs font-extrabold rounded-xl transition-all ${language === 'en' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant'}`}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container-low/30 dark:bg-surface/5 rounded-2xl border border-outline-variant/5">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary shrink-0 border border-secondary/5">
                   <span className="material-symbols-outlined text-[20px]">palette</span>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-on-surface font-headline">{t('profilePage.theme')}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{t('profilePage.themeDesc')}</p>
                </div>
              </div>
              <div className="flex bg-surface-container-low p-1.5 rounded-2xl shadow-inner border border-outline-variant/5">
                <button 
                  onClick={() => toggleTheme('light')} 
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${theme === 'light' ? 'bg-white text-on-surface shadow-md border border-outline-variant/10' : 'text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined text-[16px]">light_mode</span> {t('profilePage.light')}
                </button>
                <button 
                  onClick={() => toggleTheme('dark')} 
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${theme === 'dark' ? 'bg-inverse-surface text-inverse-on-surface shadow-md border border-outline-variant/10' : 'text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined text-[16px]">dark_mode</span> {t('profilePage.dark')}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
