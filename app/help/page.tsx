'use client'

import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'

export default function HelpPage() {
  const { t } = useI18n()

  const categories = [
    {
      href: '/request?type=rescue',
      icon: 'sos',
      label: t('help.rescue'),
      description: t('help.rescueDesc'),
      color: 'rgba(198,40,40,0.12)',
      border: 'rgba(198,40,40,0.25)',
      iconColor: '#C62828',
      badge: t('help.urgent'),
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-700',
    },
    {
      href: '/help/shelters',
      icon: 'house',
      label: t('help.shelters'),
      description: t('help.sheltersDesc'),
      color: 'rgba(21,101,192,0.12)',
      border: 'rgba(21,101,192,0.25)',
      iconColor: '#1565C0',
      badge: '12 disponíveis',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-700',
    },
    {
      href: '/missing',
      icon: 'person_search',
      label: t('help.missing'),
      description: t('help.missingDesc'),
      color: 'rgba(74,20,140,0.12)',
      border: 'rgba(74,20,140,0.25)',
      iconColor: '#4A148C',
      badge: '3 registros',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-700',
    },
    {
      href: '/help/phones',
      icon: 'call',
      label: t('help.phones'),
      description: t('help.phonesDesc'),
      color: 'rgba(230,81,0,0.12)',
      border: 'rgba(230,81,0,0.25)',
      iconColor: '#E65100',
      badge: '6 contatos',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-700',
    },
  ]

  return (
    <main className="min-h-screen bg-slate-50 pb-24 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800 font-headline">{t('help.title')}</h1>
            <p className="text-xs text-slate-400">{t('help.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 pb-8 space-y-3">
        {/* Quick action banner */}
        <Link href="/request?type=rescue">
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-5 active:scale-[0.98] transition-all"
            style={{ background: 'linear-gradient(135deg, #C62828, #E53935)', boxShadow: '0 8px 24px -6px rgba(198,40,40,0.4)' }}
          >
            <span className="material-symbols-outlined text-white text-[26px]" style={{ fontVariationSettings: `'FILL' 1` }}>
              sos
            </span>
            <div className="flex-1">
              <p className="text-white font-bold font-headline text-base">{t('help.requestNow')}</p>
              <p className="text-white/70 text-xs">{t('help.requestNowDesc')}</p>
            </div>
            <span className="material-symbols-outlined text-white/60">chevron_right</span>
          </div>
        </Link>

        {/* Categories — 2 por linha */}
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href}>
              <div
                className="flex flex-col items-start gap-3 rounded-2xl p-4 active:scale-[0.97] transition-all min-h-[140px]"
                style={{ background: cat.color, border: `1.5px solid ${cat.border}` }}
              >
                {/* Icon + badge row */}
                <div className="flex items-start justify-between w-full">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl"
                    style={{ background: cat.color, border: `1.5px solid ${cat.border}` }}
                  >
                    <span
                      className="material-symbols-outlined text-[24px]"
                      style={{ color: cat.iconColor, fontVariationSettings: `'FILL' 1` }}
                    >
                      {cat.icon}
                    </span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-tight text-center ${cat.badgeBg} ${cat.badgeText}`}>
                    {cat.badge}
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <p className="font-bold text-slate-800 font-headline text-sm leading-tight">{cat.label}</p>
                  <p className="text-slate-500 text-[11px] mt-1 leading-snug">{cat.description}</p>
                </div>

                {/* Arrow */}
                <span className="material-symbols-outlined text-slate-400 text-[16px]">arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

