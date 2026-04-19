'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

import { useRouter } from 'next/navigation'

export default function BottomNavPublic() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useI18n()

  const isRequest = pathname === '/request'
  const isStatus = pathname === '/help/my-requests'

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 dark:bg-[#0a1628]/95 backdrop-blur-xl border-t border-slate-100 dark:border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] dark:shadow-none pb-safe transition-all duration-300">
      <div className="flex items-center justify-around px-6 py-3 max-w-lg mx-auto relative h-20">
        
        {/* Left: Home / Back */}
        <button
          onClick={() => router.back()}
          className="flex flex-col items-center gap-1 transition-all active:scale-90 group pb-1 min-w-[80px] text-slate-400 dark:text-slate-500"
        >
          <span className="material-symbols-outlined text-[26px]">home</span>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Início</span>
        </button>

        {/* Center: Floating Add (+) */}
        <div className="relative -top-8">
          <Link
            href="/request?type=rescue&module=help"
            className={`flex items-center justify-center rounded-full text-white shadow-2xl border-4 border-white dark:border-[#0a1628] active:scale-95 transition-all ${
               isRequest ? 'bg-red-600 scale-110' : 'bg-red-500 hover:bg-red-600'
            }`}
            style={{ 
              boxShadow: '0 12px 24px -6px rgba(186, 26, 26, 0.4)',
              width: '4.5rem',
              height: '4.5rem'
            }}
          >
            <span className="material-symbols-outlined text-[36px] font-black">add</span>
          </Link>
        </div>

        {/* Right: Missing Item */}
        <Link
          href="/missing?module=help"
          className="flex flex-col items-center gap-1 transition-all active:scale-90 group pb-1 min-w-[80px] text-slate-400 dark:text-slate-500 hover:text-purple-600"
        >
          <span className="material-symbols-outlined text-[26px]">person_search</span>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Desaparecidos</span>
        </Link>

      </div>
    </nav>
  )
}
