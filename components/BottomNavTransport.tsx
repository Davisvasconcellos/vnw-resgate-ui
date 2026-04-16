'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function BottomNavTransport() {
  const pathname = usePathname()
  const { t } = useI18n()

  const isNearby = pathname === '/nearby'
  const isRoutes = pathname === '/routes'

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 dark:bg-[#070d17]/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] dark:shadow-none pb-safe">
      <div className="flex items-center justify-around px-4 py-3 max-w-lg mx-auto relative">
        
        {/* Home Button */}
        <Link
          href="/assist"
          className="flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 text-on-surface-variant dark:text-slate-400 group"
        >
          <div className="w-10 h-10 rounded-2xl group-hover:bg-primary/5 dark:group-hover:bg-white/5 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[24px]">home</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">{t('navPublic.home')}</span>
        </Link>

        {/* Center Floating Routes Button */}
        <div className="relative -top-10">
          <Link
            href="/routes"
            className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-all border-4 border-white dark:border-[#0a1628] shadow-xl bg-[#E65100] text-white shadow-[#E65100]/40"
          >
            <span className="material-symbols-outlined text-[32px] font-bold">directions_car</span>
          </Link>
          <div className="absolute top-0 right-0 w-5 h-5 bg-[#BF360C] text-white text-[10px] font-black rounded-full border-2 border-white dark:border-[#0a1628] flex items-center justify-center shadow-sm">2</div>
        </div>

        {/* Maps/Nearby Button */}
        <Link
          href="/nearby?module=transport"
          className={`flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 group ${
            isNearby ? 'text-[#E65100] dark:text-orange-400' : 'text-on-surface-variant dark:text-slate-400'
          }`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            isNearby ? 'bg-orange-50 dark:bg-orange-900/20 text-[#E65100] dark:text-orange-400' : 'group-hover:bg-orange-50/50 dark:group-hover:bg-white/5'
          }`}>
            <span 
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: `'FILL' ${isNearby ? 1 : 0}` }}
            >
              map
            </span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none">Mapa</span>
        </Link>

      </div>
    </nav>
  )
}
