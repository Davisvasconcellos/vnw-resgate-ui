'use client'

import { useState } from 'react'
import Link from 'next/link'
import StatusBadge from '@/components/ui/StatusBadge'
import InteractiveMap from '@/components/ui/InteractiveMap'
import { HELP_REQUESTS, HELP_TYPE_LABELS } from '@/app/mock-data'
import type { HelpRequest, HelpStatus } from '@/app/mock-data'

const FILTERS: { label: string; value: 'all' | HelpStatus }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Em andamento', value: 'attending' },
  { label: 'Visualizados', value: 'viewed' },
]

export default function DashboardPage() {
  const [filter, setFilter] = useState<'all' | HelpStatus>('all')
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null)

  const filtered = filter === 'all' ? HELP_REQUESTS : HELP_REQUESTS.filter((r) => r.status === filter)

  return (
    <main className="min-h-screen bg-slate-50 relative pb-24 overflow-hidden h-screen flex flex-col">
      {/* Header Overlay */}
      <div className="absolute top-0 w-full z-20 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm translate-z-0">
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <Link href="/profile" className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 font-headline">Mapa em Tempo Real</h1>
          </div>
          <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap border border-red-100 shadow-sm">
            {HELP_REQUESTS.filter((r) => r.urgency === 'high').length} urgentes
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === f.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 active:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAP LAYER */}
      <div className="flex-1 w-full bg-slate-200" style={{ zIndex: 1 }}>
        <InteractiveMap onMarkerClick={(req: HelpRequest) => setSelectedRequest(req)} />
      </div>

      {/* List Layer Slider - Appears at bottom if no popup is shown */}
      <div className="absolute bottom-[90px] left-0 right-0 z-20 pointer-events-none px-2 h-44 flex items-end">
        <div className="w-full flex gap-3 overflow-x-auto px-2 pb-2 -mx-2 pointer-events-auto no-scrollbar snap-x snap-mandatory">
          {filtered.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedRequest(req)}
              className="min-w-[280px] w-[85vw] snap-center bg-white rounded-2xl p-4 shadow-lg border border-slate-100 active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {req.photoUrl ? (
                    <img src={req.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-800 text-base leading-tight font-headline">
                      {HELP_TYPE_LABELS[req.type]?.label || req.type}
                    </h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {req.distanceKm} km \— {req.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Popup Modal */}
      {selectedRequest && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
          <div className="relative z-10 bg-white rounded-t-[2rem] px-5 pt-4 pb-8 reveal-pop max-h-[85vh] overflow-y-auto w-full shadow-2xl border-t border-slate-200">
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5 shrink-0" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 shadow-sm border border-slate-200">
                  {selectedRequest.photoUrl ? (
                    <img src={selectedRequest.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight font-headline mb-1">
                    {HELP_TYPE_LABELS[selectedRequest.type]?.label || selectedRequest.type}
                  </h3>
                  <StatusBadge status={selectedRequest.status} />
                </div>
              </div>
              {selectedRequest.urgency === 'high' && (
                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span> Urgente
                </span>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Endereço Exato</p>
                  <p className="text-sm font-bold text-slate-800">{selectedRequest.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">group</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Vítimas no local</p>
                  <p className="text-sm font-bold text-slate-800">{selectedRequest.people} pessoas</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 italic mb-6">
              "Aguardando atendimento. Em situação de risco."
            </p>

            <button 
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-base shadow-[0_8px_24px_-6px_rgba(37,99,235,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-2"
              onClick={() => {
                alert('Você assumiu este atendimento!')
                setSelectedRequest(null)
              }}
            >
              <span className="material-symbols-outlined">directions_car</span>
              Assumir Pedido e Iniciar Rota
            </button>
            <button 
              className="w-full mt-3 bg-white text-slate-600 border border-slate-200 font-bold py-3.5 rounded-xl text-sm active:scale-95 transition-all outline-none"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const a = document.createElement('a')
                  a.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedRequest.address)}`
                  a.target = '_blank'
                  a.click()
                }
              }}
            >
              Abrir no GPS (Google Maps)
            </button>

          </div>
        </div>
      )}

    </main>
  )
}
