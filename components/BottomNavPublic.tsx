'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function BottomNavPublic() {
  const pathname = usePathname()
  const { t } = useI18n()

  const NAV_ITEMS = [
    { href: '/', icon: 'home', label: t('navPublic.home'), activeOn: ['/'] },
    { href: '/help/phones', icon: 'call', label: t('navPublic.phones'), activeOn: ['/help/phones'] },
    { href: '/help/shelters', icon: 'house', label: t('navPublic.shelters'), activeOn: ['/help/shelters'] },
    { href: '/missing', icon: 'person_search', label: t('navPublic.missing'), activeOn: ['/missing'] },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around px-2 py-2 pb-safe max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.activeOn.includes(pathname)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 min-w-[72px] transition-all active:scale-95 ${
                isActive ? 'text-[#7B1FA2]' : 'text-slate-400'
              }`}
            >
              <span 
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-bold leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
