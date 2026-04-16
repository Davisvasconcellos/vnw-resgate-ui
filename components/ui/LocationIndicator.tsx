'use client'

interface Props {
  address?: string
  status?: 'acquiring' | 'ready' | 'error'
}

export default function LocationIndicator({
  address = 'Obtendo localização...',
  status = 'acquiring',
}: Props) {
  const colors = {
    acquiring: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    ready: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    error: 'bg-red-50 border-red-200 text-red-700',
  }

  const icons = {
    acquiring: 'my_location',
    ready: 'location_on',
    error: 'location_off',
  }

  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${colors[status]}`}>
      <span className={`material-symbols-outlined text-[22px]`} style={{ fontVariationSettings: `'FILL' 1` }}>
        {icons[status]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Sua localização</p>
        <p className="text-sm font-semibold truncate">{address}</p>
      </div>
      {status === 'acquiring' && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
    </div>
  )
}
