'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SHELTERS, HELP_REQUESTS, HELP_TYPE_LABELS } from '@/app/mock-data'
import CapacityBar from '@/components/ui/CapacityBar'
import StatusBadge from '@/components/ui/StatusBadge'
import InteractiveMap from '@/components/ui/InteractiveMap'

type Tab = 'shelters' | 'requests'

// Scatter coordinates (%) para simular o mapa com pins relativos
const MAP_PINS_SHELTERS = [
  { id: 'sh-1', top: '35%', left: '30%' },
  { id: 'sh-2', top: '55%', left: '60%' },
  { id: 'sh-3', top: '22%', left: '65%' },
  { id: 'sh-4', top: '68%', left: '25%' },
]

const MAP_PINS_REQUESTS = [
  { id: 'req-1', top: '40%', left: '40%' },
  { id: 'req-2', top: '30%', left: '55%' },
  { id: 'req-3', top: '62%', left: '55%' },
  { id: 'req-4', top: '72%', left: '38%' },
]

const RADIUS_OPTIONS = [1, 2, 5, 10]
const STATUS_OPTIONS = [
  { id: 'all', label: 'Todos' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'attending', label: 'Em atendimento' }
]

function getShelterPinColor(pct: number) {
  if (pct >= 90) return '#C62828'
  if (pct >= 70) return '#E65100'
  return '#2E7D32'
}

function getRequestPinColor(urgency: string) {
  if (urgency === 'high') return '#C62828'
  if (urgency === 'medium') return '#E65100'
  return '#2E7D32'
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI/180)
  const dLon = (lon2 - lon1) * (Math.PI/180) 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
  return parseFloat((R * c).toFixed(1))
}

export default function NearbyPage() {
  const [tab, setTab] = useState<Tab>('shelters')
  const [radius, setRadius] = useState(5)
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationReady, setLocationReady] = useState(false)
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [mapExpanded, setMapExpanded] = useState(false)
  
  // Guardamos o centro do mapa para recalcular distâncias (Targeting)
  const [mapCenter, setMapCenter] = useState<[number, number]>([-27.4332, -48.4550])

  useEffect(() => {
    const t = setTimeout(() => setLocationReady(true), 1600)
    return () => clearTimeout(t)
  }, [])

  // Recalculando distâncias com o centro visual do mapa (alvo) em vez do usuário, se lat/lng existir.
  const filteredShelters = SHELTERS.map(s => ({
    ...s,
    calcDistance: s.lat && s.lng ? getDistanceFromLatLonInKm(mapCenter[0], mapCenter[1], s.lat, s.lng) : s.distanceKm
  })).filter(s => s.calcDistance <= radius)

  const filteredRequests = HELP_REQUESTS.map(r => ({
    ...r,
    calcDistance: r.lat && r.lng ? getDistanceFromLatLonInKm(mapCenter[0], mapCenter[1], r.lat, r.lng) : r.distanceKm
  })).filter(r => {
    if (r.calcDistance > radius) return false
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    return true
  })

  const selectedShelter = SHELTERS.find((s) => s.id === selectedPin)
  const selectedRequest = HELP_REQUESTS.find((r) => r.id === selectedPin)

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col pb-28 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-12 pb-3 bg-white/90 dark:bg-[#0a1628]/92 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white font-headline transition-colors">Situação próxima</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              {locationReady ? (
                <>
                  <span
                    className="material-symbols-outlined text-emerald-400 text-[14px]"
                    style={{ fontVariationSettings: `'FILL' 1` }}
                  >
                    location_on
                  </span>
                  <span className="text-emerald-400 text-xs font-semibold">Localização ativa</span>
                  <span className="text-slate-400 dark:text-white/30 text-xs mx-1">·</span>
                  <span className="text-slate-500 dark:text-white/40 text-xs transition-colors">Canasvieiras, Florianópolis</span>
                </>
              ) : (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border border-yellow-400 border-t-transparent" />
                  <span className="text-yellow-400 text-xs font-semibold">Obtendo localização…</span>
                </>
              )}
            </div>
          </div>

          <Link href="/" className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-slate-500 dark:text-white/60 text-[20px]">close</span>
          </Link>
        </div>

        {/* Filters */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-white/40 text-xs font-semibold shrink-0 transition-colors">Raio:</span>
            <div className="flex gap-1.5">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 ${radius === r ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/40'}`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2.5">
            <span className="text-slate-500 dark:text-white/40 text-xs font-semibold shrink-0 transition-colors">Status:</span>
            <div className="flex gap-1.5">
              {STATUS_OPTIONS.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 ${statusFilter === st.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/40'}`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className={`relative ${mapExpanded ? 'h-[36rem]' : 'h-72'} overflow-hidden mx-4 mt-2 rounded-3xl border border-slate-200 dark:border-white/10 transition-all duration-500 ease-in-out shadow-sm dark:shadow-none`}>
        {/* @ts-ignore */}
        <InteractiveMap 
          shelters={filteredShelters}
          requests={filteredRequests}
          tab={tab}
          radius={radius}
          selectedPin={selectedPin}
          onPinClick={(id: string) => setSelectedPin(selectedPin === id ? null : id)}
          onUpdateCenter={(center: [number, number]) => setMapCenter(center)}
          isExpanded={mapExpanded}
          onToggleExpand={() => setMapExpanded(!mapExpanded)}
        />

        {/* Legend */}
        <div className="absolute bottom-3 right-3 rounded-xl px-3 py-2 flex flex-col gap-1 bg-white/90 dark:bg-black/60 shadow-md dark:shadow-none backdrop-blur-md transition-colors">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-slate-600 dark:text-white/60 font-semibold transition-colors">Disponível</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[10px] text-slate-600 dark:text-white/60 font-semibold transition-colors">Quase cheio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-[10px] text-slate-600 dark:text-white/60 font-semibold transition-colors">Lotado / Urgente</span>
          </div>
        </div>
      </div>

      {/* Slide-Up Modal de pin selecionado */}
      {selectedPin && (selectedShelter || selectedRequest) && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedPin(null)} />
          <div className="relative z-10 bg-white rounded-t-[2rem] px-5 pt-4 pb-8 reveal-pop max-h-[85vh] overflow-y-auto w-full shadow-2xl border-t border-slate-200">
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5 shrink-0" />
            
            {selectedShelter && (
              <div>
                <div className="flex items-start justify-between gap-2 mb-6">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-tight font-headline mb-1">
                      {selectedShelter.name}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedShelter.reference} · {selectedShelter.distanceKm} km</p>
                  </div>
                </div>

                <div className="mb-6">
                  <CapacityBar current={selectedShelter.occupied} total={selectedShelter.capacity} />
                  <p className="text-xs text-center text-slate-500 mt-2">{selectedShelter.occupied} ocupados de {selectedShelter.capacity}</p>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`tel:${selectedShelter.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 font-bold text-blue-600 bg-blue-50 py-3.5 rounded-xl active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    Ligar: {selectedShelter.phone}
                  </a>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-transform"
                    onClick={() => Object.assign(document.createElement('a'), { href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedShelter.address)}`, target: '_blank' }).click()}
                  >
                    <span className="material-symbols-outlined text-[18px]">directions</span>
                    Como chegar
                  </button>
                </div>
              </div>
            )}

            {selectedRequest && (
              <div>
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
                        Pedido: {HELP_TYPE_LABELS[selectedRequest.type]?.label || selectedRequest.type}
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
                      <p className="text-sm font-bold text-slate-800">{selectedRequest.address} · {selectedRequest.distanceKm} km</p>
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

                <button 
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-base shadow-[0_8px_24px_-6px_rgba(37,99,235,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-2"
                  onClick={() => {
                    alert('Você abriu a rota!')
                    setSelectedPin(null)
                  }}
                >
                  <span className="material-symbols-outlined">directions_car</span>
                  Atender Chamado e Guiar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 px-4 mt-4">
        <button
          onClick={() => { setTab('shelters'); setSelectedPin(null) }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95 border ${tab === 'shelters' ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-white/40 border-slate-200 dark:border-white/10'}`}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: `'FILL' ${tab === 'shelters' ? 1 : 0}` }}>house</span>
          Abrigos ({filteredShelters.length})
        </button>
        <button
          onClick={() => { setTab('requests'); setSelectedPin(null) }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95 border ${tab === 'requests' ? 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-white/40 border-slate-200 dark:border-white/10'}`}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: `'FILL' ${tab === 'requests' ? 1 : 0}` }}>sos</span>
          Pedidos ({filteredRequests.length})
        </button>
      </div>

      {/* List */}
      <div className="px-4 mt-3 space-y-2.5">
        {tab === 'shelters' && (
          <>
            {filteredShelters.length === 0 ? (
              <p className="text-slate-400 dark:text-white/30 text-sm text-center py-6 font-semibold">Nenhum abrigo no raio de {radius} km</p>
            ) : (
              filteredShelters.map((s) => {
                const pct = Math.round((s.occupied / s.capacity) * 100)
                const color = getShelterPinColor(pct)
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedPin(selectedPin === s.id ? null : s.id)}
                    className={`w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98] border ${selectedPin === s.id ? 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/50' : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/10'}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="font-bold text-slate-800 dark:text-white font-headline text-sm leading-snug flex-1 transition-colors">{s.name}</p>
                      <span className="text-xs font-bold shrink-0 px-2 py-0.5 rounded-full" style={{ background: `${color}25`, color }}>
                        {s.calcDistance} km
                      </span>
                    </div>
                    <CapacityBar current={s.occupied} total={s.capacity} />
                  </button>
                )
              })
            )}
          </>
        )}

        {tab === 'requests' && (
          <>
            {filteredRequests.length === 0 ? (
              <p className="text-slate-400 dark:text-white/30 text-sm text-center py-6 font-semibold">Nenhum pedido no raio de {radius} km</p>
            ) : (
              filteredRequests.map((r) => {
                const color = getRequestPinColor(r.urgency)
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedPin(selectedPin === r.id ? null : r.id)}
                    className={`w-full text-left rounded-2xl p-4 transition-all active:scale-[0.98] border ${selectedPin === r.id ? 'bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-500/50' : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      {r.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100 dark:border-transparent" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center" style={{ background: `${color}25` }}>
                          <span className="material-symbols-outlined text-[22px]" style={{ color, fontVariationSettings: `'FILL' 1` }}>
                            {HELP_TYPE_LABELS[r.type as keyof typeof HELP_TYPE_LABELS]?.icon}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-bold text-slate-800 dark:text-white font-headline text-sm transition-colors">{HELP_TYPE_LABELS[r.type as keyof typeof HELP_TYPE_LABELS]?.label || r.type}</p>
                          <StatusBadge status={r.status} size="sm" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-white/40 mt-0.5 flex items-center gap-1 truncate transition-colors">
                          <span className="material-symbols-outlined text-[12px]">location_on</span>
                          {r.calcDistance} km do alvo — {r.address}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-white/50 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">group</span>
                            {r.people} pessoas
                          </span>
                          <span className="flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                            {r.urgency === 'high' ? 'Alta urgência' : r.urgency === 'medium' ? 'Média urgência' : 'Baixa'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </>
        )}
      </div>
    </main>
  )
}
