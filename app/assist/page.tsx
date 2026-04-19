'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import AppHeader from '@/components/headers/AppHeader'
import ProtectedRoute from '@/components/ProtectedRoute'
import { api } from '@/services/api'

export default function AssistPage() {
  const { t } = useI18n()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/stats')
        if (res.data.success) {
          setStats(res.data.data)
        }
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const HELP_CARDS = [
    {
      label: t('assistPage.mapLabel'),
      icon: 'map',
      description: t('assistPage.mapDesc'),
      color: '#E65100',
      bg: 'rgba(230,81,0,0.1)',
      border: 'rgba(230,81,0,0.2)',
      href: '/nearby',
      span: 'col-span-2'
    },
    {
      label: t('assistPage.missionsLabel'),
      icon: 'rocket_launch',
      description: t('assistPage.missionsDesc'),
      color: '#1565C0',
      bg: 'rgba(21,101,192,0.1)',
      border: 'rgba(21,101,192,0.2)',
      href: '/volunteer/tasks',
      span: 'col-span-2'
    },
    {
      label: t('help.missing'),
      icon: 'person_search',
      description: t('help.missingDesc'),
      color: '#7B1FA2',
      bg: 'rgba(123,31,162,0.1)',
      border: 'rgba(123,31,162,0.2)',
      href: '/missing',
      span: 'col-span-1'
    },
    {
      value: 'volunteer',
      label: t('assistPage.types.volunteer'),
      icon: 'volunteer_activism',
      description: t('assistPage.types.volunteerDesc'),
      color: '#2E7D32',
      bg: 'rgba(46,125,50,0.1)',
      border: 'rgba(46,125,50,0.2)',
      href: '/onboarding',
      span: 'col-span-1'
    },
    {
      value: 'shelter',
      label: t('assistPage.types.shelter'),
      icon: 'house',
      description: t('assistPage.types.shelterDesc'),
      color: '#1565C0',
      bg: 'rgba(21,101,192,0.1)',
      border: 'rgba(21,101,192,0.2)',
      href: '/onboarding?offer=shelter',
      span: 'col-span-2'
    },
  ]

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-surface dark:bg-[#0a1628] pb-32 transition-colors">
        <AppHeader />

      <div className="px-4 pt-24 pb-8 space-y-8 max-w-2xl mx-auto font-sans">
        {/* Intro Section */}
        <section className="px-1">
          <h1 className="text-4xl font-extrabold font-headline text-on-surface dark:text-white tracking-tight leading-tight">
            {t('assistPage.title')}
          </h1>
          <p className="mt-2 text-on-surface-variant dark:text-slate-400 font-body text-base font-medium">
            {t('assistPage.subtitle')}
          </p>
        </section>

        {/* Stats Section */}
        <section>
          <h2 className="text-xs font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t('assistPage.statsTitle')}
          </h2>
          <div className="grid grid-cols-3 gap-3">
          {[
            { label: t('assistPage.statVolunteers'), value: loading ? '...' : (stats?.global?.volunteers?.total || 0).toString(), icon: 'volunteer_activism', color: 'text-primary' },
            { label: t('assistPage.statOpen'), value: loading ? '...' : (stats?.global?.requests?.open || 0).toString(), icon: 'pending', color: 'text-secondary', href: '/volunteer/tasks' },
            { label: t('assistPage.statToday'), value: loading ? '...' : (stats?.global?.impact?.people_today || 0).toString(), icon: 'check_circle', color: 'text-emerald-600 dark:text-emerald-400' },
          ].map((stat) => {
            const CardContent = (
              <div className="rounded-2xl bg-white dark:bg-white/5 p-4 shadow-sm border border-slate-100 dark:border-white/10 text-center transition-all hover:shadow-md h-full">
                <div className={`w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-2`}>
                  <span className={`material-symbols-outlined ${stat.color} text-[22px]`} style={{ fontVariationSettings: `'FILL' 1` }}>
                    {stat.icon}
                  </span>
                </div>
                <p className="text-xl font-bold text-on-surface dark:text-white font-headline">{(stat as any).value}</p>
                <p className="text-[9px] font-bold text-on-surface-variant dark:text-slate-500 uppercase tracking-wider mt-0.5 leading-none">{(stat as any).label}</p>
              </div>
            );

            if ((stat as any).href) {
              return (
                <Link key={(stat as any).label} href={(stat as any).href} className="transition-transform active:scale-95 block">
                  {CardContent}
                </Link>
              );
            }

            return <div key={(stat as any).label}>{CardContent}</div>;
          })}
          </div>
        </section>

        {/* Action Grid */}
        <section>
          <h2 className="text-xs font-black text-on-surface-variant dark:text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {t('assistPage.chooseHelp')}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {HELP_CARDS.map((card) => (
              <Link key={card.label} href={card.href} className={`group ${card.span || 'col-span-1'}`}>
                <div
                  className="flex flex-col items-start gap-4 rounded-[2.5rem] p-5 active:scale-[0.97] transition-all min-h-[170px] shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10"
                >
                  {/* Decorative faint icon in background */}
                  <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-[80px] opacity-[0.03] rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-6" style={{ color: card.color }}>
                    {card.icon}
                  </span>
                  
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 transition-colors group-hover:scale-110 shadow-sm" style={{ background: card.bg, border: `1px solid ${card.border}` }}>
                      <span
                        className="material-symbols-outlined text-[28px]"
                        style={{ color: card.color, fontVariationSettings: `'FILL' 1` }}
                      >
                        {card.icon}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/10 flex items-center justify-center border border-slate-100 dark:border-white/10 transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </div>
                  </div>
                  <div className="flex-1 relative z-10 w-full mt-2 pr-4">
                    <p className="font-extrabold text-slate-900 dark:text-white font-headline text-lg leading-tight group-hover:text-primary transition-colors">{card.label}</p>
                    <p className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-2 leading-tight line-clamp-2 font-medium">{card.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
    </ProtectedRoute>
  )
}
