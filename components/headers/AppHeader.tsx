'use client'

import Image from 'next/image'
import Link from 'next/link'
import logo from '@/assets/img/logo.png'
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '@/components/i18n/I18nProvider'

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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `'FILL' 1` }}>sos</span>
            </div>
            <span className="font-headline font-extrabold text-lg tracking-tighter text-primary">VNW-RESCUE</span>
          </div>
          <span className="text-outline-variant/30 px-2 font-light">|</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 hover:bg-slate-100/50 rounded-full transition-colors cursor-pointer relative">
            <span className="material-symbols-outlined text-on-surface-variant">
              notifications
            </span>
            {showNotificationDot ? (
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
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
              src={avatarSrc}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          </button>

          {menuOpen ? (
            <div
              ref={menuRef}
              className="absolute top-16 right-4 w-48 bg-white/90 backdrop-blur-xl border border-outline-variant/20 rounded-xl shadow-lg p-2"
            >
              <Link
                href="/user-profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span className="material-symbols-outlined">person</span>
                <span className="text-sm font-semibold">{t('menu.profile')}</span>
              </Link>
              <div className="px-3 py-2 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">translate</span>
                  <span className="text-sm font-semibold">
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
                        : 'bg-white/60 text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-low'
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
                        : 'bg-white/60 text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-low'
                    }`}
                  >
                    PT-BR
                  </button>
                </div>
              </div>
              <Link
                href="/login"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="text-sm font-semibold">{t('menu.exit')}</span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
