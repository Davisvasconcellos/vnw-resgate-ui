import Link from 'next/link'

const MISSING = [
  { id: 'm-1', name: 'Ana Paula Ferreira', age: 42, area: 'Ratones', description: 'Cabelos pretos, camiseta azul, foi buscar filhos na escola', since: 'Ontem, 14h' },
  { id: 'm-2', name: 'Jorge Luiz da Silva', age: 68, area: 'Canasvieiras', description: 'Idoso, cadeirante, estava em casa quando a enchente chegou', since: 'Hoje, 08h' },
  { id: 'm-3', name: 'Criança não identificada', age: 7, area: 'Cachoeira do Bom Jesus', description: 'Menino, short vermelho, sem acompanhante. Está no Abrigo Lauro Linhares', since: 'Hoje, 10h' },
]

export default function MissingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-4">
        <div className="flex items-center gap-3">
          <Link href="/help" className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800 font-headline">Desaparecidos</h1>
            <p className="text-xs text-slate-400">{MISSING.length} registros ativos</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 rounded-xl px-3 py-2 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[16px]">add</span>
            Registrar
          </button>
        </div>
      </div>

      <div className="px-4 pt-5 pb-8 space-y-3">
        <div className="rounded-2xl bg-purple-50 border border-purple-200 px-4 py-3 flex items-start gap-2.5 mb-5">
          <span className="material-symbols-outlined text-purple-600 text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: `'FILL' 1` }}>info</span>
          <p className="text-purple-700 text-xs leading-snug font-medium">
            Se você encontrou alguém desorientado ou sabe de uma pessoa desaparecida, registre aqui para que os voluntários possam ajudar.
          </p>
        </div>

        {MISSING.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white p-4 shadow-sm border border-transparent">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 shrink-0">
                <span className="material-symbols-outlined text-purple-600 text-[28px]" style={{ fontVariationSettings: `'FILL' 1` }}>
                  person_search
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-slate-800 font-headline">{p.name}</p>
                  <span className="text-xs text-slate-400 shrink-0">{p.age} anos</span>
                </div>
                <p className="text-xs text-purple-600 font-semibold mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">location_on</span>
                  {p.area}
                </p>
                <p className="text-xs text-slate-500 mt-1.5 leading-snug">{p.description}</p>
                <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">schedule</span>
                  Desaparecido desde: {p.since}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 rounded-xl py-2 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[15px]">share</span>
                Compartilhar
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 rounded-xl py-2 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                Encontrado
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
