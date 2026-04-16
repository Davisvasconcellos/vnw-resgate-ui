'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'

function OnboardingContent() {
  const { t } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const offer = (searchParams.get('offer') ?? 'volunteer') as 'shelter' | 'transport' | 'boat' | 'volunteer'

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Salva o papel no localStorage para a navegação
    localStorage.setItem('vnw_role', offer)

    setTimeout(() => {
      // Redireciona para gestão de abrigo ou para o mapa (nearby) baseado no tipo
      if (offer === 'shelter') {
        router.push('/shelter/manage')
      } else if (offer === 'transport' || offer === 'boat') {
        router.push('/nearby')
      } else {
        router.push('/dashboard')
      }
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 pt-12 pb-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/assist" className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800 font-headline">
              {t(`onboarding.titles.${offer}`)}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{t(`onboarding.descs.${offer}`)}</p>
          </div>
        </div>
      </div>

      {/* Forms */}
      <form onSubmit={handleSubmit} className="flex-1 px-4 pt-6 pb-32 space-y-6">
        
        {/* SHELTER FORM */}
        {offer === 'shelter' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.shelterForm.name')}</label>
              <input required type="text" placeholder={t('onboarding.shelterForm.namePlace')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.shelterForm.address')}</label>
              <input required type="text" placeholder={t('onboarding.shelterForm.addressPlace')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
              <button type="button" className="flex items-center gap-1.5 mt-2 text-blue-600 text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">my_location</span> {t('onboarding.shelterForm.useLocation')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.shelterForm.capacity')}</label>
                <input required type="number" placeholder={t('onboarding.shelterForm.capacityPlace')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
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
                  <label key={item.id} className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-3 active:bg-slate-50 transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRANSPORT FORM */}
        {offer === 'transport' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.transportForm.type')}</label>
              <select required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all appearance-none">
                <option value="">{t('onboarding.transportForm.select')}</option>
                <option value="car">{t('onboarding.transportForm.car')}</option>
                <option value="pickup">{t('onboarding.transportForm.pickup')}</option>
                <option value="van">{t('onboarding.transportForm.van')}</option>
                <option value="bus">{t('onboarding.transportForm.bus')}</option>
                <option value="truck">{t('onboarding.transportForm.truck')}</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.transportForm.seats')}</label>
                <input required type="number" placeholder="Ex: 4" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.transportForm.region')}</label>
              <input required type="text" placeholder={t('onboarding.transportForm.regionPlace')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
            </div>
            <label className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 mt-2">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <div>
                <p className="text-sm font-bold text-slate-800">{t('onboarding.transportForm.offroad')}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{t('onboarding.transportForm.offroadDesc')}</p>
              </div>
            </label>
          </div>
        )}

        {/* BOAT FORM */}
        {offer === 'boat' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.boatForm.type')}</label>
              <select required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all appearance-none">
                <option value="">{t('onboarding.transportForm.select')}</option>
                <option value="motor">{t('onboarding.boatForm.motor')}</option>
                <option value="jet">{t('onboarding.boatForm.jet')}</option>
                <option value="row">{t('onboarding.boatForm.row')}</option>
                <option value="kayak">{t('onboarding.boatForm.kayak')}</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.boatForm.spots')}</label>
                <input required type="number" placeholder="Ex: 5" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.boatForm.region')}</label>
              <input required type="text" placeholder={t('onboarding.boatForm.regionPlace')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
            </div>
            <label className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 mt-2">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <div>
                <p className="text-sm font-bold text-slate-800">{t('onboarding.boatForm.vests')}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{t('onboarding.boatForm.vestsDesc')}</p>
              </div>
            </label>
          </div>
        )}

        {/* VOLUNTEER FORM */}
        {offer === 'volunteer' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 block">{t('onboarding.volunteerForm.action')}</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'sort', label: t('onboarding.volunteerForm.sort') },
                  { id: 'clean', label: t('onboarding.volunteerForm.clean') },
                  { id: 'health', label: t('onboarding.volunteerForm.health') },
                  { id: 'rescue', label: t('onboarding.volunteerForm.rescue') },
                  { id: 'cook', label: t('onboarding.volunteerForm.cook') },
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-3 active:bg-slate-50 transition-colors">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.volunteerForm.availability')}</label>
              <select required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all appearance-none">
                <option value="">{t('onboarding.transportForm.select')}</option>
                <option value="full">{t('onboarding.volunteerForm.full')}</option>
                <option value="morning">{t('onboarding.volunteerForm.morning')}</option>
                <option value="afternoon">{t('onboarding.volunteerForm.afternoon')}</option>
                <option value="night">{t('onboarding.volunteerForm.night')}</option>
              </select>
            </div>
          </div>
        )}
      </form>

      {/* Submit Button fixed bottom */}
      <div className="fixed bottom-0 left-0 w-full px-4 pb-8 pt-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
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
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <OnboardingContent />
    </Suspense>
  )
}
