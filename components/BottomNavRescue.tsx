'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/request',
    icon: 'sos',
    label: 'Solicitar ajuda',
    activeOn: ['/request'],
    accent: true, // destaque especial — botão central
  },
  {
    href: '/',
    icon: 'home',
    label: 'Início',
    activeOn: ['/'],
    accent: false,
  },
  {
    href: '/nearby',
    icon: 'radar',
    label: 'Situação',
    activeOn: ['/nearby'],
    accent: false,
  },
]

export default function BottomNavRescue() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 w-full z-50"
      style={{
        background: 'rgba(10, 22, 40, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 -4px 32px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2 pb-4 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.activeOn.includes(pathname)

          // Botão central de SOS — destaque máximo
          if (item.accent) {
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`nav-${item.href.replace('/', '') || 'home'}`}
                className="flex flex-col items-center gap-1 -mt-6"
              >
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-2xl transition-all active:scale-95"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #B71C1C, #C62828)'
                      : 'linear-gradient(135deg, #C62828, #E53935)',
                    boxShadow: '0 6px 24px rgba(198,40,40,0.6)',
                    border: '2px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <span
                    className="material-symbols-outlined text-white text-[32px]"
                    style={{ fontVariationSettings: `'FILL' 1` }}
                  >
                    {item.icon}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">
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
              id={`nav-${item.href.replace('/', '') || 'home'}`}
              className="flex flex-col items-center gap-1.5 px-5 py-2 rounded-2xl transition-all active:scale-95"
              style={{
                background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
              }}
            >
              <span
                className="material-symbols-outlined text-[26px] transition-colors"
                style={{
                  color: isActive ? '#90CAF9' : 'rgba(255,255,255,0.45)',
                  fontVariationSettings: `'FILL' ${isActive ? 1 : 0}`,
                }}
              >
                {item.icon}
              </span>
              <span
                className="text-[11px] font-semibold transition-colors"
                style={{ color: isActive ? '#90CAF9' : 'rgba(255,255,255,0.35)' }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
