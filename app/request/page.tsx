'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import LocationIndicator from '@/components/ui/LocationIndicator'
import CameraInput from '@/components/ui/CameraInput'
import { useI18n } from '@/components/i18n/I18nProvider'
import TextInput from '@/components/ui/TextInput'
import AppHeader from '@/components/headers/AppHeader'

type HelpType = 'rescue' | 'shelter' | 'medical' | 'food' | 'transport' | 'boat'

function RequestForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useI18n()

  const TYPES: { value: HelpType; label: string; icon: string; description: string }[] = [
    { value: 'rescue', label: t('request.rescue'), icon: 'sos', description: t('request.rescueDesc') },
    { value: 'shelter', label: t('request.shelter'), icon: 'house', description: t('request.shelterDesc') },
    { value: 'medical', label: t('request.medical'), icon: 'medical_services', description: t('request.medicalDesc') },
    { value: 'food', label: t('request.food'), icon: 'restaurant', description: t('request.foodDesc') },
    { value: 'transport', label: 'Transporte', icon: 'directions_car', description: 'Ajuda com transporte para local seguro' },
    { value: 'boat', label: 'Barco', icon: 'directions_boat', description: 'Resgate ou transporte via água' },
  ]

  const initialType = (searchParams.get('type') as HelpType) ?? 'rescue'

  const [selectedType, setSelectedType] = useState<HelpType>(initialType)
  const [people, setPeople] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [locationStatus, setLocationStatus] = useState<'acquiring' | 'ready' | 'error'>('acquiring')
  const [locationAddress, setLocationAddress] = useState('Obtendo localização...')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Simulate geolocation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationStatus('ready')
      setLocationAddress('R. das Gaivotas, 320 – Canasvieiras, Florianópolis')
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handlePhotoCapture = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoPreview(url)
    } else {
      setPhotoPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
        <div
          className="flex items-center justify-center w-20 h-20 rounded-full mb-6"
          style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', boxShadow: '0 12px 32px -8px rgba(27,94,32,0.5)' }}
        >
          <span className="material-symbols-outlined text-white text-[44px]" style={{ fontVariationSettings: `'FILL' 1` }}>
            check_circle
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 font-headline text-center">{t('request.successTitle')}</h2>
        <p className="text-slate-500 text-center mt-2 leading-relaxed">
          {t('request.successDesc').replace('{type}', TYPES.find(t => t.value === selectedType)?.label || '')}
        </p>
        <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 w-full max-w-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">{t('request.summary')}</p>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>{t('request.type')}</span>
              <span className="font-bold">{TYPES.find(t => t.value === selectedType)?.label}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('request.name')}</span>
              <span className="font-bold">{name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('request.people')}</span>
              <span className="font-bold">{people}</span>
            </div>
            <div className="flex justify-between">
              <span>Local</span>
              <span className="font-bold text-right max-w-[180px] truncate">{locationAddress}</span>
            </div>
          </div>
        </div>
        <Link href="/" className="mt-8 text-blue-600 font-bold text-sm bg-blue-50 px-6 py-3 rounded-xl border border-blue-100">
          {t('request.backHome')}
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface pt-16 pb-[120px]">
      <AppHeader />

      <div className="px-4 pt-8 shrink-0 max-w-2xl mx-auto">
        <section className="mb-8">
          <h1 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight leading-tight">
            {t('request.title')}
          </h1>
          <p className="mt-2 text-on-surface-variant font-body">
            {t('request.noLogin')}
          </p>
        </section>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pt-5 pb-[220px] space-y-6">
        {/* Help type selection - now at top for quick triage */}
        <section>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">{t('request.helpType')}</p>
          <div className="grid grid-cols-2 gap-2.5">
            {TYPES.map((t_item) => (
              <button
                key={t_item.value}
                type="button"
                onClick={() => setSelectedType(t_item.value)}
                className={`flex flex-col items-start gap-2 rounded-2xl p-3.5 border-2 text-left transition-all active:scale-[0.97] ${
                  selectedType === t_item.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[26px] ${selectedType === t_item.value ? 'text-blue-600' : 'text-slate-400'}`}
                  style={{ fontVariationSettings: `'FILL' ${selectedType === t_item.value ? 1 : 0}` }}
                >
                  {t_item.icon}
                </span>
                <div>
                  <p className={`font-bold text-sm font-headline ${selectedType === t_item.value ? 'text-blue-700' : 'text-slate-700'}`}>
                    {t_item.label}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{t_item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Location */}
        <section>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">{t('request.location')}</p>
          <LocationIndicator status={locationStatus} address={locationAddress} />
        </section>

        {/* Photo */}
        <section>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
            {t('request.photo')} <span className="opacity-60">{t('request.photoDesc')}</span>
          </p>
          <CameraInput onCapture={handlePhotoCapture} preview={photoPreview} />
        </section>

        {/* Contact info form */}
        <section className="bg-surface-container-lowest rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
              <span className="material-symbols-outlined text-[22px]">contact_phone</span>
            </div>
            <p className="text-sm font-extrabold text-on-surface uppercase tracking-widest">{t('request.contactInfo')}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">{t('request.name')}</p>
              <TextInput 
                placeholder="Ex: João Silva" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-surface-container-low border-none rounded-2xl"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant mb-1.5 ml-1 uppercase tracking-wider">{t('request.phone')}</p>
              <TextInput 
                placeholder="(00) 00000-0000" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                type="tel"
                className="bg-surface-container-low border-none rounded-2xl"
              />
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
            <p className="text-[11px] text-on-primary-fixed-variant leading-relaxed font-medium">
              {t('request.verifiedTip')}
            </p>
          </div>
        </section>

        {/* People count */}
        <section className="bg-surface-container-lowest rounded-[2rem] p-6 border border-outline-variant/10 shadow-sm">
          <p className="text-sm font-extrabold text-on-surface uppercase tracking-widest mb-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary border border-secondary/10">
              <span className="material-symbols-outlined text-[22px]">diversity_3</span>
            </div>
            {t('request.peopleCount')}
          </p>
          <div className="flex items-center gap-4 bg-surface-container-low rounded-3xl p-3 border border-outline-variant/5">
            <button
              type="button"
              onClick={() => setPeople(Math.max(1, people - 1))}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-on-surface text-2xl font-bold active:scale-95 transition-all shadow-sm border border-outline-variant/10"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <div className="flex-1 text-center">
              <span className="text-5xl font-extrabold text-on-surface font-headline leading-none block">{people}</span>
              <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-widest mt-2">{people === 1 ? t('request.person') : t('request.people')}</p>
            </div>
            <button
              type="button"
              onClick={() => setPeople(Math.min(99, people + 1))}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-on-primary text-2xl font-bold active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </section>
      </form>

      {/* Fixed submit button - positioned higher to clear bottom nav */}
      <div className="fixed bottom-24 left-0 w-full px-4 pt-16 pb-2 bg-gradient-to-t from-surface via-surface/80 to-transparent pointer-events-none z-50">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <button
            type="submit"
            disabled={submitting}
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-4 rounded-[2rem] py-5 font-bold text-on-primary text-xl font-headline transition-all active:scale-[0.97] disabled:opacity-60 shadow-2xl shadow-error/30"
            style={{ background: 'linear-gradient(135deg, #ba1a1a, #ff5449)' }}
          >
            {submitting ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: `'FILL' 1` }}>send</span>
            )}
            <span className="tracking-tight">{submitting ? t('request.submitting') : t('request.submit')}</span>
          </button>
        </div>
      </div>
    </main>
  )
}

export default function RequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" /></div>}>
      <RequestForm />
    </Suspense>
  )
}
