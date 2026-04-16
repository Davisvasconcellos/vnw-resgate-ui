'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const offer = searchParams.get('offer') ?? 'volunteer'

  const [submitting, setSubmitting] = useState(false)

  // Labels for the header
  const titleMap: Record<string, string> = {
    shelter: 'Cadastrar seu Abrigo',
    transport: 'Cadastrar Veículo',
    boat: 'Cadastrar Embarcação',
    volunteer: 'Perfil de Voluntário',
  }

  const descMap: Record<string, string> = {
    shelter: 'Preencha as informações do local que irá receber as famílias.',
    transport: 'Informe os dados do seu veículo para ajudar no transporte.',
    boat: 'Informe os dados da embarcação para apoiar em resgates.',
    volunteer: 'Conte-nos como você pode ajudar.',
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Salva o papel no localStorage para a navegação
    localStorage.setItem('vnw_role', offer)

    setTimeout(() => {
      // Goes to either manage shelter or dashboard based on type
      if (offer === 'shelter') {
        router.push('/shelter/manage')
      } else if (offer === 'transport' || offer === 'boat') {
        // Redirecionamento futuro para aba "Meus Resgates" (Embarque)
        router.push('/dashboard')
      } else {
        router.push('/dashboard')
      }
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 pt-12 pb-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/assist" className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">close</span>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800 font-headline">
              {titleMap[offer] ?? 'Cadastro'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{descMap[offer]}</p>
          </div>
        </div>
      </div>

      {/* Forms */}
      <form onSubmit={handleSubmit} className="flex-1 px-4 pt-6 pb-32 space-y-6">
        
        {/* SHELTER FORM */}
        {offer === 'shelter' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Nome do Local</label>
              <input required type="text" placeholder="Ex: Ginásio Municipal, Minha Casa" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Endereço Completo</label>
              <input required type="text" placeholder="Rua, número, bairro" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
              <button type="button" className="flex items-center gap-1.5 mt-2 text-blue-600 text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">my_location</span> Usar localização atual
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Capacidade total</label>
                <input required type="number" placeholder="Ex: 50" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 block">Estrutura Disponível</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'water', label: 'Água Potável' },
                  { id: 'food', label: 'Alimentação' },
                  { id: 'bath', label: 'Banheiros' },
                  { id: 'energy', label: 'Energia / Gerador' },
                  { id: 'pet', label: 'Aceita Pets' },
                  { id: 'medical', label: 'Primeiros Socorros' },
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-3 active:bg-slate-50 transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRANSPORT FORM */}
        {offer === 'transport' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Tipo de Veículo</label>
              <select required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all appearance-none">
                <option value="">Selecione...</option>
                <option value="car">Carro de passeio</option>
                <option value="pickup">Caminhonete (4x4)</option>
                <option value="van">Van</option>
                <option value="bus">Ônibus / Micro-ônibus</option>
                <option value="truck">Caminhão</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Nº de Lugares</label>
                <input required type="number" placeholder="Ex: 4" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Região de atuação base</label>
              <input required type="text" placeholder="Bairro ou cidade" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
            </div>
            <label className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 mt-2">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <div>
                <p className="text-sm font-bold text-slate-800">Veículo com tração 4x4 / Off-road</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Consegue acessar áreas difíceis ou com lama</p>
              </div>
            </label>
          </div>
        )}

        {/* BOAT FORM */}
        {offer === 'boat' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Tipo de Embarcação</label>
              <select required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all appearance-none">
                <option value="">Selecione...</option>
                <option value="motor">Barco a Motor / Lancha</option>
                <option value="jet">Jet Ski</option>
                <option value="row">Barco a remo / Bote salva-vidas</option>
                <option value="kayak">Caiaque / Stand-up</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Vagas para resgate</label>
                <input required type="number" placeholder="Ex: 5" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Região principal</label>
              <input required type="text" placeholder="Onde o barco está" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all" />
            </div>
            <label className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 mt-2">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <div>
                <p className="text-sm font-bold text-slate-800">Tenho coletes salva-vidas extras</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Importante para resgatar quem não sabe nadar</p>
              </div>
            </label>
          </div>
        )}

        {/* VOLUNTEER FORM */}
        {offer === 'volunteer' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2 block">Como você deseja atuar?</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'sort', label: 'Triagem e organização (roupas/alimentos)' },
                  { id: 'clean', label: 'Força braçal e Limpeza' },
                  { id: 'health', label: 'Enfermagem / Saúde / Psicológico' },
                  { id: 'rescue', label: 'Apoio tático em resgates (nadador)' },
                  { id: 'cook', label: 'Cozinha e refeições para desabrigados' },
                ].map(item => (
                  <label key={item.id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-3 active:bg-slate-50 transition-colors">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">Disponibilidade</label>
              <select required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 transition-all appearance-none">
                <option value="">Selecione...</option>
                <option value="full">Integral</option>
                <option value="morning">Manhã</option>
                <option value="afternoon">Tarde</option>
                <option value="night">Noite / Madrugada</option>
              </select>
            </div>
          </div>
        )}
      </form>

      {/* Submit Button fixed bottom */}
      <div className="fixed bottom-0 left-0 w-full px-4 pb-8 pt-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white text-lg font-headline transition-all active:scale-[0.97] disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)', boxShadow: '0 8px 24px -6px rgba(21,101,192,0.5)' }}
        >
          {submitting ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>Concluir Cadastro</>
          )}
        </button>
      </div>

    </main>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <OnboardingContent />
    </Suspense>
  )
}
