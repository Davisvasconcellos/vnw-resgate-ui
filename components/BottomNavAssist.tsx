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
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-4 py-3 pb-safe max-w-lg mx-auto relative">
        
        {/* Home Button -> Goes to Situation / */}
        <Link
          href="/"
          className="flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 text-on-surface-variant group"
        >
          <div className="w-10 h-10 rounded-2xl group-hover:bg-primary/5 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[24px]">home</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">{t('navPublic.home')}</span>
        </Link>

        {/* Center Floating Maps Button */}
        <div className="relative -top-10">
          <Link
            href="/nearby"
            className={`w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-all border-4 border-white shadow-xl ${
              isNearby ? 'bg-[#E65100] text-white shadow-[#E65100]/40' : 'bg-surface-container-highest text-on-surface shadow-black/10 hover:bg-orange-50'
            }`}
          >
            <span className="material-symbols-outlined text-[32px] font-bold">map</span>
          </Link>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase tracking-widest text-[#E65100]">Mapa</span>
        </div>

        {/* Volunteer / Profile Button */}
        <Link
          href="/onboarding?offer=volunteer"
          className="flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 text-on-surface-variant group"
        >
          <div className="w-10 h-10 rounded-2xl group-hover:bg-green-50 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[24px] group-hover:text-[#2E7D32]">volunteer_activism</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest group-hover:text-[#2E7D32]">Voluntário</span>
        </Link>

      </div>
    </nav>
  )
}
