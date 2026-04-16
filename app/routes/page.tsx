'use client'

import { useState } from 'react'
import Link from 'next/link'

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
    <main className="min-h-screen bg-slate-50 flex flex-col pb-28">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 font-headline">Meus Resgates</h1>
            <p className="text-xs text-slate-400">Gerencie quem está no seu veículo</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-colors ${activeTab === 'ongoing' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}
          >
            Em trânsito ({routes.filter(r => r.status === 'ongoing').length})
          </button>
          <button
            onClick={() => setActiveTab('finished')}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-colors ${activeTab === 'finished' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
          >
            Finalizados ({routes.filter(r => r.status === 'finished').length})
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-10 text-sm">Nenhum resgate nesta aba.</p>
        ) : (
          filtered.map(route => (
            <div key={route.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{route.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    Origem: {route.location}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">group</span>
                    {route.people} resgatados
                  </p>
                </div>
                {route.status === 'ongoing' && (
                  <button
                    onClick={() => {
                      setSelectedRoute(route)
                      setShowCheckout(true)
                    }}
                    className="shrink-0 bg-emerald-50 text-emerald-700 font-bold px-3 py-2 rounded-xl text-xs active:scale-95 transition-transform"
                  >
                    Desembarcar
                  </button>
                )}
                {route.status === 'finished' && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Realizado</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedRoute && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCheckout(false)} />
          <div className="relative z-10 bg-white rounded-t-[2rem] px-5 pt-4 pb-10 reveal-pop">
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5" />
            <h2 className="text-xl font-bold text-slate-800 font-headline mb-1">Registrar Desembarque</h2>
            <p className="text-sm text-slate-500 mb-6">Onde você deixou <strong>{selectedRoute.name}</strong>?</p>

            <div className="space-y-3">
              <button
                onClick={() => handleCheckout('Abrigo A')}
                className="w-full flex items-center gap-3 bg-white border border-slate-200 p-4 rounded-xl active:bg-slate-50"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600">house</span>
                </div>
                <div className="text-left flex-1">
                  <p className="font-bold text-slate-800 text-sm">Transferir para Abrigo</p>
                  <p className="text-xs text-slate-500">Alerte um abrigo sobre a chegada</p>
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
                  <p className="font-bold text-slate-800 text-sm">Deixar livre / Local Seguro</p>
                  <p className="text-xs text-slate-500">Casa de parentes, sem registro em abrigo</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
