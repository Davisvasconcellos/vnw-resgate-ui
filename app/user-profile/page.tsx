'use client'

import AppHeader from '@/components/headers/AppHeader'
import BottomNavWrapper from '@/components/BottomNavWrapper'
import Image from 'next/image'
import { useI18n } from '@/components/i18n/I18nProvider'
import { useState, useEffect } from 'react'

export default function UserProfile() {
  const { t, language, setLanguage } = useI18n()
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
    <div className="bg-surface dark:bg-[#0a1628] text-on-surface dark:text-white min-h-screen pb-32 transition-colors">
      <AppHeader avatarAlt="User profile photo" />
      <main className="pt-24 px-4 max-w-3xl mx-auto">
        <section className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-white/10">
              <Image
                alt="Alex Morgan"
                width={128}
                height={128}
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHknwU8WUeEgmaMxkDFv1Im_6etFH0PzGo6RvcY453gGz24SYw2-s2dtx4NJCIw1X_xskiBFNRTVI9oLqtImZ8G01F1Kqbl78cZcJHQc3eoOZfsrGXTN7JsPSupVOvR4_7LEEwYo5zq7its8_fnqe8Y4nu233Rgy8ErMb9elzI9VJZR1YUvSSB-tKJSKLTjSQEB6kRE6IVdrGbh-bxDeHi7-f6KquD2a2KSvng_6t_y5bw39Atru-KPlsyS90Q_JOu3caZst1Ge9A"
              />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold font-headline tracking-tight text-on-surface dark:text-white mb-2">
            Alex Morgan
          </h2>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-primary text-sm">
              location_on
            </span>
            <span className="text-on-surface-variant dark:text-slate-400 text-sm font-medium">
              Rio de Janeiro, RJ
            </span>
          </div>
        </section>

        <section className="space-y-6">
          {/* Card: Endereços */}
          <div className="bg-surface-container-lowest dark:bg-white/5 border border-outline-variant/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">map</span>
              </div>
              <p className="text-sm font-black uppercase tracking-widest">{t('request.location')}</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-dashed border-slate-200 dark:border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Endereço Atual</p>
                    <p className="font-bold text-sm text-slate-800 dark:text-white">Rua das Amoreiras, 1500 - Bloco B</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Jacarepaguá, Rio de Janeiro</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1565C0] bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-full shadow-sm">
                    Ativo
                  </span>
                </div>
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white font-bold py-3.5 rounded-2xl active:scale-95 transition-transform text-xs uppercase tracking-widest">
                <span className="material-symbols-outlined text-[18px]">add_location</span>
                Adicionar novo endereço
              </button>
            </div>
          </div>

          {/* Card: Configurações */}
          <div className="bg-surface-container-lowest dark:bg-white/5 border border-outline-variant/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <span className="material-symbols-outlined text-[24px]">settings</span>
              </div>
              <p className="text-sm font-black uppercase tracking-widest">Configurações</p>
            </div>

            <div className="space-y-6">
              {/* Idioma */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Idioma / Language</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setLanguage('pt-BR')}
                    className={`py-3.5 rounded-2xl font-bold text-xs transition-all ${
                    language === 'pt-BR' 
                      ? 'bg-[#1565C0] text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-slate-50 dark:bg-white/5 text-slate-500'
                    }`}
                  >
                    Português
                  </button>
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`py-3.5 rounded-2xl font-bold text-xs transition-all ${
                    language === 'en' 
                      ? 'bg-[#1565C0] text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-slate-50 dark:bg-white/5 text-slate-500'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Tema */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Tema / Theme</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => toggleTheme('light')}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-xs transition-all ${
                    theme === 'light' 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                      : 'bg-slate-50 dark:bg-white/5 text-slate-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">light_mode</span>
                    Claro
                  </button>
                  <button 
                    onClick={() => toggleTheme('dark')}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-xs transition-all ${
                    theme === 'dark' 
                      ? 'bg-slate-900 border border-white/20 text-white shadow-lg shadow-black/40' 
                      : 'bg-slate-50 dark:bg-white/5 text-slate-500'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                    Escuro
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <button className="w-full py-4 text-red-500 font-black uppercase tracking-[0.2em] text-xs">
            Sair da conta
          </button>
        </section>
      </main>
      <BottomNavWrapper />
    </div>
  )
}
