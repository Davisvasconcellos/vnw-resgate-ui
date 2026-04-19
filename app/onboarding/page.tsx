'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials, UserRole } from '@/store/slices/authSlice'
import { RootState } from '@/store'
import { api } from '@/services/api'
import LocationIndicator from '@/components/ui/LocationIndicator'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), { ssr: false })

function OnboardingContent() {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const offer = (searchParams.get('offer') ?? 'volunteer') as UserRole

  const [submitting, setSubmitting] = useState(false)
  
  // Volunteer multi-state
  const [hasCar, setHasCar] = useState(false)
  const [hasBoat, setHasBoat] = useState(false)
  const [hasGeneral, setHasGeneral] = useState(true)

  // Car data
  const [carType, setCarType] = useState('car')
  const [carSeats, setCarSeats] = useState(4)
  const [carRegion, setCarRegion] = useState('')
  const [carOffroad, setCarOffroad] = useState(false)

  // Boat data
  const [boatType, setBoatType] = useState('motor')
  const [boatSpots, setBoatSpots] = useState(2)
  const [boatRegion, setBoatRegion] = useState('')
  const [boatVests, setBoatVests] = useState(false)

  const [skills, setSkills] = useState<string[]>([])
  const profile = useSelector((state: RootState) => state.auth.profile)

  // Location States for Shelter
  const [locationStatus, setLocationStatus] = useState<'acquiring' | 'ready' | 'error'>('acquiring')
  const [locationAddress, setLocationAddress] = useState('Obtendo localização...')
  const [showMapModal, setShowMapModal] = useState(false)
  const [pickedLoc, setPickedLoc] = useState<[number, number]>([-27.4350, -48.4550])
  const [mapFlyTrigger, setMapFlyTrigger] = useState<[number, number] | null>(null)

  const searchAddressForCoords = async () => {
    if (!locationAddress || locationAddress === 'Obtendo localização...') return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationAddress)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setPickedLoc([lat, lon]);
        setMapFlyTrigger([lat, lon]);
      } else {
        alert('Endereço não localizado pelo satélite. Tente detalhar mais a rua e cidade.');
      }
    } catch(e) {}
  }

  const reverseGeocode = async (center: [number, number]) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${center[0]}&lon=${center[1]}`);
      const data = await res.json();
      if (data && data.display_name) {
        setLocationAddress(data.display_name);
      }
    } catch (e) {}
  }

  // Initial location fetch simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationStatus('ready')
      setLocationAddress('R. das Gaivotas, 320 – Canasvieiras, Florianópolis')
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Recovery: If we have token but no profile (refresh), fetch /me
  useEffect(() => {
    const recoverProfile = async () => {
      if (!profile && localStorage.getItem('vnw_token')) {
        try {
          const res = await api.get('/auth/me')
          const userData = res.data.data.user
          dispatch(setCredentials({
            id_code: userData.id_code,
            role: userData.role,
            token: localStorage.getItem('vnw_token') || '',
            profile: userData
          }))
        } catch (e) {
          console.error('Failed to recover profile', e)
        }
      }
    }
    recoverProfile()
  }, [profile, dispatch])

  // Pre-fill form if profile exists
  useEffect(() => {
    if (profile?.volunteer_profile) {
      const v = profile.volunteer_profile
      
      const types = v.offer_types || []
      setHasCar(types.includes('transport'))
      setHasBoat(types.includes('boat'))
      setHasGeneral(types.includes('volunteer'))

      if (v.car_details) {
        setCarType(v.car_details.type || 'car')
        setCarSeats(v.car_details.seats || 4)
        setCarRegion(v.car_details.region || '')
        setCarOffroad(!!v.car_details.offroad)
      }

      if (v.boat_details) {
        setBoatType(v.boat_details.type || 'motor')
        setBoatSpots(v.boat_details.spots || 2)
        setBoatRegion(v.boat_details.region || '')
        setBoatVests(!!v.boat_details.vests)
      }

      if (v.skills) {
        setSkills(v.skills)
      }
    }
  }, [profile])

  // Auto-redirect if already has a shelter
  useEffect(() => {
    if (offer === 'shelter' && profile?.managed_shelters && profile.managed_shelters.length > 0) {
      router.push(`/shelter/manage`)
    }
  }, [profile, offer, router])

  const toggleSkill = (id: string) => {
    setSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (offer === 'shelter') {
        const payload = {
          name: (e.target as any).querySelector('input[name="shelterName"]').value,
          address: locationAddress,
          capacity: Number((e.target as any).querySelector('input[name="shelterCapacity"]').value),
          lat: pickedLoc[0],
          lng: pickedLoc[1]
        }
        const res = await api.post('/shelters', payload)
        const shelter = res.data.data
        
        // Sync state and redirect to shelter page
        const meRes = await api.get('/auth/me');
        dispatch(setCredentials({
          id_code: meRes.data.data.user.id_code,
          role: 'manager',
          token: localStorage.getItem('vnw_token') || '',
          profile: meRes.data.data.user
        }))
        
        router.push(`/shelter/manage`)
        return;
      } else {
        const payload = {
          offer_types: [
            hasCar ? 'transport' : null,
            hasBoat ? 'boat' : null,
            hasGeneral ? 'volunteer' : null
          ].filter(Boolean),
          car_details: hasCar ? { type: carType, seats: carSeats, region: carRegion, offroad: carOffroad } : null,
          boat_details: hasBoat ? { type: boatType, spots: boatSpots, region: boatRegion, vests: boatVests } : null,
          availability: 'full',
          skills: skills
        }
        
        await api.post('/volunteers/profile', payload)
      }

      // Re-fetch /me to sync state
      const meRes = await api.get('/auth/me');
      
      dispatch(setCredentials({
        id_code: meRes.data.data.user.id_code,
        role: offer,
        token: localStorage.getItem('vnw_token') || 'temp-token',
        profile: meRes.data.data.user
      }))

      router.push('/assist')
    } catch (error: any) {
      console.error('Onboarding error:', error)
      const msg = error.response?.data?.message || 'Erro ao salvar dados. Verifique os campos.'
      alert(`Erro: ${msg}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a1628] flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/90 dark:bg-[#0a1628]/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 px-6 pt-12 pb-8 sticky top-0 z-20">
        <section className="flex items-start gap-4 relative max-w-2xl mx-auto">
          <Link 
            href="/assist"
            className="w-11 h-11 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-200 active:scale-95 transition-all shadow-sm shrink-0 border border-slate-100 dark:border-white/5"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-tight font-headline">
              {offer === 'volunteer' ? t('assistPage.types.volunteer') : t(`onboarding.titles.${offer}`)}
            </h1>
            <p className="mt-1.5 text-slate-500 dark:text-slate-400 font-body text-base font-medium">
              {offer === 'volunteer' ? t('onboarding.descs.volunteer') : t(`onboarding.descs.${offer}`)}
            </p>
          </div>
        </section>
      </div>

      {/* Forms */}
      <form id="onboardingForm" onSubmit={handleSubmit} className="flex-1 px-4 pt-6 pb-32 space-y-6">
        
        {/* SHELTER FORM */}
        {offer === 'shelter' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 block">{t('onboarding.shelterForm.name')}</label>
              <input required name="shelterName" type="text" placeholder={t('onboarding.shelterForm.namePlace')} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-all" />
            </div>
            
            {/* NOVO: Seletor de Localização Premium */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 block">{t('onboarding.shelterForm.address')}</label>
              <LocationIndicator address={locationAddress} status={locationStatus} onClick={() => setShowMapModal(true)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 block">{t('onboarding.shelterForm.capacity')}</label>
                <input required name="shelterCapacity" type="number" placeholder={t('onboarding.shelterForm.capacityPlace')} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 block">{t('onboarding.shelterForm.structure')}</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'water', label: t('onboarding.shelterForm.water') },
                  { id: 'food', label: t('onboarding.shelterForm.food') },
                  { id: 'bath', label: t('onboarding.shelterForm.bath') },
                  { id: 'energy', label: t('onboarding.shelterForm.energy') },
                  { id: 'pet', label: t('onboarding.shelterForm.pet') },
                  { id: 'medical', label: t('onboarding.shelterForm.medical') },
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-3 active:bg-slate-50 dark:active:bg-white/10 transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-white/20 text-blue-600 focus:ring-blue-500 bg-transparent" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VOLUNTEER MULTI-FORM */}
        {offer === 'volunteer' && (
          <div className="space-y-8">
            {/* Category Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={() => setHasCar(!hasCar)}
                className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${hasCar ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 text-slate-400'}`}
              >
                <span className="material-symbols-outlined text-3xl">directions_car</span>
                <span className="text-xs font-bold uppercase">{t('onboarding.volunteerForm.hasCar')}</span>
              </button>
              <button 
                type="button"
                onClick={() => setHasBoat(!hasBoat)}
                className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${hasBoat ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 text-slate-400'}`}
              >
                <span className="material-symbols-outlined text-3xl">directions_boat</span>
                <span className="text-xs font-bold uppercase">{t('onboarding.volunteerForm.hasBoat')}</span>
              </button>
            </div>

            {/* Car Sub-form */}
            {hasCar && (
              <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded-[2rem] p-6 border border-orange-100 dark:border-orange-900/30 space-y-4 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 mb-2">
                  <span className="material-symbols-outlined">settings_suggest</span>
                  <p className="font-bold text-sm uppercase tracking-wider">{t('onboarding.transportForm.dataTitle')}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.transportForm.type')}</label>
                  <select value={carType} onChange={(e) => setCarType(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white outline-none">
                    <option value="car">{t('onboarding.transportForm.car')}</option>
                    <option value="pickup">{t('onboarding.transportForm.pickup')}</option>
                    <option value="truck">{t('onboarding.transportForm.truck')}</option>
                    <option value="van">{t('onboarding.transportForm.van')}</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.transportForm.labelSeats')}</label>
                    <input type="number" value={carSeats} onChange={(e) => setCarSeats(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white outline-none" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 flex-1 h-[46px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 group">
                      <input type="checkbox" checked={carOffroad} onChange={(e) => setCarOffroad(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-primary" />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{t('onboarding.transportForm.offroad')}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Boat Sub-form */}
            {hasBoat && (
              <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] p-6 border border-blue-100 dark:border-blue-900/30 space-y-4 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                  <span className="material-symbols-outlined">water_drop</span>
                  <p className="font-bold text-sm uppercase tracking-wider">{t('onboarding.volunteerForm.dataTitle')}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.volunteerForm.typeTitle')}</label>
                  <select value={boatType} onChange={(e) => setBoatType(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white outline-none">
                    <option value="motor">{t('onboarding.boatForm.motor')}</option>
                    <option value="jet">{t('onboarding.boatForm.jet')}</option>
                    <option value="kayak">{t('onboarding.boatForm.kayak')}</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.volunteerForm.labelSpots')}</label>
                    <input type="number" value={boatSpots} onChange={(e) => setBoatSpots(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white outline-none" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 flex-1 h-[46px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3">
                      <input type="checkbox" checked={boatVests} onChange={(e) => setBoatVests(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-primary" />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{t('onboarding.volunteerForm.labelVests')}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* General Volunteer skills */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 block">{t('onboarding.volunteerForm.skillsTitle')}</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sort', label: t('onboarding.volunteerForm.sort') },
                  { id: 'health', label: t('onboarding.volunteerForm.health') },
                  { id: 'cook', label: t('onboarding.volunteerForm.cook') },
                  { id: 'clean', label: t('onboarding.volunteerForm.clean') },
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-3 active:bg-slate-50 transition-colors cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={skills.includes(item.id)}
                      onChange={() => toggleSkill(item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-primary" 
                    />
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Submit Button fixed bottom */}
      <div className="fixed bottom-0 left-0 w-full px-4 pb-8 pt-4 bg-gradient-to-t from-slate-50 dark:from-[#0a1628] via-slate-50 dark:via-[#0a1628] to-transparent transition-colors">
        <button
          type="submit"
          form="onboardingForm"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white text-lg font-headline transition-all active:scale-[0.97] disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)', boxShadow: '0 8px 24px -6px rgba(21,101,192,0.5)' }}
        >
          {submitting ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>{t('onboarding.submit')}</>
          )}
        </button>
      </div>

      {/* MODAL DE MAPA */}
      {showMapModal && (
        <div className="fixed inset-0 z-[100] bg-surface dark:bg-[#0a1628] flex flex-col">
          <div className="flex flex-col gap-3 p-4 shrink-0 glass-header border-b border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setShowMapModal(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 active:scale-95"
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
              </button>
              <div className="flex-1">
                <p className="text-sm font-bold uppercase tracking-widest text-on-surface dark:text-white">{t('onboarding.volunteerForm.mapTitle')}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter opacity-60">{t('onboarding.volunteerForm.mapDesc')}</p>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setLocationStatus('ready');
                  if (!locationAddress || locationAddress === 'Obtendo localização...') {
                    setLocationAddress(`Lat: ${pickedLoc[0].toFixed(5)}, Lng: ${pickedLoc[1].toFixed(5)}`);
                  }
                  setShowMapModal(false);
                }} 
                className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold uppercase tracking-wider text-xs active:scale-95 transition-transform shadow-md shadow-primary/30"
              >
                {t('onboarding.volunteerForm.mapConfirm')}
              </button>
            </div>
            
            <div className="relative w-full z-10 transition-transform">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <span className="material-symbols-outlined text-primary/70 text-lg">search</span>
              </div>
              <input
                type="text"
                autoFocus
                placeholder={t('onboarding.volunteerForm.mapPlaceholder')}
                value={locationAddress === 'Obtendo localização...' ? '' : locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchAddressForCoords()}
                className="w-full bg-white dark:bg-slate-800 text-sm font-semibold rounded-2xl pl-10 pr-12 py-3.5 outline-none shadow border border-slate-200 dark:border-slate-700/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all dark:text-white placeholder:text-slate-400 font-body"
              />
              <button 
                onClick={searchAddressForCoords}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-primary p-1.5 rounded-xl hover:bg-primary/80 active:scale-95 transition-all shadow-sm shadow-primary/40 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              </button>
            </div>
          </div>

          <div className="flex-1 relative bg-slate-100 dark:bg-slate-900 border-t-2 border-primary/20">
            <MapComponent onUpdateCenter={(center) => { setPickedLoc(center); reverseGeocode(center); }} externalCenter={mapFlyTrigger} />
          </div>
        </div>
      )}
    </main>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#0a1628]" />}>
      <OnboardingContent />
    </Suspense>
  )
}
