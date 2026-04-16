'use client'

import Link from 'next/link'
import CapacityBar from '@/components/ui/CapacityBar'
import { SHELTERS } from '@/app/mock-data'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function SheltersPage() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link
            href="/help"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800 font-headline">{t('shelters.title')}</h1>
            <p className="text-xs text-slate-400">
              {t('shelters.found').replace('{count}', SHELTERS.length.toString())}
            </p>
          </div>
        </div>

        {/* Fixed action button */}
        <div className="px-4 pb-3">
          <Link href="/request?type=shelter">
            <div
              className="flex items-center justify-center gap-2 rounded-2xl py-3.5 font-bold text-white font-headline active:scale-[0.98] transition-all"
              style={{ background: 'linear-gradient(135deg, #C62828, #E53935)', boxShadow: '0 6px 18px -4px rgba(198,40,40,0.4)' }}
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: `'FILL' 1` }}>sos</span>
              {t('shelters.requestBtn')}
            </div>
          </Link>
        </div>
      </div>

      {/* Shelter list */}
      <div className="px-4 pt-4 pb-8 space-y-3">
        {SHELTERS.map((shelter) => {
          const pct = Math.round((shelter.occupied / shelter.capacity) * 100)
          const isFull = pct >= 90

          return (
            <div
              key={shelter.id}
              className={`rounded-2xl bg-white p-4 shadow-sm border transition-all ${isFull ? 'opacity-75 border-red-100' : 'border-transparent hover:border-slate-200'}`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-slate-800 font-headline text-base leading-snug">
                    {shelter.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {shelter.reference}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {t('shelters.distance').replace('{km}', shelter.distanceKm.toString())}
                  </span>
                </div>
              </div>

              {/* Capacity bar */}
              <CapacityBar current={shelter.occupied} total={shelter.capacity} />

              {/* Address + Phone */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400 truncate flex-1 leading-tight">
                  {shelter.address}
                </p>
                <a
                  href={`tel:${shelter.phone}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl px-3 py-1.5 ml-3 shrink-0 active:scale-95 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  {t('shelters.call')}
                </a>
              </div>

              {isFull && (
                <div className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-[11px] font-bold text-red-600 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: `'FILL' 1` }}>block</span>
                  {t('shelters.full')}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
