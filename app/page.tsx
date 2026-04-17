'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function HomePage() {
  const { language, setLanguage, t } = useI18n()
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  const [isLogged, setIsLogged] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('vnw_token')
    const user = localStorage.getItem('vnw_user')
    if (token) {
      setIsLogged(true)
      if (user) {
        try {
          setUserProfile(JSON.parse(user))
        } catch (e) {
          console.error('Erro ao parsear usuário', e)
        }
      }
    }
    
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark')
    }
  }, [])

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { auth, googleProvider, signInWithPopup } = await import('@/services/firebase')
      const { api } = await import('@/services/api')
      
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await api.post('/auth/google', { idToken });

      if (response.data.success) {
        localStorage.setItem('vnw_token', response.data.data.token);
        localStorage.setItem('vnw_user', JSON.stringify(response.data.data.user));
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro no Google Login', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleTheme = (newTheme: 'light'|'dark') => {
    setTheme(newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <main className="min-proto-h w-full flex flex-col bg-[#f8fafc] dark:bg-[#0a1628] transition-all duration-500 ease-in-out">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000" style={{ opacity: theme === 'dark' ? 1 : 0.4 }}>
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-20 login-wave-1" style={{ background: 'radial-gradient(circle, #1565C0, transparent)' }} />
        <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full opacity-15 login-wave-2" style={{ background: 'radial-gradient(circle, #E53935, transparent)' }} />
        <div className="absolute bottom-20 left-1/4 w-48 h-48 rounded-full opacity-10 login-float-1" style={{ background: 'radial-gradient(circle, #43A047, transparent)' }} />
      </div>

      {/* Top Bar Controls */}
      <div className="relative z-20 flex justify-between items-center px-6 pt-6">
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
      <header className="relative z-10 flex flex-col items-center pt-8 pb-4 px-6">
        <div className="relative group">
          {isLogged && userProfile?.avatar_url ? (
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-lg shadow-blue-500/20 mb-4 animate-in zoom-in">
              <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-xl" style={{ background: 'linear-gradient(135deg, #E53935, #C62828)' }}>
              <span className="material-symbols-outlined text-white text-[36px]" style={{ fontVariationSettings: `'FILL' 1` }}>
                water
              </span>
            </div>
          )}
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-headline text-center leading-tight transition-colors">
          {isLogged && userProfile?.name 
            ? `Olá, ${userProfile.name.split(' ')[0]}` 
            : 'VNW Resgate'}
        </h1>
        <p className="text-slate-500 dark:text-white/60 text-sm mt-1 text-center font-medium">
          Apoio em situações de enchente
        </p>

        {/* Informative Banner */}
        {!isLogged && (
          <div className="mt-8 w-full flex items-start gap-4 rounded-3xl px-6 py-5 bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
               <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[24px]">info</span>
            </div>
            <div>
              <p className="text-slate-900 dark:text-slate-100 text-xs font-black leading-tight uppercase tracking-wider mb-1">Acesso Priorizado</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug">
                O uso é livre, mas usuários logados ganham selo <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-tighter">Verificado</span> e suas solicitações são atendidas com maior agilidade.
              </p>
            </div>
          </div>
        )}
      </header>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 gap-3 pb-36 max-w-lg mx-auto w-full">
        <Link href="/help" className="block group">
          <div className="flex items-center gap-4 rounded-3xl p-5 transition-all active:scale-[0.97] bg-white dark:bg-white/5 backdrop-blur-md shadow-sm border border-slate-100 dark:border-white/10 overflow-hidden relative">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-600 text-white shrink-0 relative z-10 shadow-lg shadow-red-600/10">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: `'FILL' 1` }}>
                sos
              </span>
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-slate-900 dark:text-white font-black text-lg font-headline leading-tight">Preciso de ajuda</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium">Resgate, médico, abrigo e mais</p>
            </div>
            <span className="material-symbols-outlined text-slate-300 dark:text-white/20 text-[20px] relative z-10 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </Link>

        <Link href={isLogged ? "/assist" : "/login?role=volunteer"} className="block group">
          <div className="flex items-center gap-4 rounded-3xl p-5 transition-all active:scale-[0.97] bg-white dark:bg-white/5 backdrop-blur-md shadow-sm border border-slate-100 dark:border-white/10 overflow-hidden relative">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shrink-0 relative z-10 shadow-lg shadow-blue-600/10">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: `'FILL' 1` }}>
                volunteer_activism
              </span>
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-slate-900 dark:text-white font-black text-lg font-headline leading-tight">Posso ajudar</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium">Ofereça força de trabalho ou apoio</p>
            </div>
            <span className="material-symbols-outlined text-slate-300 dark:text-white/20 text-[20px] relative z-10 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </Link>

        <Link href="/nearby" className="block group">
          <div className="flex items-center gap-4 rounded-3xl p-5 transition-all active:scale-[0.97] bg-white dark:bg-white/5 backdrop-blur-md shadow-sm border border-slate-100 dark:border-white/10 overflow-hidden relative">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white shrink-0 relative z-10 shadow-lg shadow-emerald-600/10">
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: `'FILL' 1` }}>
                map
              </span>
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-slate-900 dark:text-white font-black text-lg font-headline leading-tight">Situação da região</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium">Ver mapa e pedidos locais</p>
            </div>
            <span className="material-symbols-outlined text-slate-300 dark:text-white/20 text-[20px] relative z-10 group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </Link>

        {/* GOOGLE LOGIN BUTTON */}
        {!isLogged ? (
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-6 flex items-center justify-center gap-4 w-full bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 rounded-2xl py-4 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-slate-800 dark:text-white font-black text-sm tracking-tight uppercase">Entrar com Google</span>
              </>
            )}
          </button>
        ) : (
          <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
             <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-1">Status Ativo</p>
             <p className="text-slate-400 dark:text-white/20 text-[11px] font-medium italic">Você está logado e verificado pela rede.</p>
          </div>
        )}
      </div>

      <footer className="relative z-10 pb-10 px-6 text-center">
        <p className="text-slate-400 dark:text-white/30 text-[10px] font-medium leading-relaxed">
          {t('rescue.emergencyInfo')}
        </p>
      </footer>
    </main>
  )
}
