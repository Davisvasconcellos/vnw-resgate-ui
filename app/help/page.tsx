'use client'

import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import AppHeader from '@/components/headers/AppHeader'

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
    <main className="min-h-screen bg-surface pb-28 pt-16">
      <AppHeader />

      <div className="px-4 pt-8 space-y-8 max-w-2xl mx-auto">
        {/* Intro */}
        <section>
          <h1 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight leading-tight">
            {t('help.title')}
          </h1>
          <p className="mt-2 text-on-surface-variant font-body">
            {t('help.subtitle')}
          </p>
        </section>

        <div className="space-y-6">
          {/* Quick action banner */}
          <Link href="/request?type=rescue">
            <div
              className="flex items-center gap-4 rounded-3xl p-5 active:scale-[0.98] transition-all relative overflow-hidden group shadow-lg"
              style={{ background: 'linear-gradient(135deg, #ba1a1a, #ff5449)' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-700" />
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: `'FILL' 1` }}>sos</span>
              </div>
              <div className="flex-1 relative z-10">
                <p className="text-white font-extrabold font-headline text-lg">{t('help.requestNow')}</p>
                <p className="text-white/80 text-xs font-medium">{t('help.requestNowDesc')}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </div>
          </Link>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href} className="group">
                <div
                  className="flex flex-col items-start gap-4 rounded-3xl p-5 active:scale-[0.97] transition-all min-h-[160px] shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden bg-surface-container-lowest border border-outline-variant/10"
                >
                  {/* Decoration */}
                  <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-[80px] opacity-[0.03] rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-6" style={{ color: cat.iconColor }}>
                    {cat.icon}
                  </span>

                  <div className="flex items-start justify-between w-full relative z-10">
                    <div
                      className="flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm transition-transform group-hover:scale-110"
                      style={{ background: cat.color, border: `1px solid ${cat.border}` }}
                    >
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{ color: cat.iconColor, fontVariationSettings: `'FILL' 1` }}
                      >
                        {cat.icon}
                      </span>
                    </div>
                    <span className={`text-[9px] font-extrabold px-2 py-1 rounded-full leading-tight text-center ${cat.badgeBg} ${cat.badgeText} shadow-sm`}>
                      {cat.badge}
                    </span>
                  </div>

                  <div className="flex-1 relative z-10">
                    <p className="font-extrabold text-on-surface font-headline text-sm leading-tight group-hover:text-primary transition-colors">{cat.label}</p>
                    <p className="text-on-surface-variant font-medium text-[10px] mt-2 leading-relaxed line-clamp-2">{cat.description}</p>
                  </div>

                  <div className="w-full flex justify-end relative z-10 pt-2">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

