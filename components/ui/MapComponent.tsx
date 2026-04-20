'use client'

import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { HELP_TYPE_LABELS } from '@/app/mock-data'

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

// Function to create glowing HTML markers matching the radar's
const createCustomMarker = (color: string, isSelected: boolean, icon: string, isBlinking = false) => {
  return L.divIcon({
    html: `
      <div style="position: relative; width: 36px; height: 36px; transform: translate(-18px, -36px);">
        <div style="
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 50%;
          background: ${color}; border: 2px solid ${isSelected ? 'white' : 'rgba(255,255,255,0.5)'};
          box-shadow: 0 4px 12px ${color}99;
          transition: transform 0.2s;
          transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'};
        ">
          <span class="material-symbols-outlined" style="color: white; font-size: 16px; font-variation-settings: 'FILL' 1">${icon}</span>
        </div>
        ${isBlinking ? `<div style="position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; border-radius: 50%; background: ${color}; animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;"></div>` : ''}
        <div style="width: 6px; height: 6px; border-radius: 50%; background: ${color}; margin: 2px auto 0;"></div>
      </div>
    `,
    className: '',
    iconSize: [0, 0], // CSS handles positioning
  })
}

// Custom Zoom and Expand controls overlay
function MapControls({ isExpanded, onToggleExpand }: { isExpanded?: boolean, onToggleExpand?: () => void }) {
  const map = useMap()
  
  // Força o mapa a se readequar sempre que a altura (isExpanded) for alterada
  useEffect(() => {
    const wait = setTimeout(() => map.invalidateSize(), 350)
    return () => clearTimeout(wait)
  }, [map, isExpanded])

  return (
    <div className="absolute right-3 top-4 flex flex-col gap-2" style={{ zIndex: 400 }}>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); map.zoomIn() }}
        className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-slate-200 dark:border-white/10 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-slate-700 dark:text-white">add</span>
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); map.zoomOut() }}
        className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-slate-200 dark:border-white/10 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-slate-700 dark:text-white">remove</span>
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleExpand?.() }}
        className="w-10 h-10 bg-blue-600/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.4)] border border-blue-400/30 active:scale-95 transition-all mt-1"
      >
        <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: `'FILL' 1` }}>
          {isExpanded ? 'close_fullscreen' : 'open_in_full'}
        </span>
      </button>
    </div>
  )
}

function MapTracker({ setCurrentCenter, onUpdateCenter }: { setCurrentCenter: (c: [number, number]) => void, onUpdateCenter?: (c: [number, number]) => void }) {
  useMapEvents({
    move: (e) => {
      const c = e.target.getCenter()
      setCurrentCenter([c.lat, c.lng])
    },
    moveend: (e) => {
      const c = e.target.getCenter()
      if (onUpdateCenter) onUpdateCenter([c.lat, c.lng])
    }
  })
  return null
}

function MapFlyTo({ center }: { center: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    if (center && center[0] !== 0) {
      const current = map.getCenter();
      const dist = Math.sqrt(Math.pow(current.lat - center[0], 2) + Math.pow(current.lng - center[1], 2));
      
      // Só voa (flyTo) se a distância for significativa (> ~100m)
      if (dist > 0.001) {
        map.flyTo(center, 15, { duration: 1.5 });
      } else if (dist > 0.00001) {
        // Se for uma correção mínima, apenas centraliza suavemente sem resetar o ZOOM do usuário
        map.panTo(center);
      }
    }
  }, [center, map])
  return null
}

export default function MapComponent({ 
  shelters = [],
  requests = [],
  tab = 'shelters',
  radius = 5,
  selectedPin = null,
  onPinClick,
  onUpdateCenter,
  isExpanded,
  onToggleExpand,
  externalCenter = null
}: {
  shelters?: any[]
  requests?: any[]
  tab?: 'shelters' | 'requests'
  radius?: number
  selectedPin?: string | null
  onPinClick?: (id: string) => void
  onUpdateCenter?: (center: [number, number]) => void
  isExpanded?: boolean
  onToggleExpand?: () => void
  externalCenter?: [number, number] | null
}) {
  const [isDark, setIsDark] = useState(false)
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(externalCenter || [-27.4332, -48.4550])
  const [mapStableKey] = useState(`map-${Date.now()}-${Math.random()}`)

  useEffect(() => {
    // Initial check
    setIsDark(document.documentElement.classList.contains('dark'))
    
    // Listen for class changes on html
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    // Injecting standard leaflet css since the import might fail in some Next.js app constraints
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    
    // Remove .leaflet-control-zoom { display: none !important; } so controls are visible
    const style = document.createElement('style')
    style.innerHTML = `
      .leaflet-control-attribution { display: none !important; }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .3; }
      }
    `
    document.head.appendChild(style)
  }, [])

  const center: [number, number] = [-27.4332, -48.4550] // Canasvieiras center mocked approx

  return (
    <MapContainer key={mapStableKey} center={currentCenter} zoom={15} style={{ height: '100%', width: '100%', zIndex: 1 }} zoomControl={false}>
      {externalCenter && <MapFlyTo center={externalCenter} />}
      <MapTracker setCurrentCenter={setCurrentCenter} onUpdateCenter={onUpdateCenter} />
      <MapControls isExpanded={isExpanded} onToggleExpand={onToggleExpand} />
      <TileLayer
        key={isDark ? 'dark' : 'light'}
        url={isDark ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}
      />
      {/* Mira alvo atualizada em tempo real! */}
      <Circle center={currentCenter} radius={radius * 1000} pathOptions={{ color: 'rgba(21,101,192,0.6)', fillColor: 'rgba(21,101,192,0.06)', weight: 2 }} />

      {/* Crosshair do centro puro visível como pontinho fixo */}
      <Marker
        position={currentCenter}
        icon={L.divIcon({
          html: `<div style="width:10px; height:10px; background:#1565C0; border:2px solid white; border-radius:50%; transform:translate(-5px,-5px); box-shadow:0 0 10px rgba(0,0,0,0.5);"></div>`,
          className: '',
          iconSize: [0, 0]
        })}
      />

      {/* User Location marker */}
      <Marker
        position={externalCenter || [-27.4332, -48.4550]}
        icon={L.divIcon({
          html: `
          <div style="position:relative; width:32px; height:32px; transform: translate(-16px, -16px)">
            <div style="position:absolute; inset:0; border-radius:50%; background: rgba(144,202,249,0.2); animation: pulse 2s infinite;"></div>
            <div style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#1565C0; border:2px solid white; border-radius:50%; box-shadow:0 4px 16px rgba(21,101,192,0.7);">
              <span class="material-symbols-outlined" style="color:white; font-size:16px;">my_location</span>
            </div>
          </div>`,
          className: '',
          iconSize: [0, 0]
        })}
      />

      {tab === 'shelters' && shelters.map(s => {
        const pct = Math.round((s.occupied / s.capacity) * 100)
        return (
          <Marker
            key={s.id}
            position={[s.lat || -27.4332, s.lng || -48.4550]}
            icon={createCustomMarker(getShelterPinColor(pct), selectedPin === s.id, 'house')}
            eventHandlers={{ click: () => onPinClick?.(s.id) }}
          />
        )
      })}

      {tab === 'requests' && requests.map(r => {
        return (
          <Marker
            key={r.id}
            position={[r.lat || -27.4332, r.lng || -48.4550]}
            icon={createCustomMarker(getRequestPinColor(r.urgency), selectedPin === r.id, HELP_TYPE_LABELS[r.type as keyof typeof HELP_TYPE_LABELS]?.icon || 'help', r.urgency === 'high')}
            eventHandlers={{ click: () => onPinClick?.(r.id) }}
          />
        )
      })}
    </MapContainer>
  )
}
