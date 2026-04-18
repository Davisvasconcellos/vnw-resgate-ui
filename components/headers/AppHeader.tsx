'use client'

import Image from 'next/image'
import Link from 'next/link'
import logo from '@/assets/img/logo.png'
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/components/i18n/I18nProvider'
import { useRouter } from 'next/navigation'
import { auth } from '@/services/firebase'
import { signOut } from 'firebase/auth'
import { api } from '@/services/api'

type Props = {
  avatarSrc?: string
  avatarAlt?: string
  avatarHref?: string
  showNotificationDot?: boolean
}

const defaultAvatarSrc =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCNWLKG3KmBvcxb7wJkQ2HeqD1iANnIUOPWwFJ7O1cw215KloPHs3ehHUlgQoEZ5iiZMeumoFW20_CqaPK0OkxBL2IFiRRSwOn2ZjmEvCK5zeTX0dJSdv7Ejd--1MYN978tmkFaQb2Be94D6PLdp_keyQl--XIiikpVuiNhQ6wJRNPnYiPU-HRJl80eV42QE-WsMDmnUsXlYrrQE35eo2xa_Eez8YaYZPMhrX7IE-icou6vLMANesGdwmf-T2iJOliavtUzpa92OyU'

export default function AppHeader({
  avatarSrc = defaultAvatarSrc,
  avatarAlt = 'Profile',
  showNotificationDot = true,
}: Props) {
  const { language, setLanguage, t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const router = useRouter()
  const [userAvatar, setUserAvatar] = useState(avatarSrc)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('vnw_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.avatar_url) setUserAvatar(user.avatar_url);
      }
    } catch (e) {
      console.warn('Erro ao ler usuário no localStorage', e);
    }
  }, []);

  const handleLogout = async () => {
    try {
      // 1. Deslogar do Firebase
      await signOut(auth);
      
      // 2. Chamar a API de logout para invalidar o backend (Token Blacklist)
      const token = localStorage.getItem('vnw_token');
      if (token) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (e) {
      console.error('Erro no logout da API', e);
    } finally {
      // 3. Limpar cliente
      localStorage.removeItem('vnw_token');
      localStorage.removeItem('vnw_user');
      setMenuOpen(false);
      router.push('/');
    }
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="fixed top-0 w-full z-50 glass-header">
      <div className="flex justify-between items-center px-4 h-16 w-full max-w-7xl mx-auto relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
               <img 
                  src={(typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) ? '/logo-dark.png' : '/logo.png'} 
                  alt="VNW logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback para CSS class se a imagem falhar no carregamento inicial
                    e.currentTarget.style.display = 'none';
                  }}
               />
            </div>
            <span className="font-headline font-extrabold text-lg tracking-tighter text-primary dark:text-white uppercase">VNW Resgate</span>
          </Link>
          <span className="text-outline-variant/30 px-2 font-light">|</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 hover:bg-slate-100/50 dark:hover:bg-white/5 rounded-full transition-colors cursor-pointer relative">
            <span className="material-symbols-outlined text-on-surface-variant dark:text-slate-400">
              notifications
            </span>
            {showNotificationDot ? (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border border-white dark:border-[#0a1628]" />
            ) : null}
          </div>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 pl-2"
          >
            <Image
              alt={avatarAlt}
              src={userAvatar}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          </button>

          {menuOpen ? (
            <div
              ref={menuRef}
              className="absolute top-16 right-4 w-48 bg-white/95 dark:bg-[#0d2247]/95 backdrop-blur-xl border border-outline-variant/20 dark:border-white/10 rounded-xl shadow-lg p-2"
            >
              <Link
                href="/user-profile"
                className="flex items-center px-4 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-sm font-bold dark:text-white uppercase tracking-wider">{t('menu.profile')}</span>
              </Link>
              <div className="px-4 py-2.5 rounded-lg">
                <div className="flex items-center">
                  <span className="text-sm font-bold dark:text-white uppercase tracking-wider">
                    {t('menu.language')}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en')
                      setMenuOpen(false)
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-extrabold border transition-colors ${
                      language === 'en'
                        ? 'bg-primary text-on-primary border-primary/30'
                        : 'bg-white/60 dark:bg-white/10 text-on-surface-variant dark:text-slate-400 border-outline-variant/20 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('pt-BR')
                      setMenuOpen(false)
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-extrabold border transition-colors ${
                      language === 'pt-BR'
                        ? 'bg-primary text-on-primary border-primary/30'
                        : 'bg-white/60 dark:bg-white/10 text-on-surface-variant dark:text-slate-400 border-outline-variant/20 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10'
                    }`}
                  >
                    PT-BR
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <span className="text-sm font-bold text-error dark:text-red-400 uppercase tracking-wider">{t('menu.exit')}</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
