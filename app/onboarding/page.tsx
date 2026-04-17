'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials, UserRole } from '@/store/slices/authSlice'
import { RootState } from '@/store'
import { api } from '@/services/api'

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

  const toggleSkill = (id: string) => {
    setSkills(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (offer === 'shelter') {
        // ... Shelters logic (mantida)
        const payload = {
          name: (e.target as any).elements[0].value,
          address: (e.target as any).elements[1].value,
          capacity: Number((e.target as any).elements[2].value),
          lat: -27.4332,
          lng: -48.4550
        }
        await api.post('/shelters', payload)
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
    } catch (error) {
      console.warn('Fallback: Redirecionando mesmo com erro de persistência em ambiente dev')
      router.push('/assist')
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
              {offer === 'volunteer' ? 'Sou Voluntário' : t(`onboarding.titles.${offer}`)}
            </h1>
            <p className="mt-1.5 text-slate-500 dark:text-slate-400 font-body text-base font-medium">
              {offer === 'volunteer' ? 'Marque as categorias que você possui recursos para ajudar.' : t(`onboarding.descs.${offer}`)}
            </p>
          </div>
        </section>
      </div>

      {/* Forms */}
      <form onSubmit={handleSubmit} className="flex-1 px-4 pt-6 pb-32 space-y-6">
        
        {/* SHELTER FORM */}
        {offer === 'shelter' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 block">{t('onboarding.shelterForm.name')}</label>
              <input required type="text" placeholder={t('onboarding.shelterForm.namePlace')} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 block">{t('onboarding.shelterForm.address')}</label>
              <input required type="text" placeholder={t('onboarding.shelterForm.addressPlace')} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-all" />
              <button type="button" className="flex items-center gap-1.5 mt-2 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">my_location</span> {t('onboarding.shelterForm.useLocation')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1.5 block">{t('onboarding.shelterForm.capacity')}</label>
                <input required type="number" placeholder={t('onboarding.shelterForm.capacityPlace')} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-500 transition-all" />
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
                <span className="text-xs font-bold uppercase">Tenho Carro</span>
              </button>
              <button 
                type="button"
                onClick={() => setHasBoat(!hasBoat)}
                className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${hasBoat ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 text-slate-400'}`}
              >
                <span className="material-symbols-outlined text-3xl">directions_boat</span>
                <span className="text-xs font-bold uppercase">Tenho Barco</span>
              </button>
            </div>

            {/* Car Sub-form */}
            {hasCar && (
              <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded-[2rem] p-6 border border-orange-100 dark:border-orange-900/30 space-y-4 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 mb-2">
                  <span className="material-symbols-outlined">settings_suggest</span>
                  <p className="font-bold text-sm uppercase tracking-wider">Dados do Veículo</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Tipo de Veículo</label>
                  <select value={carType} onChange={(e) => setCarType(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white outline-none">
                    <option value="car">Carro comum</option>
                    <option value="pickup">Picape / SUV</option>
                    <option value="truck">Caminhão</option>
                    <option value="van">Van / Micro-ônibus</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Vagas</label>
                    <input type="number" value={carSeats} onChange={(e) => setCarSeats(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-semibold" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 flex-1 h-[46px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 group">
                      <input type="checkbox" checked={carOffroad} onChange={(e) => setCarOffroad(e.target.checked)} className="w-4 h-4 rounded border-slate-300" />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">4x4 / Offroad</span>
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
                  <p className="font-bold text-sm uppercase tracking-wider">Dados da Embarcação</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Tipo</label>
                  <select value={boatType} onChange={(e) => setBoatType(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white outline-none">
                    <option value="motor">Barco a Motor</option>
                    <option value="jet">Jet Ski</option>
                    <option value="kayak">Caiaque / Canoa</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Capacidade</label>
                    <input type="number" value={boatSpots} onChange={(e) => setBoatSpots(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-semibold" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 flex-1 h-[46px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3">
                      <input type="checkbox" checked={boatVests} onChange={(e) => setBoatVests(e.target.checked)} className="w-4 h-4 rounded border-slate-300" />
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Tem Coletes</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* General Volunteer skills */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 block">Outras habilidades</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sort', label: 'Triagem / Doação' },
                  { id: 'health', label: 'Saúde / Médica' },
                  { id: 'cook', label: 'Cozinha / Alimentos' },
                  { id: 'clean', label: 'Limpeza / Pesada' },
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
          onClick={handleSubmit}
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
