'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function BottomNav() {
  const pathname = usePathname()
  const { t } = useI18n()

  const isHome = pathname === '/'
  const isBookings = pathname.startsWith('/help/my-requests')
  const isProfile = pathname.startsWith('/user-profile')

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-4 pt-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-t-[2rem] z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center rounded-full px-5 py-1.5 transition-transform duration-200 active:scale-95 ${
          isHome
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
            : 'text-slate-400 dark:text-slate-500 hover:text-blue-500'
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: `'FILL' ${isHome ? 1 : 0}` }}
        >
          home
        </span>
        <span className="text-[11px] font-semibold mt-0.5">{t('nav.home')}</span>
      </Link>

      <Link
        href="/help/my-requests"
        className={`flex flex-col items-center justify-center rounded-full px-5 py-1.5 transition-transform duration-200 active:scale-95 ${
          isBookings
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
            : 'text-slate-400 dark:text-slate-500 hover:text-blue-500'
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: `'FILL' ${isBookings ? 1 : 0}` }}
        >
          notifications
        </span>
        <span className="text-[11px] font-semibold mt-0.5">
          {t('nav.bookings')}
        </span>
      </Link>

      <Link
        href="/user-profile"
        className={`flex flex-col items-center justify-center rounded-full px-5 py-1.5 transition-transform duration-200 active:scale-95 ${
          isProfile
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
            : 'text-slate-400 dark:text-slate-500 hover:text-blue-500'
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: `'FILL' ${isProfile ? 1 : 0}` }}
        >
          person
        </span>
        <span className="text-[11px] font-semibold mt-0.5">
          {t('nav.profile')}
        </span>
      </Link>
    </nav>
  )
}
