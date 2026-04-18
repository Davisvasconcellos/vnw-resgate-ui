'use client'

import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'
import { auth, googleProvider, signInWithPopup } from '@/services/firebase'
import { api } from '@/services/api'

function LoginContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get('role') ?? 'volunteer'
  const offer = searchParams.get('offer') ?? ''
  
  const [loading, setLoading] = useState(false)
  const [debug, setDebug] = useState<string>('')

  // Redireciona se já estiver logado
  useEffect(() => {
    const token = localStorage.getItem('vnw_token')
    if (token) {
      router.replace('/assist')
    }
  }, [router])

  const offerLabels: Record<string, string> = {
    shelter: 'Abrigo',
    transport: 'Transporte',
    boat: 'Barco / Lancha',
    volunteer: 'Voluntário',
  }


  const handleGoogleLogin = async () => {
    setLoading(true);
    setDebug('Iniciando Google Login...');
    try {
      setDebug(`API BaseURL: ${api.defaults.baseURL}`);
      const result = await signInWithPopup(auth, googleProvider);
      setDebug('Google Auth OK. Pegando Token...');
      const idToken = await result.user.getIdToken();

      setDebug('Token obtido. Enviando para API...');
      const response = await api.post('/auth/google', { idToken });

      if (response.data.success) {
        setDebug('API Sucesso! Salvando sessão...');
        localStorage.setItem('vnw_token', response.data.data.token);
        localStorage.setItem('vnw_user', JSON.stringify(response.data.data.user));
        router.push('/assist');
      } else {
        setDebug(`API Erro: ${JSON.stringify(response.data)}`);
        alert('Falha ao autenticar com a API.');
      }
    } catch (error: any) {
      console.error('Erro no Google Login', error);
      const detail = error.response?.data?.message || error.message || 'Erro desconhecido';
      setDebug(`CATCH Erro: ${detail} | Config: ${JSON.stringify(error.config?.url)}`);
      alert('Erro na autenticação: ' + detail);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0d2247 40%, #1a3a6e 100%)' }}
    >
      {/* BG blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-20 login-wave-1" style={{ background: 'radial-gradient(circle, #1565C0, transparent)' }} />
        <div className="absolute bottom-20 -right-24 w-64 h-64 rounded-full opacity-15 login-wave-2" style={{ background: 'radial-gradient(circle, #43A047, transparent)' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 px-4 pt-14 pb-4">
        <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-white active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-6">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)', boxShadow: '0 12px 32px -8px rgba(21,101,192,0.6)' }}>
            <span className="material-symbols-outlined text-white text-[36px]" style={{ fontVariationSettings: `'FILL' 1` }}>volunteer_activism</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-headline">Acesse como voluntário</h1>
          <p className="text-white/60 text-sm mt-1 leading-snug">
            {t('assistPage.loginAlert')}
          </p>
        </div>

        {/* Login options */}
        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center gap-4 rounded-2xl px-5 py-5 font-semibold text-slate-800 transition-all active:scale-[0.97] disabled:opacity-75"
            style={{ background: 'white', boxShadow: '0 8px 32px -8px rgba(0,0,0,0.3)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="flex-1 text-left font-headline text-base">Entrar com Google</span>
            <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
          </button>

          {/* DEBUG AREA */}
          {debug && (
            <div className="p-4 bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
               <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Console Debug
               </p>
               <p className="text-white/70 text-[11px] font-mono break-all leading-relaxed whitespace-pre-wrap">
                  {debug}
               </p>
            </div>
          )}

          <div className="pt-4 text-center">
             <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em] mb-4">Em breve</p>
             <div className="flex gap-3">
                <div className="flex-1 py-3 rounded-xl border border-white/5 bg-white/5 text-white/30 text-xs font-bold uppercase tracking-widest cursor-not-allowed">
                   Login Email
                </div>
                <div className="flex-1 py-3 rounded-xl border border-white/5 bg-white/5 text-white/30 text-xs font-bold uppercase tracking-widest cursor-not-allowed">
                   Criar Conta
                </div>
             </div>
          </div>
        </div>

        <p className="text-white/25 text-xs text-center mt-8 leading-relaxed">
          Ao fazer login você concorda com os termos de uso e se compromete a atuar como voluntário de forma responsável.
        </p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0a1628, #1a3a6e)' }} />}>
      <LoginContent />
    </Suspense>
  )
}
