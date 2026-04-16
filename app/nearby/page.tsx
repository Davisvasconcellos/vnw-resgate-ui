'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SHELTERS, HELP_REQUESTS, HELP_TYPE_LABELS } from '@/app/mock-data'
import CapacityBar from '@/components/ui/CapacityBar'
import StatusBadge from '@/components/ui/StatusBadge'
import InteractiveMap from '@/components/ui/InteractiveMap'
import BottomNavTransport from '@/components/BottomNavTransport'
import BottomNavBoat from '@/components/BottomNavBoat'
import BottomNavShelterManage from '@/components/BottomNavShelterManage'

type Tab = 'shelters' | 'requests'

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
  const router = useRouter()
  const searchParams = useSearchParams()
  const moduleParam = searchParams.get('module')

  const [tab, setTab] = useState<Tab>('shelters')
  const [radius, setRadius] = useState(5)
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationReady, setLocationReady] = useState(false)
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [mapExpanded, setMapExpanded] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([-27.4332, -48.4550])

  useEffect(() => {
    const t = setTimeout(() => setLocationReady(true), 1600)
    return () => clearTimeout(t)
  }, [])

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
    <main className="min-h-screen bg-surface dark:bg-inverse-surface flex flex-col pb-44 transition-colors">
      {/* Header contextual */}
      {!moduleParam && (
        <div className="sticky top-0 z-20 px-4 pt-12 pb-6 bg-surface/90 dark:bg-inverse-surface/90 backdrop-blur-xl border-b border-outline-variant/10 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-on-surface dark:text-inverse-on-surface font-headline tracking-tight transition-colors">
                Situação próxima
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                {locationReady ? (
                  <>
                    <div className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: `'FILL' 1` }}>location_on</span>
                      <span className="text-xs font-bold leading-none uppercase tracking-wider">Localização ativa</span>
                    </div>
                    <span className="text-outline-variant/30 text-xs mx-0.5">·</span>
                    <span className="text-on-surface-variant dark:text-outline-variant text-[11px] font-medium leading-none truncate max-w-[150px]">Canasvieiras, Florianópolis</span>
                  </>
                ) : (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    <span className="text-primary text-[11px] font-bold uppercase tracking-wider">Obtendo localização…</span>
                  </>
                )}
              </div>
            </div>
            <button 
              onClick={() => router.back()}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-surface-container-high dark:bg-white/10 active:scale-95 transition-all shadow-sm border border-outline-variant/5 text-on-surface-variant dark:text-inverse-on-surface"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Filters Overlay */}
      <div className="px-4 py-4 bg-surface/50 dark:bg-inverse-surface/50 border-b border-outline-variant/5">
        <div className="flex items-center gap-2">
          <span className="text-on-surface-variant dark:text-outline-variant text-[10px] font-extrabold uppercase tracking-widest shrink-0">Raio:</span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`text-[11px] font-extrabold px-3 py-1.5 rounded-xl transition-all active:scale-95 whitespace-nowrap ${radius === r ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-low dark:bg-white/10 text-on-surface-variant border border-outline-variant/10'}`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-slate-500 dark:text-white/40 text-[10px] font-extrabold uppercase tracking-widest shrink-0">Status:</span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {STATUS_OPTIONS.map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all active:scale-95 whitespace-nowrap ${statusFilter === st.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/40'}`}
              >
                {st.label}
              </button>
            ))}
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

      {/* Pin Details Modal */}
      {selectedPin && (selectedShelter || selectedRequest) && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedPin(null)} />
          <div className="relative z-10 bg-white rounded-t-[2rem] px-5 pt-4 pb-32 reveal-pop max-h-[85vh] overflow-y-auto w-full shadow-2xl border-t border-slate-200">
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5 shrink-0" />
            {selectedShelter && (
              <div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight font-headline mb-1">{selectedShelter.name}</h3>
                <p className="text-xs text-slate-500 mb-6">{selectedShelter.reference} · {selectedShelter.distanceKm} km</p>
                <CapacityBar current={selectedShelter.occupied} total={selectedShelter.capacity} />
                <div className="flex gap-3 mt-6">
                  <a href={`tel:${selectedShelter.phone}`} className="flex-1 flex items-center justify-center gap-2 font-bold text-blue-600 bg-blue-50 py-3.5 rounded-xl active:scale-95 transition-transform"><span className="material-symbols-outlined text-[18px]">call</span>Ligar</a>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-transform"><span className="material-symbols-outlined text-[18px]">directions</span>Rotas</button>
                </div>
              </div>
            )}
            {selectedRequest && (
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight font-headline">Pedido: {HELP_TYPE_LABELS[selectedRequest.type]?.label || selectedRequest.type}</h3>
                  <StatusBadge status={selectedRequest.status} />
                </div>
                <div className="space-y-4 mb-8 text-sm">
                  <div className="flex items-center gap-3"><span className="material-symbols-outlined text-blue-600">location_on</span><span>{selectedRequest.address}</span></div>
                  <div className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-600">group</span><span>{selectedRequest.people} pessoas</span></div>
                </div>
                <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"><span className="material-symbols-outlined">directions_car</span>Atender</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 px-4 mt-4">
        <button onClick={() => { setTab('shelters'); setSelectedPin(null) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-bold transition-all border ${tab === 'shelters' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200'}`}><span className="material-symbols-outlined text-[18px]">house</span>Abrigos</button>
        <button onClick={() => { setTab('requests'); setSelectedPin(null) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-bold transition-all border ${tab === 'requests' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-slate-500 border-slate-200'}`}><span className="material-symbols-outlined text-[18px]">sos</span>Pedidos</button>
      </div>

      {/* List */}
      <div className="px-4 mt-3 space-y-2.5">
        {(tab === 'shelters' ? filteredShelters : filteredRequests).map((item: any) => (
          <button key={item.id} onClick={() => setSelectedPin(item.id)} className={`w-full text-left rounded-2xl p-4 transition-all border bg-white border-slate-100`}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-slate-800 text-sm leading-snug">{item.name || HELP_TYPE_LABELS[item.type as keyof typeof HELP_TYPE_LABELS]?.label || item.type}</p>
              <span className="text-xs font-bold text-slate-400">{item.calcDistance} km</span>
            </div>
            {tab === 'shelters' ? <CapacityBar current={item.occupied} total={item.capacity} /> : <StatusBadge status={item.status} size="sm" />}
          </button>
        ))}
      </div>

      {/* Navbars contextuais */}
      {moduleParam === 'transport' && <BottomNavTransport />}
      {moduleParam === 'boat' && <BottomNavBoat />}
      {moduleParam === 'shelter' && <BottomNavShelterManage onCheckinClick={() => {}} />}
    </main>
  )
}
