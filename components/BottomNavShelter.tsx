'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function BottomNavShelter({ onCheckinClick }: { onCheckinClick?: () => void }) {
  const pathname = usePathname()
  const { t } = useI18n()

  const isManagement = pathname.startsWith('/shelter/manage')
  const isNearby = pathname === '/nearby'

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
          <span className="text-[10px] font-extrabold uppercase tracking-widest">{t('nav.home')}</span>
        </Link>

        {/* Center Floating Checkin Button */}
        <div className="relative -top-10">
          <button
            onClick={() => {
              if (onCheckinClick) onCheckinClick()
              else {
                window.dispatchEvent(new CustomEvent('open-manual-checkin'))
              }
            }}
            className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition-all border-4 border-white dark:border-[#0a1628] shadow-xl bg-[#1565C0] text-white shadow-[#1565C0]/40"
          >
            <span className="material-symbols-outlined text-[32px] font-bold">fact_check</span>
          </button>
        </div>

        {/* Management Button */}
        <Link
          href="/shelter/manage"
          className={`flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 group ${
            pathname === '/shelter/manage' ? 'text-[#1565C0] dark:text-blue-400' : 'text-on-surface-variant dark:text-slate-400'
          }`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            pathname === '/shelter/manage' ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1565C0] dark:text-blue-400' : 'group-hover:bg-blue-50/50 dark:group-hover:bg-white/5'
          }`}>
            <span 
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: `'FILL' ${pathname === '/shelter/manage' ? 1 : 0}` }}
            >
              grid_view
            </span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none">{t('nav.management')}</span>
        </Link>

        {/* Team Button */}
        <Link
          href="/shelter/team"
          className={`flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 group ${
            pathname === '/shelter/team' ? 'text-[#1565C0] dark:text-blue-400' : 'text-on-surface-variant dark:text-slate-400'
          }`}
        >
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
            pathname === '/shelter/team' ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1565C0] dark:text-blue-400' : 'group-hover:bg-blue-50/50 dark:group-hover:bg-white/5'
          }`}>
            <span 
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: `'FILL' ${pathname === '/shelter/team' ? 1 : 0}` }}
            >
              group
            </span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none">{t('nav.team')}</span>
        </Link>

      </div>
    </nav>
  )
}
