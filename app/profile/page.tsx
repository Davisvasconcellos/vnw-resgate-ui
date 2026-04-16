'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ProfilePage() {
  const [lang, setLang] = useState<'pt'|'en'>('pt')
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

  const roleNameMap: Record<string, string> = {
    shelter: 'Administrador de Abrigo',
    transport: 'Motorista Voluntário',
    boat: 'Condutor de Embarcação',
    volunteer: 'Voluntário'
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-28 transition-colors">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-700 px-4 py-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white font-headline">Seu Perfil</h1>
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-6">
        
        {/* User Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[32px]">person</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800 dark:text-white">Seu Nome</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">+55 (48) 99999-9999</p>
            {role && role !== 'civilian' && (
              <span className="inline-block mt-2 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-1 rounded-md">
                {roleNameMap[role] || role}
              </span>
            )}
          </div>
        </div>

        {/* Settings */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-1">Configurações</h3>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">language</span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Idioma</p>
                  <p className="text-xs text-slate-400">Language preference</p>
                </div>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                <button 
                  onClick={() => setLang('pt')} 
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'pt' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400'}`}
                >
                  PT
                </button>
                <button 
                  onClick={() => setLang('en')} 
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400'}`}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 flex-wrap gap-2">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="material-symbols-outlined text-slate-400">palette</span>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Modo Econômico (Dark)</p>
                  <p className="text-[10px] text-slate-400 leading-tight mt-0.5 max-w-[200px]">Economiza bateria em telas OLED, crucial em áreas sem energia.</p>
                </div>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg ml-auto">
                <button 
                  onClick={() => toggleTheme('light')} 
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${theme === 'light' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400'}`}
                >
                  <span className="material-symbols-outlined text-[16px]">light_mode</span> Claro
                </button>
                <button 
                  onClick={() => toggleTheme('dark')} 
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${theme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'}`}
                >
                  <span className="material-symbols-outlined text-[16px]">dark_mode</span> Escuro
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
