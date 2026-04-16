'use client'

import dynamic from 'next/dynamic'

// Leaflet relies heavily on standard DOM APIs, so we must disable SSR.
const InteractiveMap = dynamic<any>(
  () => import('@/components/ui/MapComponent'),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
        <p className="text-slate-400 font-bold text-sm">Carregando mapa...</p>
      </div>
    ) 
  }
)

export default InteractiveMap
