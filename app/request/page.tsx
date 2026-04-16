'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import LocationIndicator from '@/components/ui/LocationIndicator'
import CameraInput from '@/components/ui/CameraInput'
import { useI18n } from '@/components/i18n/I18nProvider'
import TextInput from '@/components/ui/TextInput'

type HelpType = 'rescue' | 'shelter' | 'medical' | 'food'

function RequestForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useI18n()

  const TYPES: { value: HelpType; label: string; icon: string; description: string }[] = [
    { value: 'rescue', label: t('request.rescue'), icon: 'sos', description: t('request.rescueDesc') },
    { value: 'shelter', label: t('request.shelter'), icon: 'house', description: t('request.shelterDesc') },
    { value: 'medical', label: t('request.medical'), icon: 'medical_services', description: t('request.medicalDesc') },
    { value: 'food', label: t('request.food'), icon: 'restaurant', description: t('request.foodDesc') },
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
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/help" className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800 font-headline">{t('request.title')}</h1>
            <p className="text-xs text-slate-400">{t('request.noLogin')}</p>
          </div>
        </div>
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
        <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-blue-600 text-[20px]">contact_phone</span>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400 leading-none">{t('request.contactInfo')}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold text-slate-400 mb-1.5 ml-1 uppercase">{t('request.name')}</p>
              <TextInput 
                placeholder="Ex: João Silva" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 mb-1.5 ml-1 uppercase">{t('request.phone')}</p>
              <TextInput 
                placeholder="(00) 00000-0000" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                type="tel"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="material-symbols-outlined text-blue-500 text-[18px]">verified_user</span>
            <p className="text-[10px] text-slate-500 leading-tight">
              {t('request.verifiedTip')}
            </p>
          </div>
        </section>

        {/* People count */}
        <section>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">{t('request.peopleCount')}</p>
          <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => setPeople(Math.max(1, people - 1))}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-600 text-2xl font-bold active:scale-95 transition-transform shadow-inner"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <span className="text-5xl font-bold text-slate-800 font-headline leading-none">{people}</span>
              <p className="text-[10px] font-bold uppercase text-slate-400 mt-1">{people === 1 ? t('request.person') : t('request.people')}</p>
            </div>
            <button
              type="button"
              onClick={() => setPeople(Math.min(99, people + 1))}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-600 text-2xl font-bold active:scale-95 transition-transform shadow-inner"
            >
              +
            </button>
          </div>
        </section>
      </form>

      {/* Fixed submit button with improved spacing to avoid overlapping cards */}
      <div className="fixed bottom-0 left-0 w-full px-4 pt-12 pb-8 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pointer-events-none z-50">
        <div className="h-4 bg-gradient-to-t from-slate-50 to-transparent mb-2" />
        <button
          type="submit"
          disabled={submitting}
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-3 rounded-2xl py-5 font-bold text-white text-xl font-headline transition-all active:scale-[0.97] disabled:opacity-60 pointer-events-auto shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #C62828, #E53935)', boxShadow: '0 8px 32px -8px rgba(198,40,40,0.6)' }}
        >
          {submitting ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: `'FILL' 1` }}>send</span>
          )}
          {submitting ? t('request.submitting') : t('request.submit')}
        </button>
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
