'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function BottomNavAssist() {
  const pathname = usePathname()
  const { t } = useI18n()

  const isHome = pathname === '/'
  const isNearby = pathname === '/nearby'
  const isAssist = pathname === '/assist'

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 dark:bg-[#0a1628]/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] dark:shadow-none pb-safe">
      <div className="flex items-center justify-around px-4 py-3 max-w-lg mx-auto relative">
        
        {/* Home Button -> Goes to Situation / */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 group ${
            isHome ? 'text-primary dark:text-primary-fixed' : 'text-on-surface-variant dark:text-slate-400'
          }`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            isHome ? 'bg-primary/10' : 'group-hover:bg-primary/5 dark:group-hover:bg-white/5'
          }`}>
            <span className="material-symbols-outlined text-[24px]">home</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none">{t('navPublic.home')}</span>
        </Link>

        {/* Center Floating Maps Button */}
        <div className="relative -top-10">
          <Link
            href="/nearby"
            className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-all border-4 border-white dark:border-[#070d17] shadow-xl bg-[#E65100] text-white shadow-[#E65100]/40"
          >
            <span className="material-symbols-outlined text-[32px] font-bold">map</span>
          </Link>
          <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest leading-none transition-colors ${
            isNearby ? 'text-[#E65100] dark:text-orange-400' : 'text-on-surface-variant dark:text-slate-400 opacity-0'
          }`}>Mapa</span>
        </div>

        {/* Volunteer / Profile Button */}
        <Link
          href="/onboarding?offer=volunteer"
          className="flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 text-on-surface-variant dark:text-slate-400 group"
        >
          <div className="w-10 h-10 rounded-2xl group-hover:bg-green-50 dark:group-hover:bg-white/5 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[24px] group-hover:text-[#2E7D32] dark:group-hover:text-green-400">volunteer_activism</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest group-hover:text-[#2E7D32] dark:group-hover:text-green-400 leading-none">Voluntário</span>
        </Link>

      </div>
    </nav>
  )
}
