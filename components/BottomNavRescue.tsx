'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function BottomNavRescue() {
  const pathname = usePathname()
  const { t } = useI18n()

  const NAV_ITEMS = [
    {
      href: '/request',
      icon: 'sos',
      label: t('nav.help'),
      activeOn: ['/request'],
      accent: true,
    },
    {
      href: '/',
      icon: 'home',
      label: t('nav.home'),
      activeOn: ['/'],
      accent: false,
    },
    {
      href: '/nearby',
      icon: 'radar',
      label: t('nav.situation'),
      activeOn: ['/nearby'],
      accent: false,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0A1628]/95 backdrop-blur-3xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.3)] pb-safe">
      <div className="flex items-center justify-around px-2 py-3 max-w-lg mx-auto relative">
        {NAV_ITEMS.map((item) => {
          const isActive = item.activeOn.includes(pathname)

          // Botão central de SOS — destaque máximo
          if (item.accent) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1.5 -mt-10 relative z-10"
              >
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-2xl transition-all active:scale-95 border-2 border-white/20 shadow-xl ${
                    isActive 
                      ? 'bg-gradient-to-br from-[#B71C1C] to-[#C62828] shadow-[#B71C1C]/60' 
                      : 'bg-gradient-to-br from-[#C62828] to-[#E53935] shadow-[#C62828]/50'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-white text-[32px]"
                    style={{ fontVariationSettings: `'FILL' 1` }}
                  >
                    {item.icon}
                  </span>
                </div>
                <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">
                  {item.label}
                </span>
              </Link>
            )
          }

          // Botões normais
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1.5 p-2 min-w-[75px] transition-all active:scale-95 group ${
                isActive ? 'text-blue-300' : 'text-slate-500'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                isActive ? 'bg-white/10' : 'group-hover:bg-white/5'
              }`}>
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
                >
                  {item.icon}
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
