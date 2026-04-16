interface Props {
  current: number
  total: number
  showLabel?: boolean
}

function getColor(percentage: number) {
  if (percentage >= 90) return { bar: 'bg-red-500', label: 'text-red-600', bg: 'bg-red-100', text: 'Lotado' }
  if (percentage >= 70) return { bar: 'bg-orange-400', label: 'text-orange-600', bg: 'bg-orange-100', text: 'Quase cheio' }
  return { bar: 'bg-emerald-500', label: 'text-emerald-600', bg: 'bg-emerald-100', text: 'Disponível' }
}

export default function CapacityBar({ current, total, showLabel = true }: Props) {
  const pct = Math.min(100, Math.round((current / total) * 100))
  const color = getColor(pct)

  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-500">
            {current} / {total} vagas
          </span>
          <span className={`px-2 py-0.5 rounded-full ${color.bg} ${color.label}`}>
            {color.text}
          </span>
        </div>
      )}
      <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
