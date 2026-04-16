'use client'

import Link from 'next/link'
import { USEFUL_PHONES } from '@/app/mock-data'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function PhonesPage() {
  const { t } = useI18n()

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/help" className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800 font-headline">{t('phonesPage.title')}</h1>
            <p className="text-xs text-slate-400">{t('phonesPage.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 pb-8 space-y-3">
        {USEFUL_PHONES.map((p) => (
          <a
            key={p.id}
            href={`tel:${p.number}`}
            className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm border border-transparent active:scale-[0.98] transition-all block"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 shrink-0">
              <span className="material-symbols-outlined text-orange-600 text-[26px]" style={{ fontVariationSettings: `'FILL' 1` }}>
                {p.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 font-headline">{p.label}</p>
              <p className="text-xs text-slate-400 leading-tight">{p.description}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xl font-bold text-blue-600 font-headline">{p.number}</p>
              <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5 font-bold uppercase tracking-tight">
                <span className="material-symbols-outlined text-[14px]">call</span>
                {t('phonesPage.tapToCall')}
              </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}
