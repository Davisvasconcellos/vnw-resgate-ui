'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

type Props = {
  onCheckinClick?: () => void
}

export default function BottomNavShelterManage({ onCheckinClick }: Props) {
  const pathname = usePathname()
  const { t } = useI18n()

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

        {/* Center Floating Checkin Button */}
        <div className="relative -top-10">
          <button
            onClick={onCheckinClick}
            className="w-16 h-16 rounded-full bg-[#1565C0] text-white shadow-xl shadow-[#1565C0]/40 flex items-center justify-center active:scale-90 transition-all border-4 border-white"
          >
            <span className="material-symbols-outlined text-[32px] font-bold">fact_check</span>
          </button>
        </div>

        {/* Management Button (Active) */}
        <div
          className="flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all text-[#1565C0]"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#1565C0]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: `'FILL' 1` }}>grid_view</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Gestão</span>
        </div>

        {/* Volunteers Button */}
        <Link
          href="/volunteers"
          className="flex flex-col items-center gap-1.5 p-2 min-w-[70px] transition-all active:scale-90 text-on-surface-variant group"
        >
          <div className="w-10 h-10 rounded-2xl group-hover:bg-primary/5 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[24px]">group</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">Equipe</span>
        </Link>

      </div>
    </nav>
  )
}
