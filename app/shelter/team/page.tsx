'use client'

import { useState } from 'react'
import AppHeader from '@/components/headers/AppHeader'
import { useI18n } from '@/components/i18n/I18nProvider'

type VolunteerCategory = {
  id: string
  label: string
  icon: string
  count: number
}

const INITIAL_CATEGORIES: VolunteerCategory[] = [
  { id: 'sorting', label: 'Triagem e Organização (Roupas/Alimentos)', icon: 'inventory_2', count: 0 },
  { id: 'cleaning', label: 'Limpeza e Manutenção de Espaços', icon: 'cleaning_services', count: 0 },
  { id: 'health', label: 'Saúde / Enfermagem / Psicologia', icon: 'medical_services', count: 0 },
  { id: 'tactical', label: 'Suporte Tático em Resgates', icon: 'pool', count: 0 },
  { id: 'cooking', label: 'Cozinha e Preparo de Refeições', icon: 'restaurant', count: 0 },
]

const MOCK_TEAM = [
  { id: 1, name: 'Carlos Eduardo', role: 'Saúde / Enfermagem', status: 'Ativo', since: '2 dias' },
  { id: 2, name: 'Marina Silva', role: 'Triagem e Organização', status: 'Ativo', since: '1 dia' },
]

export default function ShelterTeam() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<'request' | 'team'>('request')
  const [categories, setCategories] = useState<VolunteerCategory[]>(INITIAL_CATEGORIES)

  const updateCount = (id: string, delta: number) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, count: Math.max(0, cat.count + delta) } : cat
    ))
  }

  const totalNeeded = categories.reduce((acc, cat) => acc + cat.count, 0)

  return (
    <main className="min-h-screen bg-surface dark:bg-[#0a1628] flex flex-col pb-40 pt-16 transition-colors">
      <AppHeader />

      <div className="px-5 pt-10 shrink-0 max-w-2xl mx-auto w-full">
        <section className="mb-8">
          <h1 className="text-4xl font-extrabold font-headline text-on-surface dark:text-white tracking-tight leading-tight">
            Gestão de Equipe
          </h1>
          <p className="mt-2 text-on-surface-variant dark:text-slate-400 font-body text-base">
            Solicite reforços ou gerencie seus voluntários atuais.
          </p>
        </section>

        {/* Toggle Tabs */}
        <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 mb-8">
          <button
            onClick={() => setActiveTab('request')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'request' 
                ? 'bg-white dark:bg-[#1565C0] text-[#1565C0] dark:text-white shadow-sm' 
                : 'text-slate-500 hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            Solicitar Reforço
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'team' 
                ? 'bg-white dark:bg-[#1565C0] text-[#1565C0] dark:text-white shadow-sm' 
                : 'text-slate-500 hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            Minha Equipe
          </button>
        </div>

        {activeTab === 'request' ? (
          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat.id} className="bg-surface-container-lowest dark:bg-white/5 rounded-3xl p-5 border border-outline-variant/10 dark:border-white/5 shadow-sm flex items-center justify-between group transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#1565C0]/10 flex items-center justify-center text-[#1565C0] group-hover:bg-[#1565C0] group-hover:text-white transition-colors border border-[#1565C0]/10">
                    <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white pr-4 leading-tight">{cat.label}</p>
                </div>

                <div className="flex items-center gap-3 bg-slate-100 dark:bg-black/20 rounded-2xl p-1.5 border border-slate-200 dark:border-white/5">
                  <button
                    onClick={() => updateCount(cat.id, -1)}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-white active:scale-90 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="w-8 text-center font-black text-slate-900 dark:text-white text-lg">{cat.count}</span>
                  <button
                    onClick={() => updateCount(cat.id, 1)}
                    className="w-10 h-10 rounded-xl bg-[#1565C0] flex items-center justify-center text-white active:scale-90 transition-all shadow-md shadow-blue-500/20"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            ))}

            <button 
              disabled={totalNeeded === 0}
              className={`w-full mt-8 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all active:scale-95 ${
                totalNeeded > 0 
                  ? 'bg-gradient-to-br from-[#1565C0] to-[#1E88E5] text-white shadow-blue-500/30' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Enviar Convites ({totalNeeded})
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {MOCK_TEAM.map(member => (
              <div key={member.id} className="bg-surface-container-lowest dark:bg-white/5 rounded-3xl p-5 border border-outline-variant/10 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{member.name}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{member.role}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">{member.status}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-400">
                  <span>Atuando no local há {member.since}</span>
                  <button className="text-red-500 font-bold uppercase tracking-widest hover:underline">Remover</button>
                </div>
              </div>
            ))}

            {MOCK_TEAM.length === 0 && (
              <div className="text-center py-20 px-8">
                <span className="material-symbols-outlined text-[64px] text-slate-300 mb-4">group_off</span>
                <p className="text-slate-500 font-bold">Nenhum voluntário na sua equipe ainda.</p>
                <p className="text-xs text-slate-400 mt-1">Solicite reforços na aba ao lado para começar.</p>
              </div>
            )}
          </div>
        )}
      </div>

    </main>
  )
}
