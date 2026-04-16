'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import AppHeader from '@/components/headers/AppHeader'
import BottomNavBoat from '@/components/BottomNavBoat'

interface RouteEntry {
  id: string
  name: string
  people: number
  location: string
  status: 'ongoing' | 'finished'
}

const INITIAL_ROUTES: RouteEntry[] = [
  { id: '1', name: 'Família Souza', people: 4, location: 'Trapiche de Canasvieiras', status: 'ongoing' },
  { id: '2', name: 'Resgate em Ilha', people: 2, location: 'Ilha do Campeche', status: 'finished' }
]

export default function RoutesBoatsPage() {
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
    <main className="min-h-screen bg-surface flex flex-col pb-32 pt-16">
      <AppHeader />

      <div className="px-4 pt-8">
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-1">
             <span className="material-symbols-outlined text-cyan-600">directions_boat</span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-600">Resgate Náutico</span>
          </div>
          <h1 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight leading-tight">
            Minhas Rotas de Barco
          </h1>
          <p className="mt-2 text-on-surface-variant font-body">
            Gerencie os resgates e transportes via água que você está realizando.
          </p>
        </section>
        
        {/* Tabs */}
        <div className="flex bg-surface-container-low p-1.5 rounded-2xl mb-8 shadow-sm border border-outline-variant/10">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'ongoing' ? 'bg-white text-cyan-700 shadow-sm' : 'text-on-surface-variant hover:bg-white/50'}`}
          >
            Em curso ({routes.filter(r => r.status === 'ongoing').length})
          </button>
          <button
            onClick={() => setActiveTab('finished')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === 'finished' ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant hover:bg-white/50'}`}
          >
            Concluídos ({routes.filter(r => r.status === 'finished').length})
          </button>
        </div>
      </div>

      <div className="px-4 space-y-4 max-w-2xl mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30">
            <span className="material-symbols-outlined text-[48px] text-outline-variant/50 mb-3">sailing</span>
            <p className="text-on-surface-variant font-medium text-sm">Nenhuma rota náutica ativa</p>
          </div>
        ) : (
          filtered.map(route => (
            <div key={route.id} className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-sm border border-outline-variant/10 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-extrabold text-on-surface text-lg font-headline">{route.name}</h3>
                  <div className="mt-3 space-y-2">
                    <div className="text-xs text-on-surface-variant font-medium flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
                        <span className="material-symbols-outlined text-[14px]">anchor</span>
                      </div>
                      Local: {route.location}
                    </div>
                    <div className="text-xs text-on-surface-variant font-medium flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[14px]">group</span>
                      </div>
                      {route.people} resgatados
                    </div>
                  </div>
                </div>
                {route.status === 'ongoing' && (
                  <button
                    onClick={() => {
                      setSelectedRoute(route)
                      setShowCheckout(true)
                    }}
                    className="shrink-0 bg-cyan-600 text-white font-bold px-5 py-3 rounded-2xl text-xs active:scale-95 transition-all shadow-lg shadow-cyan-600/10"
                  >
                    Desembarque
                  </button>
                )}
                {route.status === 'finished' && (
                  <span className="text-xs font-bold text-secondary bg-secondary/10 px-4 py-2 rounded-xl flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Finalizado
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
            <h2 className="text-xl font-bold text-slate-800 font-headline mb-1">Registrar Desembarque</h2>
            <p className="text-sm text-slate-500 mb-6">Onde as pessoas do grupo {selectedRoute.name} foram deixadas com segurança?</p>

            <div className="space-y-3">
              <button
                onClick={() => handleCheckout('Abrigo Próximo')}
                className="w-full flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl active:bg-slate-50"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600">house</span>
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-slate-800 text-sm">Levar ao Abrigo</p>
                  <p className="text-xs text-slate-500">Destinado a um abrigo oficial via trapiche/cais.</p>
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
                  <p className="font-bold text-slate-800 text-sm">Local Seguro</p>
                  <p className="text-xs text-slate-500">Desembarque concluído em área seca/porto.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar Exclusiva de Barco */}
      <BottomNavBoat />
    </main>
  )
}
