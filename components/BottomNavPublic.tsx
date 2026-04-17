'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function BottomNavPublic() {
  const pathname = usePathname()
  const { t } = useI18n()

  const isRequest = pathname === '/request'
  const isMissing = pathname === '/missing'
  const isHelp = pathname === '/help'
  const isStatus = pathname === '/help/my-requests'

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0a1628] border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] pb-safe transition-all duration-300">
      <div className="flex items-center justify-around px-6 py-3 max-w-lg mx-auto relative h-20">
        
        {/* Missing Item */}
        <Link
          href="/missing?module=help"
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 group pb-1 min-w-[80px] ${
            isMissing ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: isMissing ? "'FILL' 1" : "" }}>person_search</span>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Desaparecidos</span>
        </Link>

        {/* SOS Item (Central & Floating) */}
        <div className="relative -top-8">
          <Link
            href="/request?type=rescue&module=help"
            className={`w-18 h-18 rounded-full flex flex-col items-center justify-center text-white shadow-2xl border-4 border-[#0a1628] active:scale-90 transition-all font-headline ${
               isRequest ? 'ring-4 ring-red-500/20 shadow-red-500/40' : 'shadow-red-500/30'
            }`}
            style={{ 
              background: 'linear-gradient(135deg, #ba1a1a, #ff5449)',
              width: '4.5rem',
              height: '4.5rem'
            }}
          >
            <span className="material-symbols-outlined text-[34px] font-bold">sos</span>
            <span className="text-[9px] font-black uppercase tracking-tighter -mt-1">Resgate</span>
          </Link>
        </div>

        {/* My Requests (Status) Item */}
        <Link
          href="/help/my-requests"
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 group pb-1 min-w-[80px] ${
            isStatus ? 'text-blue-400' : 'text-slate-400'
          }`}
        >
          <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: isStatus ? "'FILL' 1" : "" }}>list_alt</span>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Meus Pedidos</span>
        </Link>

      </div>
    </nav>
  )
}
