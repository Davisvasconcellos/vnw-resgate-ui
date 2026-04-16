'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNavVolunteer() {
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
        <Link
          href="/invites"
          className="flex flex-col items-center justify-center w-16 h-16 rounded-full text-white shadow-lg active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)', boxShadow: '0 8px 20px -6px rgba(21,101,192,0.6)' }}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: `'FILL' 1` }}>
              groups
            </span>
            <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 rounded-full border border-white text-[9px] font-bold flex items-center justify-center">2</span>
          </div>
        </Link>
      </div>

      <Link
        href="/profile"
        className={`flex flex-col items-center gap-1.5 p-3 w-20 transition-colors ${
          pathname === '/profile' ? 'text-blue-600' : 'text-slate-400'
        }`}
      >
        <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: `'FILL' ${pathname === '/profile' ? 1 : 0}` }}>
          person
        </span>
        <span className="text-[10px] font-bold">Perfil</span>
      </Link>
    </div>
  )
}
