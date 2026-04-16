'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

function LoginContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const role = searchParams.get('role') ?? 'volunteer'
  const offer = searchParams.get('offer') ?? ''
  
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const offerLabels: Record<string, string> = {
    shelter: 'Abrigo',
    transport: 'Transporte',
    boat: 'Barco / Lancha',
    volunteer: 'Voluntário',
  }

  const handleLogin = () => {
    setLoading(true)
    const phoneDigits = phone.replace(/\D/g, '')
    // Telefone curinga de teste
    if (phoneDigits === '5521123456789' || phoneDigits === '21123456789') {
      setTimeout(() => {
        router.push('/assist')
      }, 500)
    } else {
      setTimeout(() => {
        setLoading(false)
        alert('Telefone não cadastrado. Use o curinga 21 1234-56789 para testar.')
      }, 1000)
    }
  }

  const handleGoogleLogin = () => {
    setLoading(true)
    setTimeout(() => {
      router.push('/assist')
    }, 600)
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
      <div className="relative z-10 flex items-center gap-3 px-4 pt-14 pb-6">
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
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 font-semibold text-slate-800 transition-all active:scale-[0.97] disabled:opacity-75"
            style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
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

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-white/30 text-xs font-semibold">ou</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div className="px-4 py-3">
              <label className="text-white/50 text-xs font-semibold uppercase tracking-wide">Telefone</label>
              <div className="flex items-center gap-3 mt-1.5 focus-within:bg-white/5 px-2 py-1 -mx-2 rounded-lg transition-colors">
                <span className="text-white font-bold text-base">🇧🇷 +55</span>
                <input
                  type="tel"
                  placeholder="(21) 1234-56789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
                  className="flex-1 bg-transparent text-white placeholder-white/30 text-base font-semibold outline-none border-none"
                />
              </div>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 font-bold text-white font-headline text-base transition-all active:scale-[0.97] disabled:opacity-75"
              style={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)' }}
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `'FILL' 1` }}>sms</span>
                  Enviar código SMS
                </>
              )}
            </button>
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
