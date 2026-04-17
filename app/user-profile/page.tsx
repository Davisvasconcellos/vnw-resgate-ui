'use client'

import Link from 'next/link'
import AppHeader from '@/components/headers/AppHeader'
import BottomNavWrapper from '@/components/BottomNavWrapper'
import Image from 'next/image'
import { useI18n } from '@/components/i18n/I18nProvider'
import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import { auth } from '@/services/firebase'
import { signOut } from 'firebase/auth'
import { api } from '@/services/api'

export default function UserProfile() {
  const { t, language, setLanguage } = useI18n()
  const router = useRouter()
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  const [userName, setUserName] = useState('Novo Usuário do Resgate')
  const [userAvatar, setUserAvatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuDQJ79SKRFNGsHEtAaYR6DNVPPVXT3K6HSObJlm7WAF59SoggYSgGr6lz4FC-9WnnXLgN-s65UMaouGhFYGvwetJlLYCsWrAis21-fje2ENCANB0SxA-cAagAGc6ZvKz_jU6uhud5b3yHlbLJ12fr1kKEam3Ul_8eUWMXzLxOy4O9bzTW19a4_Hzxa37eYCxaLBx_URSCGx4QsDlYp-6wQ7i76GgtmM03xwZlJJ4oCZ6Z-FPKadbVBlBwN4gpVlBs3CA-Jy1F55u0o')

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark')
    }

    try {
      const stored = localStorage.getItem('vnw_user')
      if (stored) {
        const user = JSON.parse(stored)
        if (user.name) setUserName(user.name)
        if (user.avatar_url) setUserAvatar(user.avatar_url)
      }
    } catch(e) {}
  }, [])

  const toggleTheme = (newTheme: 'light'|'dark') => {
    setTheme(newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      const token = localStorage.getItem('vnw_token');
      if (token) await api.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch(e) {
      console.error('Erro logout', e);
    } finally {
      localStorage.removeItem('vnw_token');
      localStorage.removeItem('vnw_user');
      router.push('/login');
    }
  }

  return (
    <ProtectedRoute>
    <div className="bg-surface dark:bg-[#0a1628] text-on-surface dark:text-white min-h-screen pb-32 transition-colors">
      <AppHeader avatarAlt="User profile photo" />
      <main className="pt-24 px-4 max-w-3xl mx-auto">
        <section className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-white/10">
              <Image
                alt={userName}
                width={128}
                height={128}
                className="w-full h-full object-cover"
                src={userAvatar}
              />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold font-headline tracking-tight text-on-surface dark:text-white mb-2">
            {userName}
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
          
          <div className="pt-4 space-y-4">
            <Link
              href="/assist"
              className="w-full flex items-center justify-center gap-2 bg-[#1565C0] text-white font-black py-4 rounded-2xl active:scale-95 transition-transform text-xs uppercase tracking-[0.1em] shadow-lg shadow-blue-500/20"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Voltar ao Início
            </Link>

            <button 
              onClick={handleLogout} 
              className="w-full py-4 text-red-500 font-extrabold uppercase tracking-[0.2em] text-[10px] hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-colors"
            >
              Sair da conta
            </button>
          </div>
        </section>
      </main>
      <BottomNavWrapper />
    </div>
    </ProtectedRoute>
  )
}
