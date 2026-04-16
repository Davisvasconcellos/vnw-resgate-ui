import Link from 'next/link'

const ASSIST_TYPES = [
  {
    value: 'shelter',
    label: 'Abrigo',
    icon: 'house',
    description: 'Tenho espaço em casa para acolher pessoas',
    color: '#1565C0',
    bg: 'rgba(21,101,192,0.1)',
    border: 'rgba(21,101,192,0.2)',
  },
  {
    value: 'transport',
    label: 'Transporte',
    icon: 'directions_car',
    description: 'Posso transportar pessoas para abrigos ou locais seguros',
    color: '#E65100',
    bg: 'rgba(230,81,0,0.1)',
    border: 'rgba(230,81,0,0.2)',
  },
  {
    value: 'boat',
    label: 'Barco / Lancha',
    icon: 'directions_boat',
    description: 'Tenho embarcação para resgatar pessoas em áreas alagadas',
    color: '#0277BD',
    bg: 'rgba(2,119,189,0.1)',
    border: 'rgba(2,119,189,0.2)',
  },
  {
    value: 'volunteer',
    label: 'Voluntário',
    icon: 'volunteer_activism',
    description: 'Quero ajudar como voluntário em abrigos ou no campo',
    color: '#2E7D32',
    bg: 'rgba(46,125,50,0.1)',
    border: 'rgba(46,125,50,0.2)',
  },
]

export default function AssistPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-800 font-headline">Posso ajudar</h1>
            <p className="text-xs text-slate-400">Selecione como você pode contribuir</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 pb-8">
        {/* Intro */}
        <div className="rounded-2xl bg-blue-50 border border-blue-200 px-4 py-3 flex items-start gap-2.5 mb-5">
          <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: `'FILL' 1` }}>info</span>
          <p className="text-blue-700 text-xs leading-snug font-medium">
            Voluntários precisam fazer login para acessar o dashboard de pedidos e dar início ao atendimento.
          </p>
        </div>

        {/* Type options */}
        <div className="grid grid-cols-2 gap-3">
          {ASSIST_TYPES.map((type) => (
            <Link key={type.value} href={`/login?role=volunteer&offer=${type.value}`}>
              <div
                className="flex flex-col items-start gap-3 rounded-2xl p-4 active:scale-[0.97] transition-transform min-h-[140px]"
                style={{ background: type.bg, border: `1.5px solid ${type.border}` }}
              >
                <div className="flex items-start justify-between w-full">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
                    style={{ background: type.bg, border: `1.5px solid ${type.border}` }}
                  >
                    <span
                      className="material-symbols-outlined text-[24px]"
                      style={{ color: type.color, fontVariationSettings: `'FILL' 1` }}
                    >
                      {type.icon}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 font-headline text-sm leading-tight">{type.label}</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{type.description}</p>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Missing Persons Banner */}
        <Link 
          href="/missing" 
          className="mt-4 flex items-center gap-4 p-5 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-3xl shadow-lg active:scale-[0.98] transition-all w-full text-left overflow-hidden relative"
        >
          <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] text-white/5" style={{ fontVariationSettings: `'FILL' 1` }}>person_search</span>
          <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex flex-col items-center justify-center shrink-0 border border-white/20">
            <span className="material-symbols-outlined text-[24px]">person_search</span>
          </div>
          <div className="flex-1 relative z-10">
            <h3 className="text-base font-bold text-white font-headline">Pessoas Desaparecidas</h3>
            <p className="text-xs text-slate-300 mt-0.5">Consulte ou informe familiares e perdidos</p>
          </div>
          <span className="material-symbols-outlined text-slate-400 relative z-10">chevron_right</span>
        </Link>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Voluntários ativos', value: '128', icon: 'people' },
            { label: 'Pedidos em aberto', value: '43', icon: 'pending' },
            { label: 'Atendidos hoje', value: '89', icon: 'check_circle' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-3 shadow-sm border border-slate-100 text-center">
              <span className="material-symbols-outlined text-blue-500 text-[22px]" style={{ fontVariationSettings: `'FILL' 1` }}>
                {stat.icon}
              </span>
              <p className="text-xl font-bold text-slate-800 font-headline mt-1">{stat.value}</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
