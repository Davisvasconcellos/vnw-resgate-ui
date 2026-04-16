'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

type Props = {
  onAddClick?: () => void
}

export default function BottomNavMissing({ onAddClick }: Props) {
  const pathname = usePathname()
  const { t } = useI18n()

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-4 py-3 pb-safe max-w-lg mx-auto relative">
        
        {/* Home Button */}
        <Link
          href="/assist"
          className="flex flex-col items-center gap-1.5 p-2 min-w-[80px] transition-all active:scale-90 text-on-surface-variant group"
        >
          <div className="w-10 h-10 rounded-2xl group-hover:bg-primary/5 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-[26px]">home</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">{t('navPublic.home')}</span>
        </Link>

        {/* Center Floating Add Button */}
        <div className="relative -top-10">
          <button
            onClick={onAddClick}
            className="w-16 h-16 rounded-full bg-[#7B1FA2] text-white shadow-xl shadow-[#7B1FA2]/40 flex items-center justify-center active:scale-90 transition-all border-4 border-white"
          >
            <span className="material-symbols-outlined text-[32px] font-bold">add</span>
          </button>
        </div>

        {/* Missing Button (Active) */}
        <div
          className="flex flex-col items-center gap-1.5 p-2 min-w-[80px] transition-all text-[#7B1FA2]"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#7B1FA2]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: `'FILL' 1` }}>person_search</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest">{t('navPublic.missing')}</span>
        </div>

      </div>
    </nav>
  )
}
