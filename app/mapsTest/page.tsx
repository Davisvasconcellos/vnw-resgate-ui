'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentPosition, getIPLocation, checkPermissions } from '@/services/geolocation'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), { ssr: false })

import { useI18n } from '@/components/i18n/I18nProvider'

export default function MapsTestPage() {
  const { t } = useI18n()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [method, setMethod] = useState<'GPS' | 'IP' | 'None'>('None')
  const [location, setLocation] = useState<{ lat: number; lng: number; city?: string; region?: string } | null>(null)
  const [errorDetail, setErrorDetail] = useState<string>('')
  const [permissionState, setPermissionState] = useState<string>('checking...')
  const [isClient, setIsClient] = useState(false)

  const startTest = async () => {
    setStatus('loading')
    setErrorDetail('')
    setMethod('None')
    
    try {
      // 1. Tentar GPS real primeiro
      console.log('Tentando GPS...')
      const pos = await getCurrentPosition({ timeout: 5000 })
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      setMethod('GPS')
      setStatus('success')
    } catch (gpsError: any) {
      console.warn('GPS Falhou, tentando IP...', gpsError)
      setErrorDetail(`GPS Error: ${gpsError.message || 'Unknown'}. Tentando IP...`)
      
      try {
        // 2. Fallback para IP
        const ipPos = await getIPLocation()
        setLocation({ lat: ipPos.coords.latitude, lng: ipPos.coords.longitude })
        setMethod('IP')
        setStatus('success')
      } catch (ipError: any) {
        console.error('IP Falhou também', ipError)
        setErrorDetail(prev => `${prev} | IP Error: ${ipError.message}`)
        setStatus('error')
      }
    }
  }

  useEffect(() => {
    setIsClient(true)
    checkPermissions().then(setPermissionState)
    startTest()
  }, [])

  return (
    <main className="min-h-screen bg-[#0a1628] text-white flex flex-col items-center p-6 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <header className="flex items-center justify-between mb-8">
           <Link href="/" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
           </Link>
           <h1 className="text-xl font-black uppercase tracking-[0.2em] text-blue-400">Geolocation Lab</h1>
           <div className="w-10" />
        </header>

        <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl mb-6 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-6">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : status === 'loading' ? 'bg-blue-500/20 text-blue-400 animate-pulse' : 'bg-red-500/20 text-red-400'}`}>
                 <span className={`w-1.5 h-1.5 rounded-full ${status === 'success' ? 'bg-emerald-500' : 'bg-current'} animate-pulse`} />
                 {status}
              </div>
           </div>

           <div className="space-y-6">
              <div>
                 <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Método Ativo</p>
                 <h2 className="text-4xl font-black text-white tracking-tighter">
                   {method === 'GPS' ? 'HARDWARE GPS' : method === 'IP' ? 'GEO-IP FALLBACK' : 'BUSCANDO...'}
                 </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Latitude</p>
                    <p className="text-xl font-mono font-bold text-blue-400">{location?.lat?.toFixed(6) || '---'}</p>
                 </div>
                 <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Longitude</p>
                    <p className="text-xl font-mono font-bold text-emerald-400">{location?.lng?.toFixed(6) || '---'}</p>
                 </div>
              </div>

              <div className="flex flex-col gap-2">
                 <div className="flex justify-between items-center text-[11px] font-bold py-2 border-b border-white/5">
                    <span className="text-white/40 uppercase tracking-widest">Permissão Browser</span>
                    <span className="text-white uppercase">{permissionState}</span>
                 </div>
                 <div className="flex justify-between items-center text-[11px] font-bold py-2 border-b border-white/5">
                    <span className="text-white/40 uppercase tracking-widest">Contexto Seguro (HTTPS)</span>
                    <span className={isClient && window.isSecureContext ? 'text-emerald-400' : 'text-red-400 italic'}>
                       {!isClient ? '---' : window.isSecureContext ? 'SIM' : 'NÃO (Restringe GPS)'}
                    </span>
                 </div>
              </div>

              {errorDetail && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                   <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Log de Diagnóstico</p>
                   <p className="text-[11px] text-red-300/70 font-medium italic break-words">{errorDetail}</p>
                </div>
              )}

              <button 
                onClick={startTest}
                disabled={status === 'loading'}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Processando Localização...' : 'Reiniciar Teste de Precisão'}
              </button>
           </div>
        </section>

        {/* Map Preview */}
        <section className="bg-white/5 rounded-[2.5rem] h-64 overflow-hidden border border-white/10 shadow-xl relative">
           {location ? (
             <MapComponent onUpdateCenter={() => {}} externalCenter={[location.lat, location.lng]} />
           ) : (
             <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                <span className="material-symbols-outlined text-[48px] animate-bounce">map</span>
                <p className="text-[10px] font-black uppercase tracking-widest mt-2">{t('nearbyPage.gettingLocation')}</p>
             </div>
           )}
           <div className="absolute top-4 left-4 z-[100] px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest">Live Preview</p>
           </div>
        </section>

        <footer className="mt-8 text-center px-8">
           <p className="text-[10px] text-white/20 font-medium leading-relaxed uppercase tracking-widest">
             Este laboratório testa a redundância entre sensores de hardware e localização baseada em rede (IP). 
             A precisão do IP pode variar entre 1km a 50km.
           </p>
        </footer>
      </div>
    </main>
  )
}
