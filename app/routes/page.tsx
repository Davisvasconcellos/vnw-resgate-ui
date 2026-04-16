'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import AppHeader from '@/components/headers/AppHeader'

interface RouteEntry {
  id: string
  name: string
  people: number
  location: string
  status: 'ongoing' | 'finished'
}

const INITIAL_ROUTES: RouteEntry[] = [
  { id: '1', name: 'Família Souza', people: 4, location: 'Rua das Gaivotas, 320', status: 'ongoing' },
  { id: '2', name: 'Maria Aparecida', people: 1, location: 'Av. Beira-Mar, 1100', status: 'finished' }
]

export default function RoutesPage() {
  const { t } = useI18n()
  const [routes, setRoutes] = useState<RouteEntry[]>(INITIAL_ROUTES)
  const [activeTab, setActiveTab] = useState<'ongoing'|'finished'>('ongoing')
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<RouteEntry | null>(null)

  const handleCheckout = (location: string) => {
    if (!selectedRoute) return
    setRoutes(routes.map(r => r.id === selectedRoute.id ? { ...r, status: 'finished' } : r))
    setShowCheckout(false)
    setSelectedRoute(null)
  }

  const filtered = routes.filter(r => r.status === activeTab)

  return (
    <main className="min-h-screen bg-surface dark:bg-[#0a1628] flex flex-col pb-28 pt-16 transition-colors">
      <AppHeader />

      <div className="px-4 pt-8">
        <section className="mb-6">
          <h1 className="text-3xl font-extrabold font-headline text-on-surface dark:text-white tracking-tight leading-tight">
            {t('routesPage.title')}
          </h1>
          <p className="mt-2 text-on-surface-variant dark:text-slate-400 font-body">
            {t('routesPage.subtitle')}
          </p>
        </section>
        
        {/* Tabs */}
        <div className="flex bg-surface-container-low dark:bg-white/5 p-1.5 rounded-2xl mb-8 shadow-sm border border-outline-variant/10 dark:border-white/5">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'ongoing' ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5'}`}
          >
            {t('routesPage.tabOngoing')} ({routes.filter(r => r.status === 'ongoing').length})
          </button>
          <button
            onClick={() => setActiveTab('finished')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'finished' ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5'}`}
          >
            {t('routesPage.tabFinished')} ({routes.filter(r => r.status === 'finished').length})
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4 max-w-2xl mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30">
            <span className="material-symbols-outlined text-[48px] text-outline-variant/50 mb-3">auto_stories</span>
            <p className="text-on-surface-variant font-medium text-sm">{t('routesPage.empty')}</p>
          </div>
        ) : (
          filtered.map(route => (
            <div key={route.id} className="bg-surface-container-lowest dark:bg-white/5 rounded-[2rem] p-6 shadow-sm border border-outline-variant/10 dark:border-white/5 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-extrabold text-on-surface dark:text-white text-lg font-headline">{route.name}</h3>
                  <div className="mt-3 space-y-2">
                    <div className="text-xs text-on-surface-variant dark:text-slate-400 font-medium flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                      </div>
                      {t('routesPage.origin').replace('{loc}', route.location)}
                    </div>
                    <div className="text-xs text-on-surface-variant dark:text-slate-400 font-medium flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[14px]">group</span>
                      </div>
                      {route.people === 1 ? t('shelterManage.person') : t('routesPage.rescued').replace('{count}', route.people.toString())}
                    </div>
                  </div>
                </div>
                {route.status === 'ongoing' && (
                  <button
                    onClick={() => {
                      setSelectedRoute(route)
                      setShowCheckout(true)
                    }}
                    className="shrink-0 bg-primary text-on-primary font-bold px-5 py-3 rounded-2xl text-xs active:scale-95 transition-all shadow-lg shadow-primary/10"
                  >
                    {t('routesPage.dropoff')}
                  </button>
                )}
                {route.status === 'finished' && (
                  <span className="text-xs font-bold text-secondary bg-secondary/10 px-4 py-2 rounded-xl flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    {t('routesPage.finished')}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedRoute && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCheckout(false)} />
          <div className="relative z-10 bg-white rounded-t-[2rem] px-5 pt-4 pb-32 reveal-pop">
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5 shrink-0" />
            <h2 className="text-xl font-bold text-slate-800 font-headline mb-1">{t('routesPage.modalTitle')}</h2>
            <p className="text-sm text-slate-500 mb-6">{t('routesPage.modalDesc').replace('{name}', selectedRoute.name)}</p>

            <div className="space-y-3">
              <button
                onClick={() => handleCheckout('Abrigo A')}
                className="w-full flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl active:bg-slate-50"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600">house</span>
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-slate-800 text-sm">{t('routesPage.toShelter')}</p>
                  <p className="text-xs text-slate-500">{t('routesPage.toShelterDesc')}</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </button>

              <button
                onClick={() => handleCheckout('Livre')}
                className="w-full flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl active:bg-slate-50"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-slate-800 text-sm">{t('routesPage.toSafe')}</p>
                  <p className="text-xs text-slate-500">{t('routesPage.toSafeDesc')}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
