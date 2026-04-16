'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNavShelter() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-slate-100 flex items-center justify-around pb-safe">
      <Link
        href="/nearby"
        className={`flex flex-col items-center gap-1.5 p-3 w-20 transition-colors ${
          pathname === '/nearby' ? 'text-blue-600' : 'text-slate-400'
        }`}
      >
        <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: `'FILL' ${pathname === '/nearby' ? 1 : 0}` }}>
          map
        </span>
        <span className="text-[10px] font-bold">Mapa</span>
      </Link>

      <div className="relative -top-5">
        <button
          onClick={() => {
            // Se já estiver no shelter/manage, pode disparar um evento ou a pessoa simplesmente clica no botão principal lá
            // Para garantir, vamos redirecionar as pessoas com checkin=true para abrir o modal automaticamente (opcional)
            if (pathname !== '/shelter/manage') {
              window.location.href = '/shelter/manage?action=checkin'
            } else {
              // Já estamos no manage, emite evento customizado ou atualiza URL
              window.dispatchEvent(new CustomEvent('open-manual-checkin'))
            }
          }}
          className="flex flex-col items-center justify-center w-16 h-16 rounded-full text-white shadow-lg active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', boxShadow: '0 8px 20px -6px rgba(27,94,32,0.6)' }}
        >
          <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: `'FILL' 1` }}>
            person_add
          </span>
        </button>
      </div>

      <Link
        href="/shelter/manage"
        className={`flex flex-col items-center gap-1.5 p-3 w-20 transition-colors ${
          pathname === '/shelter/manage' ? 'text-blue-600' : 'text-slate-400'
        }`}
      >
        <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: `'FILL' ${pathname === '/shelter/manage' ? 1 : 0}` }}>
          admin_panel_settings
        </span>
        <span className="text-[10px] font-bold">Gestão</span>
      </Link>
    </div>
  )
}
