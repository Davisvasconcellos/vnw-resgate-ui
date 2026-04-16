'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from './i18n/I18nProvider'

export default function BottomNavAssist() {
  const pathname = usePathname()
  const { t, language } = useI18n()

  const NAV_ITEMS = [
    { label: language === 'pt-BR' ? 'Mapa' : 'Maps', icon: 'map', href: '/nearby' },
    { label: language === 'pt-BR' ? 'Desapar.' : 'Missing', icon: 'person_search', href: '/missing' },
    { label: language === 'pt-BR' ? 'Abrigo' : 'Shelter', icon: 'house', href: '/onboarding?offer=shelter' },
    { label: language === 'pt-BR' ? 'Transp.' : 'Transp.', icon: 'directions_car', href: '/onboarding?offer=transport' },
    { label: language === 'pt-BR' ? 'Barcos' : 'Boats', icon: 'directions_boat', href: '/onboarding?offer=boat' },
    { label: language === 'pt-BR' ? 'Volunt.' : 'Volunt.', icon: 'volunteer_activism', href: '/onboarding?offer=volunteer' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-1 py-3 z-40">
      <div className="flex justify-around items-center max-w-lg mx-auto gap-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 min-w-[54px] transition-all active:scale-90 flex-1">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 dark:text-slate-500'}`}>
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}>
                  {item.icon}
                </span>
              </div>
              <span className={`text-[8px] font-bold truncate w-full text-center ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
