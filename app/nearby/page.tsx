'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { HELP_TYPE_LABELS } from '@/app/mock-data' // Vamos manter os enums que ajudam front
import CapacityBar from '@/components/ui/CapacityBar'
import StatusBadge from '@/components/ui/StatusBadge'
import InteractiveMap from '@/components/ui/InteractiveMap'
import { api } from '@/services/api'
import { getFirstName } from '@/services/utils'
import { useI18n } from '@/components/i18n/I18nProvider'

import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { fetchShelters } from '@/store/slices/sheltersSlice'
import { fetchRequests } from '@/store/slices/requestsSlice'
import { getCurrentPosition, getIPLocation } from '@/services/geolocation'

type Tab = 'shelters' | 'requests'

const RADIUS_OPTIONS = [1, 2, 5, 10]
const STATUS_OPTIONS = (t: any) => [
  { id: 'all', label: t('nearbyPage.statuses.all') },
  { id: 'pending', label: t('nearbyPage.statuses.pending') },
  { id: 'attending', label: t('nearbyPage.statuses.attending') }
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

// O Haversine pode continuar frontend como uma checagem secondary,
// mas confiaremos no raio do backend 
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

function NearbyContent() {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const moduleParam = searchParams.get('module')

  const dispatch = useDispatch<AppDispatch>()
  const sheltersState = useSelector((state: RootState) => state.shelters)
  const requestsState = useSelector((state: RootState) => state.requests)

  const [tab, setTab] = useState<Tab>('requests')
  const [radius, setRadius] = useState(5)
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationReady, setLocationReady] = useState(false)
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [mapExpanded, setMapExpanded] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('vnw_user');
      if (u) {
        try {
          const user = JSON.parse(u);
          if (user.lat && user.lng) return [parseFloat(user.lat), parseFloat(user.lng)];
        } catch(e){}
      }
    }
    return [-27.4332, -48.4550]; // Fallback Florianópolis
  })
  const [showAttendModal, setShowAttendModal] = useState(false)
  const [volunteerMessage, setVolunteerMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAttend = async () => {
    if (!selectedRequest) return
    setIsSubmitting(true)

    try {
      const response = await api.put(`/requests/${selectedRequest.id_code || selectedRequest.id}/status`, {
        status: 'attending',
        volunteer_message: volunteerMessage
      })

      if (response.status === 200) {
        setShowAttendModal(false)
        setSelectedPin(null)
        router.push('/volunteer/tasks')
      } else {
        alert(t('login.apiError'))
      }
    } catch (error) {
      console.error('Attend error:', error)
      alert(t('registerError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const acquireLocation = async () => {
      const storedUser = localStorage.getItem('vnw_user')
      let lat = mapCenter[0]
      let lng = mapCenter[1]

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser)
          // Se tiver coordenadas, PRIORIZA elas
          if (user.lat && user.lng) {
             lat = parseFloat(user.lat)
             lng = parseFloat(user.lng)
             setMapCenter([lat, lng])
             setLocationReady(true)
             dispatch(fetchShelters({ lat, lng, radiusKm: 5000 }))
             dispatch(fetchRequests({ lat, lng, radiusKm: 5000 }))
             return;
          }
        } catch (e) {}
      }

      try {
        const pos = await getCurrentPosition({ timeout: 5000 }).catch(() => getIPLocation())
        lat = pos.coords.latitude
        lng = pos.coords.longitude
        setMapCenter([lat, lng])
        setLocationReady(true)
      } catch (e) {
        console.warn('Could not get actual location, using default center')
        setLocationReady(true) // Ready anyway to show data
      }

      // Puxamos um raio de 5000km (ou muito largo) para o mapa enxergar TODO O BRASIL
      dispatch(fetchShelters({ lat, lng, radiusKm: 5000 }))
      dispatch(fetchRequests({ lat, lng, radiusKm: 5000 }))
    }

    acquireLocation()
  }, [dispatch]) 

  // 1. Processa TODOS os itens para apresentar no MAPA
  const mapShelters = sheltersState.items.map((s: any) => ({
    ...s,
    calcDistance: s.distanceKm || (s.lat && s.lng ? getDistanceFromLatLonInKm(mapCenter[0], mapCenter[1], s.lat, s.lng) : 0)
  }))

  const mapRequests = requestsState.items.map((r: any) => ({
    ...r,
    calcDistance: r.distanceKm || (r.lat && r.lng ? getDistanceFromLatLonInKm(mapCenter[0], mapCenter[1], r.lat, r.lng) : 0)
  })).filter((r: any) => {
    // Esconde resolvidos do MAPA operacional
    if (r.status === 'resolved' || r.status === 'completed') return false;
    return statusFilter === 'all' || r.status === statusFilter;
  })

  // 2. Filtra rigidamente pelo Raio selecionado para a LISTA de Cards
  const listShelters = mapShelters.filter((s: any) => s.calcDistance <= radius).sort((a: any, b: any) => a.calcDistance - b.calcDistance)
  const listRequests = mapRequests.filter((r: any) => r.calcDistance <= radius).sort((a: any, b: any) => a.calcDistance - b.calcDistance)

  // id_code compatibilidade com fallback mock.id
  const selectedShelter = sheltersState.items.find((s: any) => (s.id_code === selectedPin || s.id === selectedPin))
  const selectedRequest = requestsState.items.find((r: any) => (r.id_code === selectedPin || r.id === selectedPin))

  return (
    <main className="min-h-screen bg-surface dark:bg-[#0a1628] flex flex-col pb-44 transition-colors relative">
      {/* Header contextual */}
      {!moduleParam && (
        <div className="sticky top-0 z-20 px-4 pt-12 pb-6 bg-surface/90 dark:bg-[#0a1628]/90 backdrop-blur-xl border-b border-outline-variant/10 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-on-surface dark:text-white font-headline tracking-tight transition-colors">
                {t('nearbyPage.title')}
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                {locationReady ? (
                  <>
                    <div className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: `'FILL' 1` }}>location_on</span>
                      <span className="text-xs font-bold leading-none uppercase tracking-wider">{t('nearbyPage.locationActive')}</span>
                    </div>
                    <span className="text-outline-variant/30 text-xs mx-0.5">·</span>
                    <span className="text-on-surface-variant dark:text-outline-variant text-[11px] font-medium leading-none truncate max-w-[150px]">
                      {(() => {
                        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('vnw_user') : null;
                        if (storedUser) {
                          const user = JSON.parse(storedUser);
                          if (user.address_neighborhood && user.address_city) {
                            return `${user.address_neighborhood}, ${user.address_city}`;
                          }
                        }
                        return 'Localização Atual';
                      })()}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    <span className="text-primary text-[11px] font-bold uppercase tracking-wider">{t('nearbyPage.gettingLocation')}</span>
                  </>
                )}
              </div>
            </div>
            <button 
              onClick={() => router.back()}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-surface-container-high dark:bg-white/10 active:scale-95 transition-all shadow-sm border border-outline-variant/5 text-on-surface-variant dark:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Filters Overlay */}
      <div className="px-4 py-4 bg-surface/50 dark:bg-white/5 border-b border-outline-variant/5">
        <div className="flex items-center gap-2">
          <span className="text-on-surface-variant dark:text-outline-variant text-[10px] font-extrabold uppercase tracking-widest shrink-0">{t('nearbyPage.radiusLabel')}</span>
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
          <span className="text-slate-500 dark:text-white/40 text-[10px] font-extrabold uppercase tracking-widest shrink-0">{t('nearbyPage.statusLabel')}</span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {STATUS_OPTIONS(t).map((st: any) => (
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
          shelters={mapShelters}
          requests={mapRequests}
          tab={tab}
          radius={radius}
          selectedPin={selectedPin}
          onPinClick={(id: string) => setSelectedPin(selectedPin === id ? null : id)}
          onUpdateCenter={(center: [number, number]) => setMapCenter(center)}
          isExpanded={mapExpanded}
          onToggleExpand={() => setMapExpanded(!mapExpanded)}
          externalCenter={mapCenter}
        />
        <div className="absolute bottom-3 right-3 rounded-xl px-3 py-2 flex flex-col gap-1 bg-white/90 dark:bg-black/60 shadow-md dark:shadow-none backdrop-blur-md transition-colors">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-slate-600 dark:text-white/60 font-semibold transition-colors">{t('nearbyPage.legend.available')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[10px] text-slate-600 dark:text-white/60 font-semibold transition-colors">{t('nearbyPage.legend.nearFull')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-[10px] text-slate-600 dark:text-white/60 font-semibold transition-colors">{t('nearbyPage.legend.fullUrgent')}</span>
          </div>
        </div>
      </div>

      {/* Pin Details Modal */}
      {selectedPin && (selectedShelter || selectedRequest) && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedPin(null)} />
          <div className="relative z-10 bg-white dark:bg-[#0d2247] rounded-t-[2rem] px-5 pt-4 pb-32 reveal-pop max-h-[85vh] overflow-y-auto w-full shadow-2xl border-t border-slate-200 dark:border-white/5">
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5 shrink-0" />
            {selectedShelter && (
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight font-headline mb-1">{selectedShelter.name}</h3>
                <p className="text-xs text-slate-500 mb-6">{selectedShelter.reference} · {selectedShelter.distanceKm} km</p>
                <CapacityBar current={selectedShelter.occupied} total={selectedShelter.capacity} />
                <div className="flex gap-3 mt-6">
                  <a href={`tel:${selectedShelter.phone}`} className="flex-1 flex items-center justify-center gap-2 font-bold text-blue-600 bg-blue-50 py-3.5 rounded-xl active:scale-95 transition-transform"><span className="material-symbols-outlined text-[18px]">call</span>{t('shelters.call')}</a>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-transform"><span className="material-symbols-outlined text-[18px]">directions</span>{t('nearbyPage.attendBtn')}</button>
                </div>
              </div>
            )}
            {selectedRequest && (
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-800 dark:text-white text-2xl leading-tight font-headline">
                      {HELP_TYPE_LABELS[selectedRequest.type]?.label || selectedRequest.type}
                    </h3>
                    {selectedRequest.is_verified && (
                      <span className="material-symbols-outlined text-blue-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    )}
                  </div>
                  <StatusBadge status={selectedRequest.status} />
                </div>

                {selectedRequest.photo_url && (
                  <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden mb-6 bg-slate-100 dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-inner">
                    <img 
                      src={selectedRequest.photo_url} 
                      alt="Localização" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}

                <div className="space-y-4 mb-8 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-blue-600 text-[18px]">location_on</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Endereço</p>
                      <span className="dark:text-white font-bold leading-relaxed">{(selectedRequest as any).address}</span>
                    </div>
                  </div>

                  {selectedRequest.description && (
                    <div className="flex items-start gap-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Descrição</p>
                        <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
                          "{selectedRequest.description}"
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl">
                      <span className="material-symbols-outlined text-emerald-600">group</span>
                      <span className="dark:text-white font-bold">{(selectedRequest as any).people_count || (selectedRequest as any).people || 1} pessoas</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl truncate">
                      <span className="material-symbols-outlined text-orange-600">person</span>
                      <span className="dark:text-white font-bold truncate">{(selectedRequest as any).reporter_name || (selectedRequest as any).name || '---'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowAttendModal(true)}
                    className="flex-[2] bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all text-sm uppercase tracking-widest"
                  >
                    <span className="material-symbols-outlined">directions_car</span>
                    {t('nearbyPage.attendBtn')}
                  </button>
                  <a 
                    href={`tel:${selectedRequest.reporter_phone || selectedRequest.phone}`}
                    className="flex-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center justify-center active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined">call</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attend Confirmation Modal */}
      {showAttendModal && selectedRequest && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !isSubmitting && setShowAttendModal(false)} />
          <div className="relative z-10 bg-white dark:bg-[#0d2247] rounded-t-[3rem] px-6 pt-6 pb-20 reveal-pop max-h-[90vh] overflow-y-auto w-full shadow-2xl">
            <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-8" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-[32px]">volunteer_activism</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white font-headline leading-tight">{t('nearbyPage.modalAttend.title')}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{HELP_TYPE_LABELS[selectedRequest.type]?.label || selectedRequest.type} · {selectedRequest.id_code?.slice(0,8)}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/5 mb-6">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('nearbyPage.modalAttend.messageLabel')}</p>
               <textarea
                 value={volunteerMessage}
                 onChange={(e) => setVolunteerMessage(e.target.value)}
                 placeholder={t('nearbyPage.modalAttend.messagePlace')}
                 className="w-full bg-transparent border-none p-0 text-sm font-semibold text-slate-700 dark:text-white placeholder:text-slate-400 outline-none resize-none h-24"
               />
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-8 italic leading-relaxed text-center px-4">
              {t('nearbyPage.modalAttend.warning')}
            </p>

            <div className="flex flex-col gap-3">
              <button
                 onClick={handleAttend}
                 disabled={isSubmitting}
                 className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    {t('nearbyPage.modalAttend.confirm')}
                  </>
                )}
              </button>
              
              <button
                 onClick={() => setShowAttendModal(false)}
                 disabled={isSubmitting}
                 className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest"
              >
                {t('nearbyPage.modalAttend.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 px-4 mt-4">
        <button onClick={() => { setTab('requests'); setSelectedPin(null) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-bold transition-all border ${tab === 'requests' ? 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/20' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5'}`}><span className="material-symbols-outlined text-[18px]">sos</span>{t('nearbyPage.tabs.requests')}</button>
        <button onClick={() => { setTab('shelters'); setSelectedPin(null) }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-bold transition-all border ${tab === 'shelters' ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20' : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5'}`}><span className="material-symbols-outlined text-[18px]">house</span>{t('nearbyPage.tabs.shelters')}</button>
      </div>

      <div className="px-4 mt-3 space-y-2.5">
        {(tab === 'requests' ? listRequests : listShelters).map((item: any) => (
          <button 
            key={item.id_code || Math.random()} 
            onClick={() => setSelectedPin(item.id_code)} 
            className={`w-full text-left rounded-[2rem] p-5 transition-all border bg-white dark:bg-white/5 border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md active:scale-[0.98] ${selectedPin === item.id_code ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-[#0a1628]' : ''}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                    <p className="font-extrabold text-slate-800 dark:text-white text-base leading-snug truncate transition-colors">
                        {getFirstName(item.name || HELP_TYPE_LABELS[item.type as keyof typeof HELP_TYPE_LABELS]?.label || item.type)}
                    </p>
                    {item.is_verified && (
                        <span className="material-symbols-outlined text-blue-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    )}
                    {item.photo_url && (
                        <span className="material-symbols-outlined text-slate-400 text-[16px]">image</span>
                    )}
                </div>
                {tab === 'requests' && (
                  <div className="space-y-0.5">
                    <p className="text-[11px] text-slate-500 font-bold truncate transition-colors">
                        {item.address || t('nearbyPage.mapLocation')}
                    </p>
                    {item.description && (
                        <p className="text-[10px] text-slate-400 font-medium truncate leading-tight">
                            {item.description}
                        </p>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter shrink-0">{item.calcDistance} km</span>
            </div>
            {tab === 'shelters' ? (
              <CapacityBar current={item.occupied} total={item.capacity} />
            ) : (
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} size="sm" />
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${item.urgency === 'high' ? 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400' : item.urgency === 'medium' ? 'text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400' : 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                    {t(`nearbyPage.urgency.${item.urgency || 'low'}`)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-white/5">
                    <span className="material-symbols-outlined text-[14px]">group</span>
                    <span>{item.people_count || item.people || 1}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-white/5 truncate">
                    <span className="material-symbols-outlined text-[14px]">person</span>
                    <span className="truncate">{getFirstName(item.reporter_name || item.name)}</span>
                  </div>
                </div>
              </div>
            )}
          </button>
        ))}
        {/* Caso a lista fique vazia ao reduzir o raio */}
        {(tab === 'requests' ? listRequests : listShelters).length === 0 && (
           <p className="text-center text-xs text-slate-500 py-6">{t('nearbyPage.empty').replace('{radius}', radius.toString())}</p>
        )}
      </div>

    </main>
  )
}

export default function NearbyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#0a1628] flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" /></div>}>
       <NearbyContent />
    </Suspense>
  )
}
