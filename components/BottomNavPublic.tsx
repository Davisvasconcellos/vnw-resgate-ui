'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function BottomNavPublic() {
  const pathname = usePathname()
  const { t } = useI18n()

  const NAV_ITEMS = [
    { href: '/help/phones?module=help', icon: 'call', label: t('navPublic.phones'), activeOn: ['/help/phones'] },
    { href: '/request?type=rescue&module=help', icon: 'sos', label: 'SOS', activeOn: ['/request'], isUrgent: true },
    { href: '/help/shelters?module=help', icon: 'house', label: t('navPublic.shelters'), activeOn: ['/help/shelters'] },
    { href: '/missing?module=help', icon: 'person_search', label: t('navPublic.missing'), activeOn: ['/missing'] },
  ]

  const isRequest = pathname === '/request'
  const isMissing = pathname === '/missing'
  const isHelp = pathname.startsWith('/help')

  // Se estiver em modo Missing, o ícone de + flutuante substitui o SOS no centro? 
  // O usuário disse: "items devem ser normais e somente o missing deve ser bolinha de +"
  // Isso sugere que o Missing (ultimo item) se torna o centro? Não, geralmente mantemos a estrutura 3+1.
  // Vou manter o layout de 4 espaços, mas o item que brilha muda conforme a página.

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0a1628] border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] pb-safe transition-all duration-300">
      <div className="flex items-center justify-around px-2 py-3 max-w-lg mx-auto relative h-20">
        
        {/* SOS Item (Floating locally or Normal) */}
        {!isRequest && isHelp && !isMissing ? (
          <div className="relative -top-6">
            <Link
              href="/request?type=rescue&module=help"
              className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30 border-4 border-[#0a1628] active:scale-90 transition-all font-headline"
              style={{ background: 'linear-gradient(135deg, #ba1a1a, #ff5449)' }}
            >
              <span className="material-symbols-outlined text-[32px] font-bold">sos</span>
            </Link>
          </div>
        ) : (
          <Link
            href="/request?type=rescue&module=help"
            className={`flex flex-col items-center gap-1 transition-all active:scale-90 group pb-1 min-w-[64px] ${
              pathname === '/request' ? 'text-red-500 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">sos</span>
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">SOS</span>
          </Link>
        )}

        {/* Phones Item */}
        <Link
          href="/help/phones?module=help"
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 group pb-1 min-w-[64px] ${
            pathname === '/help/phones' ? 'text-blue-400' : 'text-slate-400'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">call</span>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t('navPublic.phones')}</span>
        </Link>

        {/* Shelters Item */}
        <Link
          href="/help/shelters?module=help"
          className={`flex flex-col items-center gap-1 transition-all active:scale-90 group pb-1 min-w-[64px] ${
            pathname === '/help/shelters' ? 'text-blue-400' : 'text-slate-400'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">house</span>
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t('navPublic.shelters')}</span>
        </Link>

        {/* Missing Item (Floating only on /missing) */}
        {isMissing ? (
          <div className="relative -top-6">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-add-missing'))}
              className="w-16 h-16 rounded-full flex items-center justify-center bg-[#1565C0] text-white shadow-lg shadow-blue-500/40 border-4 border-[#0a1628] active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[32px] font-bold">add</span>
            </button>
          </div>
        ) : (
          <Link
            href="/missing?module=help"
            className={`flex flex-col items-center gap-1 transition-all active:scale-90 group pb-1 min-w-[64px] ${
              pathname === '/missing' ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">person_search</span>
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{t('navPublic.missing')}</span>
          </Link>
        )}

      </div>
    </nav>
  )
}
