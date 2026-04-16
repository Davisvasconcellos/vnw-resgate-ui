interface Props {
  status: 'pending' | 'viewed' | 'attending' | 'resolved'
  size?: 'sm' | 'md'
}

const config = {
  pending: {
    label: 'Pendente',
    bg: 'bg-red-100',
    text: 'text-red-700',
    dot: 'bg-red-500',
    pulse: true,
  },
  viewed: {
    label: 'Visualizado',
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    dot: 'bg-yellow-500',
    pulse: false,
  },
  attending: {
    label: 'Em atendimento',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    pulse: true,
  },
  resolved: {
    label: 'Resolvido',
    bg: 'bg-green-100',
    text: 'text-green-700',
    dot: 'bg-green-500',
    pulse: false,
  },
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const c = config[status]
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs'
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${c.bg} ${c.text} ${textSize} ${padding}`}
    >
      <span className={`relative flex h-2 w-2 shrink-0`}>
        {c.pulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${c.dot} opacity-75`}
          />
        )}
        <span className={`relative h-2 w-2 rounded-full ${c.dot}`} />
      </span>
      {c.label}
    </span>
  )
}
