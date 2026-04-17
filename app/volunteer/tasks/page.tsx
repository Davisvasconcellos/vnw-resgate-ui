'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AppHeader from '@/components/headers/AppHeader'
import { useI18n } from '@/components/i18n/I18nProvider'
import { api } from '@/services/api'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function VolunteerTasksPage() {
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'opportunities' | 'ongoing' | 'finished'>('opportunities')
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any[]>([
    {
      id: 'opp-1',
      title: 'Triagem de Alimentos e Roupas',
      location: 'Ginásio da Trindade',
      category: 'Triagem',
      icon: 'sort',
      description: 'Precisamos de pessoas para organizar as doações e montar cestas básicas.',
      type: 'volunteer',
      urgency: 'medium'
    },
    {
      id: 'opp-2',
      title: 'Limpeza de Áreas Residenciais',
      location: 'Saco Grande / João Paulo',
      category: 'Limpeza',
      icon: 'cleaning_services',
      description: 'Mutirão para retirada de lama e limpeza de residências.',
      type: 'volunteer',
      urgency: 'high'
    }
  ])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/volunteers/tasks')
        const { help_requests, shelters } = res.data.data

        const unifiedTasks = [
          ...help_requests.map((r: any) => ({
            id: r.id_code,
            title: r.description || 'Pedido de Ajuda',
            location: r.address || 'Localização não informada',
            category: r.type === 'boat' ? 'Barco' : r.type === 'transport' ? 'Transporte' : 'Voluntário',
            icon: r.type === 'boat' ? 'directions_boat' : r.type === 'transport' ? 'local_shipping' : 'volunteer_activism',
            status: r.status === 'attending' ? 'ongoing' : r.status === 'completed' ? 'finished' : r.status,
            acceptedAt: new Date(r.updated_at).toLocaleDateString(),
            type: 'rescue',
            people: r.people_count || 1
          })),
          ...shelters.map((s: any) => ({
            id: s.id_code,
            title: s.name,
            location: s.address,
            category: 'Abrigo',
            icon: 'house',
            status: s.volunteer_status === 'accepted' ? 'ongoing' : 'finished',
            acceptedAt: 'Vínculo ativo',
            type: 'shelter'
          }))
        ]
        
        setTasks(unifiedTasks)
      } catch (error) {
        console.error('Error loading tasks', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  const handleAcceptOpportunity = async (oppId: string) => {
    const opp = opportunities.find(o => o.id === oppId)
    if (!opp) return

    try {
      // API call to register/enroll (simulated for now)
      setTasks(prev => [...prev, { 
        ...opp, 
        id: `task-${Date.now()}`, 
        id_code: `task-${Date.now()}`,
        status: 'ongoing', 
        acceptedAt: new Date().toLocaleDateString() 
      }])
      setOpportunities(prev => prev.filter(o => o.id !== oppId))
      setActiveTab('ongoing')
    } catch (e) {
      console.error('Error accepting opportunity', e)
    }
  }

  const handleComplete = async (dest: string) => {
    if (!selectedTask) return
    try {
      await api.put(`/requests/${selectedTask.id}/status`, { status: 'completed', dropoff: dest })
      setTasks(prev => prev.map(t => 
        t.id === selectedTask.id ? { ...t, status: 'finished' } : t
      ))
      setShowCheckout(false)
      setSelectedTask(null)
    } catch (e) {
      // Simulação para o caso da rota não existir ou erro de rede
      setTasks(prev => prev.map(t => 
        t.id === selectedTask.id ? { ...t, status: 'finished' } : t
      ))
      setShowCheckout(false)
      setSelectedTask(null)
    }
  }

  const filteredItems = activeTab === 'opportunities' 
    ? opportunities 
    : tasks.filter(t => t.status === activeTab)

  const tabCounts = {
    opportunities: opportunities.length,
    ongoing: tasks.filter(t => t.status === 'ongoing').length,
    finished: tasks.filter(t => t.status === 'finished').length
  }

  return (
<ProtectedRoute>
    <main className="min-h-screen bg-surface dark:bg-[#0a1628] flex flex-col pb-32 transition-colors">
      {/* Clean Header Pattern */}
      <div className="bg-white/90 dark:bg-[#0a1628]/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 px-6 pt-12 pb-8 sticky top-0 z-20">
        <section className="flex items-start gap-4 relative max-w-2xl mx-auto">
          <Link 
            href="/assist"
            className="w-11 h-11 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-200 active:scale-95 transition-all shadow-sm shrink-0 border border-slate-100 dark:border-white/5"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-tight font-headline">
              Minhas Missões
            </h1>
            <p className="mt-1.5 text-slate-500 dark:text-slate-400 font-body text-base font-medium">
              Ocorrências aceitas e histórico de suporte.
            </p>
          </div>
        </section>
      </div>

      <div className="px-5 pt-8 shrink-0 max-w-2xl mx-auto w-full">

        {/* Triple Tabs */}
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-[1.8rem] mb-8 shadow-sm border border-slate-200/50 dark:border-white/5">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'opportunities' ? 'bg-white dark:bg-white/10 text-[#2E7D32] shadow-sm' : 'text-slate-400'}`}
          >
            {tabCounts.opportunities} Solicitações
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'ongoing' ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-slate-400'}`}
          >
            {tabCounts.ongoing} Ativas
          </button>
          <button
            onClick={() => setActiveTab('finished')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'finished' ? 'bg-white dark:bg-white/10 text-emerald-600 shadow-sm' : 'text-slate-400'}`}
          >
            {tabCounts.finished} Finalizadas
          </button>
        </div>

        <div className="space-y-4">
          {loading && activeTab !== 'opportunities' ? (
             <div className="flex justify-center py-20">
               <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
             </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10">
              <span className="material-symbols-outlined text-slate-300 dark:text-white/10 text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
              <p className="text-slate-500 dark:text-slate-400 font-bold px-10">
                {activeTab === 'opportunities' ? 'Nenhuma nova solicitação no momento.' : activeTab === 'ongoing' ? 'Você ainda não assumiu missões ativas.' : 'Histórico vazio.'}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div 
                key={item.id}
                className={`bg-white dark:bg-white/5 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-white/10 hover:shadow-md transition-all relative overflow-hidden group active:scale-[0.98] ${
                    item.status === 'finished' ? 'opacity-60 grayscale' : ''
                }`}
              >
                {/* Visual Urgency Indicator - Right side like /volunteer */}
                <div className={`absolute top-0 right-0 w-1.5 h-full ${item.urgency === 'high' ? 'bg-red-500' : item.urgency === 'medium' ? 'bg-orange-400' : 'bg-emerald-400'}`} />

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/10">
                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 text-[24px]">
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#2E7D32] dark:text-[#66BB6A]">
                        {item.category}
                      </span>
                      {item.status === 'finished' && (
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Concluída</span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-slate-800 dark:text-white text-lg font-headline leading-tight line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5 font-medium">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">location_on</span>
                      {item.location}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0a1628] bg-slate-200 dark:bg-slate-700" />
                        ))}
                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0a1628] bg-green-100 dark:bg-green-900/30 text-[#2E7D32] dark:text-green-400 text-[8px] font-bold flex items-center justify-center">
                          +{item.people || 0}
                        </div>
                      </div>
                      
                      {activeTab === 'opportunities' ? (
                         <button
                           onClick={() => handleAcceptOpportunity(item.id)}
                           className="px-6 py-2.5 rounded-xl bg-[#2E7D32] text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-900/20 active:scale-95 transition-all"
                         >
                           Aceitar
                         </button>
                      ) : (
                        <div className="flex gap-2">
                           {item.status === 'ongoing' && item.type === 'rescue' && (
                               <button
                                   onClick={() => { setSelectedTask(item); setShowCheckout(true); }}
                                   className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                               >
                                   Concluir
                               </button>
                           )}
                           {item.status === 'ongoing' && item.type === 'volunteer' && (
                               <button
                                   onClick={() => { setSelectedTask(item); handleComplete('finalizado'); }}
                                   className="px-5 py-2.5 rounded-xl bg-[#2E7D32] text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-900/20 active:scale-95 transition-all"
                               >
                                   Concluir
                               </button>
                           )}
                           {item.status === 'ongoing' && item.type === 'shelter' && (
                               <Link
                                   href={`/shelter/manage?id=${item.id}`}
                                   className="px-5 py-2.5 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                               >
                                   Painel
                               </Link>
                           )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedTask && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCheckout(false)} />
          <div className="relative z-10 bg-white dark:bg-[#070d17] rounded-t-[2.5rem] px-6 pt-6 pb-20 reveal-pop border-t border-white/10">
            <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 mx-auto mb-6 shrink-0" />
            <h2 className="text-2xl font-black text-slate-800 dark:text-white font-headline mb-2">Finalizar Resgate</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">Informe para onde você levou o(a) {selectedTask.title}</p>

            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'shelter', label: 'Levado para um Abrigo', icon: 'house', desc: 'A pessoa foi acolhida com segurança.', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                { id: 'safe', label: 'Deixado em Local Seguro', icon: 'verified_user', desc: 'A pessoa seguiu para casa de familiares ou área seca.', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleComplete(item.id)}
                  className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 rounded-[1.8rem] active:scale-[0.98] transition-all text-left group hover:border-primary/30"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                    <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-extrabold text-slate-800 dark:text-white text-base leading-tight">{item.label}</p>
                    <p className="text-[11px] text-slate-500 mt-1 font-bold uppercase tracking-widest">{item.desc}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
    </ProtectedRoute>
  )
}
