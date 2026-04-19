'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function BottomNavVolunteer() {
  const pathname = usePathname()
  const { t } = useI18n()

  const isOpportunities = pathname === '/volunteer'
  const isMyTasks = pathname === '/volunteer/tasks'

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 dark:bg-[#070d17]/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] dark:shadow-none">
      <div className="flex items-center justify-around px-4 py-3 pb-safe max-w-lg mx-auto relative">
        
        {/* Home Button */}
        <Link
          href="/assist"
          className="flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 text-on-surface-variant dark:text-slate-400 group"
        >
          <div className="w-10 h-10 rounded-2xl group-hover:bg-primary/5 dark:group-hover:bg-white/5 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[24px]">home</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none">{t('nav.home')}</span>
        </Link>

        {/* Center Floating Opportunities Button - Voluntariado */}
        <Link
          href="/volunteer"
          className="flex flex-col items-center gap-2 -mt-10"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-all border-4 border-white dark:border-[#0a1628] shadow-xl bg-primary text-white shadow-primary/40">
            <span className="material-symbols-outlined text-[32px] font-bold">volunteer_activism</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">{t('nav.iamVolunteer')}</span>
        </Link>

        {/* My Missions Button */}
        <Link
          href="/volunteer/tasks"
          className={`flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 group ${
            isMyTasks ? 'text-primary' : 'text-on-surface-variant dark:text-slate-400'
          }`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            isMyTasks ? 'bg-primary/10 text-primary' : 'group-hover:bg-primary/5'
          }`}>
            <span 
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: `'FILL' ${isMyTasks ? 1 : 0}` }}
            >
              rocket_launch
            </span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none">{t('nav.myMissions')}</span>
        </Link>

      </div>
    </nav>
  )
}
