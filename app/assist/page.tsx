'use client'

import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import AppHeader from '@/components/headers/AppHeader'
import { HELP_REQUESTS } from '@/app/mock-data'

export default function AssistPage() {
  const { t, language } = useI18n()

  const HELP_CARDS = [
    {
      label: language === 'pt-BR' ? 'Mapa' : 'Maps',
      icon: 'map',
      description: t('rescue.nearbyStatusDesc'),
      color: '#E65100',
      bg: 'rgba(230,81,0,0.1)',
      border: 'rgba(230,81,0,0.2)',
      href: '/nearby'
    },
    {
      label: t('navPublic.missing'),
      icon: 'person_search',
      description: t('assistPage.missingDesc'),
      color: '#7B1FA2',
      bg: 'rgba(123,31,162,0.1)',
      border: 'rgba(123,31,162,0.2)',
      href: '/missing'
    },
    {
      value: 'shelter',
      label: t('assistPage.types.shelter'),
      icon: 'house',
      description: t('assistPage.types.shelterDesc'),
      color: '#1565C0',
      bg: 'rgba(21,101,192,0.1)',
      border: 'rgba(21,101,192,0.2)',
      href: '/onboarding?offer=shelter'
    },
    {
      value: 'transport',
      label: t('assistPage.types.transport'),
      icon: 'directions_car',
      description: t('assistPage.types.transportDesc'),
      color: '#E65100',
      bg: 'rgba(230,81,0,0.1)',
      border: 'rgba(230,81,0,0.2)',
      href: '/onboarding?offer=transport'
    },
    {
      value: 'boat',
      label: language === 'pt-BR' ? 'Barcos' : 'Boats',
      icon: 'directions_boat',
      description: t('assistPage.types.boatDesc'),
      color: '#0277BD',
      bg: 'rgba(2,119,189,0.1)',
      border: 'rgba(2,119,189,0.2)',
      href: '/onboarding?offer=boat'
    },
    {
      value: 'volunteer',
      label: t('assistPage.types.volunteer'),
      icon: 'volunteer_activism',
      description: t('assistPage.types.volunteerDesc'),
      color: '#2E7D32',
      bg: 'rgba(46,125,50,0.1)',
      border: 'rgba(46,125,50,0.2)',
      href: '/onboarding?offer=volunteer'
    },
  ]

  return (
    <main className="min-h-screen bg-surface pb-32">
      <AppHeader />

      <div className="px-4 pt-24 pb-8 space-y-8 max-w-2xl mx-auto">
        {/* Intro Section */}
        <section>
          <h1 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight leading-tight">
            {t('assistPage.title')}
          </h1>
          <p className="mt-2 text-on-surface-variant font-body">
            {t('assistPage.subtitle')}
          </p>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: t('assistPage.statVolunteers'), value: '128', icon: 'volunteer_activism', color: 'text-primary' },
            { label: t('assistPage.statOpen'), value: HELP_REQUESTS.length.toString(), icon: 'pending', color: 'text-secondary' },
            { label: t('assistPage.statToday'), value: '89', icon: 'check_circle', color: 'text-emerald-600' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-outline-variant/10 text-center transition-all hover:shadow-md">
              <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-2`}>
                <span className={`material-symbols-outlined ${stat.color} text-[22px]`} style={{ fontVariationSettings: `'FILL' 1` }}>
                  {stat.icon}
                </span>
              </div>
              <p className="text-xl font-bold text-on-surface font-headline">{stat.value}</p>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Action Grid */}
        <section>
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Escolha como ajudar
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {HELP_CARDS.map((card) => (
              <Link key={card.label} href={card.href} className="group">
                <div
                  className="flex flex-col items-start gap-4 rounded-3xl p-5 active:scale-[0.97] transition-all min-h-[160px] shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden bg-surface-container-lowest border border-outline-variant/10"
                >
                  {/* Decorative faint icon in background */}
                  <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-[80px] opacity-[0.03] rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-6" style={{ color: card.color }}>
                    {card.icon}
                  </span>
                  
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0 transition-colors group-hover:scale-110 shadow-sm" style={{ background: card.bg, border: `1px solid ${card.border}` }}>
                    <span
                      className="material-symbols-outlined text-[24px]"
                      style={{ color: card.color, fontVariationSettings: `'FILL' 1` }}
                    >
                      {card.icon}
                    </span>
                  </div>
                  <div className="flex-1 relative z-10">
                    <p className="font-extrabold text-on-surface font-headline text-sm leading-tight group-hover:text-primary transition-colors">{card.label}</p>
                    <p className="text-[10px] text-on-surface-variant mt-2 leading-relaxed line-clamp-2 font-medium">{card.description}</p>
                  </div>
                  <div className="w-full flex justify-end relative z-10 pt-2">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
