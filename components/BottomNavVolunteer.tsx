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
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-4 py-3 pb-safe max-w-lg mx-auto relative">
        
        {/* Home Button */}
        <Link
          href="/assist"
          className="flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 text-on-surface-variant group"
        >
          <div className="w-10 h-10 rounded-2xl group-hover:bg-primary/5 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[24px]">home</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">{t('navPublic.home')}</span>
        </Link>

        {/* Center Floating Opportunities Button (Volunteer Exclusive) */}
        <div className="relative -top-10">
          <Link
            href="/volunteer"
            className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-all border-4 border-white shadow-xl bg-[#2E7D32] text-white shadow-[#2E7D32]/40"
          >
            <span className="material-symbols-outlined text-[32px] font-bold">volunteer_activism</span>
          </Link>
          <div className="absolute top-0 right-0 w-5 h-5 bg-[#1B5E20] text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center shadow-sm">3</div>
        </div>

        {/* My Tasks Button */}
        <Link
          href="/volunteer/tasks"
          className={`flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 group ${
            isMyTasks ? 'text-[#C2185B]' : 'text-on-surface-variant'
          }`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            isMyTasks ? 'bg-pink-50 text-[#C2185B]' : 'group-hover:bg-pink-50/50'
          }`}>
            <span 
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: `'FILL' ${isMyTasks ? 1 : 0}` }}
            >
              task_alt
            </span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Minhas Atividades</span>
        </Link>

      </div>
    </nav>
  )
}
