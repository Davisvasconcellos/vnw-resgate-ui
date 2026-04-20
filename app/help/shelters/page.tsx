'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CapacityBar from '@/components/ui/CapacityBar'
import { useI18n } from '@/components/i18n/I18nProvider'
import { api } from '@/services/api'
import { getCurrentPosition, checkPermissions } from '@/services/geolocation'

export default function SheltersPage() {
  const { t } = useI18n()
  const [shelters, setShelters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const acquireLocation = async () => {
      if (typeof window !== 'undefined' && !window.isSecureContext) {
        fetchShelters();
        return;
      }

      try {
        const pos = await getCurrentPosition({
          enableHighAccuracy: false, // Menos exigente para listagem geral
          timeout: 8000,
          maximumAge: 60000
        });

        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      } catch (err) {
        fetchShelters();
      }
    };

    acquireLocation();
  }, []);

  useEffect(() => {
    if (coords) {
      fetchShelters(coords.lat, coords.lng)
    }
  }, [coords])

  const fetchShelters = async (lat?: number, lng?: number) => {
    setLoading(true)
    try {
      const params: any = { radiusKm: 100 } // Raio maior para encontrar algo se houver poucos dados
      if (lat && lng) {
        params.lat = lat
        params.lng = lng
      }
      
      const res = await api.get('/shelters', { params })
      if (res.data.success) {
        setShelters(res.data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar abrigos:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a1628] pb-24 transition-colors">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white/90 dark:bg-[#0a1628]/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/10 transition-colors">
        <div className="flex items-center gap-3 px-4 py-4">
          <Link
            href="/help?module=help"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800 dark:text-white font-headline">{t('shelters.title')}</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t('shelters.found').replace('{count}', shelters.length.toString())}
            </p>
          </div>
        </div>

        {/* Fixed action button */}
        <div className="px-4 pb-3">
          <Link href="/request?type=shelter&module=help">
            <div
              className="flex items-center justify-center gap-2 rounded-2xl py-3.5 font-bold text-white font-headline active:scale-[0.98] transition-all"
              style={{ background: 'linear-gradient(135deg, #1565C0, #1E88E5)', boxShadow: '0 6px 18px -4px rgba(21,101,192,0.4)' }}
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: `'FILL' 1` }}>sos</span>
              {t('shelters.requestBtn')}
            </div>
          </Link>
        </div>
      </div>

      {/* Shelter list */}
      <div className="px-4 pt-4 pb-8 space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">{t('shelters.loading')}</p>
          </div>
        ) : shelters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
             <span className="material-symbols-outlined text-[48px] text-slate-200 mb-4 font-variation-fill">holiday_village</span>
             <p className="text-sm font-bold text-slate-400">{t('shelters.empty')}</p>
          </div>
        ) : (
          shelters.map((shelter) => {
            const pct = Math.round((shelter.occupied / (shelter.capacity || 1)) * 100)
            const isFull = pct >= 90
            const distanceKm = shelter.distance ? parseFloat(shelter.distance).toFixed(1) : null

            return (
              <div
                key={shelter.id_code}
                className={`rounded-2xl bg-white dark:bg-white/5 p-4 shadow-sm border transition-all ${isFull ? 'opacity-75 border-red-100 dark:border-red-900/30' : 'border-transparent dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'}`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-slate-800 dark:text-white font-headline text-base leading-snug">
                      {shelter.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {shelter.reference || t('shelters.noReference')}
                    </p>
                  </div>
                  {distanceKm && (
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                        {t('shelters.distance').replace('{km}', distanceKm)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Capacity bar */}
                <CapacityBar current={shelter.occupied} total={shelter.capacity || 100} />

                {/* Address + Phone */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate flex-1 leading-tight">
                    {shelter.address || t('shelters.noAddress')}
                  </p>
                  {shelter.phone && (
                    <a
                      href={`tel:${shelter.phone}`}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-xl px-3 py-1.5 ml-3 shrink-0 active:scale-95 transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      {t('shelters.call')}
                    </a>
                  )}
                </div>

                {isFull && (
                  <div className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-[11px] font-bold text-red-600 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: `'FILL' 1` }}>block</span>
                    {t('shelters.full')}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}
