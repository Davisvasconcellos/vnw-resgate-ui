'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import { api } from '@/services/api'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function VolunteerTasksPage() {
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'opportunities' | 'ongoing' | 'finished'>('opportunities')
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [showDetail, setShowDetail] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const refreshData = async () => {
    setLoading(true)
    try {
      // 1. Minhas Tarefas (Ativas/Histórico)
      const resTasks = await api.get('/volunteers/tasks')
      const { help_requests, shelters } = resTasks.data.data

      const unifiedTasks = [
        ...help_requests.map((r: any) => ({
          ...r,
          id: r.id_code,
          reporter_name: r.reporter_name || r.requester?.name || 'Solicitante',
          reporter_phone: r.reporter_phone || r.requester?.phone || 'N/A',
          status: (r.status === 'attending' || r.status === 'ongoing') ? 'ongoing' : (r.status === 'completed' || r.status === 'resolved') ? 'finished' : r.status
        })),
        ...shelters.map((s: any) => ({
          ...s,
          id: s.id_code,
          reporter_name: s.name,
          address: s.address,
          status: s.volunteer_status === 'accepted' ? 'ongoing' : 'finished',
          type: 'shelter'
        }))
      ]
      setTasks(unifiedTasks)

      // 2. Oportunidades Disponíveis (Pendentes)
      const resOpps = await api.get('/requests?status=pending&radiusKm=50')
      setOpportunities(resOpps.data.data.map((o: any) => ({
        ...o,
        id: o.id_code,
        reporter_name: o.reporter_name || o.requester?.name || 'Solicitante',
        reporter_phone: o.reporter_phone || o.requester?.phone || 'N/A'
      })))

    } catch (error) {
      console.error('Error loading tasks', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  const handleAcceptOpportunity = async (oppId: string) => {
    try {
      await api.put(`/requests/${oppId}/status`, { status: 'attending' })
      setActiveTab('ongoing')
      refreshData()
    } catch (e) {
      console.error('Error accepting opportunity', e)
    }
  }

  const handleComplete = async (dest: string) => {
    if (!selectedTask) return
    try {
      await api.put(`/requests/${selectedTask.id}/status`, { status: 'completed', dropoff: dest })
      refreshData()
      setShowCheckout(false); setShowDetail(false);
      setSelectedTask(null)
    } catch (e) {
      refreshData()
      setShowCheckout(false); setShowDetail(false);
      setSelectedTask(null)
    }
  }

  const handleFinishVolunteerTask = async (assignmentId: number) => {
    try {
      await api.put(`/volunteers/missions/${assignmentId}/status`, { status: 'finished' })
      refreshData()
    } catch (e) {
      console.error('Error finishing volunteer task', e)
    }
  }

  // 1. Filtrar itens baseado na busca e na aba ativa
  const baseItems = activeTab === 'opportunities' 
    ? opportunities.filter(o => !tasks.some(t => t.shelter_id === o.shelter_id && t.volunteer_message === o.volunteer_message && t.status === 'ongoing'))
    : tasks.filter(t => t.status === activeTab)

  const filteredItems = baseItems.filter(item => {
    return item.reporter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.volunteer_message?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // 2. Preparar itens para exibição (Oportunidades agora vêm como registro único com total_slots)
  const displayItems = activeTab === 'opportunities' 
    ? filteredItems.map(o => ({
        ...o,
        slots: o.total_slots,
        available_ids: [o.id_code] // Mantendo compatibilidade com o clique
      }))
    : filteredItems

  const tabCounts = {
    opportunities: opportunities.length,
    ongoing: tasks.filter(t => t.status === 'ongoing').length,
    finished: tasks.filter(t => t.status === 'finished').length
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'medical': return 'medical_services';
      case 'boat': return 'directions_boat';
      case 'rescue': return 'emergency';
      case 'food': return 'restaurant';
      case 'shelter': return 'home_pin';
      case 'transport': return 'local_shipping';
      default: return 'volunteer_activism';
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'medical': return '#C62828';
      case 'boat': return '#0277BD';
      case 'rescue': return '#E65100';
      case 'food': return '#2E7D32';
      default: return '#1565C0';
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-surface dark:bg-[#0a1628] flex flex-col pb-32 transition-colors">
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

          <div className="max-w-2xl mx-auto mt-8 w-full">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
              <input 
                type="text"
                placeholder="Buscar por abrigo ou tarefa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-white/5 border-none rounded-3xl py-4 pl-14 pr-6 text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        <div className="px-5 pt-8 shrink-0 max-w-2xl mx-auto w-full">
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-[1.8rem] mb-8 shadow-sm border border-slate-200/50 dark:border-white/5 font-sans">
            {(['opportunities', 'ongoing', 'finished'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-white/10 text-primary shadow-sm' 
                    : 'text-slate-400'
                }`}
              >
                {tabCounts[tab]} {tab === 'opportunities' ? 'Solicitações' : tab === 'ongoing' ? 'Ativas' : 'Histórico'}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {loading && activeTab !== 'opportunities' ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10 opacity-60">
                <span className="material-symbols-outlined text-slate-300 dark:text-white/10 text-6xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
                <p className="text-slate-500 dark:text-slate-400 font-bold px-10 uppercase text-[10px] tracking-widest">
                  {activeTab === 'opportunities' ? 'Nenhuma nova solicitação.' : activeTab === 'ongoing' ? 'Sem missões ativas.' : 'Histórico vazio.'}
                </p>
              </div>
            ) : (
              displayItems.map((item: any) => (
                <div 
                  key={item.id}
                  onClick={() => { setSelectedTask(item); setShowDetail(true); }}
                  className={`bg-white dark:bg-white/5 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-white/10 hover:shadow-md transition-all relative overflow-hidden group cursor-pointer active:scale-[0.98] ${
                    item.status === 'finished' ? 'opacity-60 grayscale' : ''
                  }`}
                >
                  <div 
                    className="absolute top-0 right-0 w-2.5 h-full opacity-80"
                    style={{ backgroundColor: getTaskColor(item.type) }}
                  />

                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-[1.8rem] bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0 border border-slate-100 dark:border-white/10 group-hover:bg-slate-100 transition-colors">
                      <span className="material-symbols-outlined text-[32px]" style={{ color: getTaskColor(item.type) }}>
                        {getTaskIcon(item.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1.5">
                        <span 
                          className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg"
                          style={{ backgroundColor: `${getTaskColor(item.type)}15`, color: getTaskColor(item.type) }}
                        >
                          {item.volunteer_message?.includes('NECESSIDADE') 
                            ? item.volunteer_message.replace('NECESSIDADE DE VOLUNTÁRIOS: ', '') 
                            : item.type || 'VOLUNTÁRIO'
                          }
                        </span>
                        {item.urgency === 'high' && (
                          <div className="flex items-center gap-1 text-red-600 animate-pulse">
                            <span className="material-symbols-outlined text-[14px]">emergency</span>
                            <span className="text-[9px] font-black uppercase tracking-widest">Urgente</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-black text-slate-800 dark:text-white text-xl font-headline leading-tight line-clamp-1 mb-2">
                        {item.reporter_name || 'Pedido de Ajuda'}
                      </h3>
                      
                      <div className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed h-9">
                        <span className="material-symbols-outlined text-[18px] text-slate-400 shrink-0 translate-y-0.5">location_on</span>
                        <span className="line-clamp-2 overflow-hidden">
                          {item.address || item.location}
                        </span>
                        {activeTab === 'opportunities' && item.slots > 0 && (
                          <div className="mt-1 flex items-center gap-2">
                             <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                               0 / {item.slots} Vagas
                             </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <a 
                            href={`tel:${item.reporter_phone || item.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center active:scale-90 transition-all border border-emerald-100 dark:border-emerald-500/20 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[20px]">call</span>
                          </a>
                          <div className="text-[11px] font-bold">
                            <p className="text-slate-400 leading-none mb-1 uppercase tracking-tighter opacity-70">
                               {item.requester?.name || 'Gestor'}
                            </p>
                            <p className="text-slate-700 dark:text-white leading-none tracking-tight">{item.reporter_phone || item.phone || 'N/A'}</p>
                          </div>
                        </div>
                        
                        {activeTab === 'opportunities' ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAcceptOpportunity(item.available_ids?.[0] || item.id); }}
                            className="px-6 py-3 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[18px]">send</span>
                            Aceitar
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            {item.status === 'ongoing' && (
                              <button
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  if (item.type === 'volunteer') {
                                    handleFinishVolunteerTask(item.assignment_id);
                                  } else {
                                    setSelectedTask(item); 
                                    setShowCheckout(true); 
                                  }
                                }}
                                className="px-6 py-3 rounded-2xl bg-[#2E7D32] text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-900/20 active:scale-95 transition-all"
                              >
                                Concluir
                              </button>
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

        {/* Task Detail Modal */}
        {showDetail && selectedTask && (
          <div className="fixed inset-0 z-[110] flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowDetail(false)} />
             <div className="relative z-10 bg-white dark:bg-[#0a1628] rounded-t-[3rem] w-full max-w-2xl mx-auto overflow-hidden reveal-pop border-t border-white/5 max-h-[92vh] flex flex-col pt-2">
                
                {/* Visual Header / Close indicator */}
                <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 mx-auto my-4 shrink-0" onClick={() => setShowDetail(false)} />

                <div className="flex-1 overflow-y-auto px-6 pb-20">
                    {/* Media section (image) */}
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-white/5 mb-6 border border-slate-100 dark:border-white/5">
                        {selectedTask.photo_url ? (
                            <img src={selectedTask.photo_url} alt="Localização" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-white/10">
                                <span className="material-symbols-outlined text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>image</span>
                                <p className="text-xs font-black uppercase tracking-widest mt-2">{selectedTask.type === 'shelter' ? 'Abrigo Oficial' : 'Sem foto do local'}</p>
                            </div>
                        )}
                        
                        <div className="absolute top-4 left-4">
                             <span 
                                className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-xl backdrop-blur-xl"
                                style={{ backgroundColor: `${getTaskColor(selectedTask.type)}`, color: 'white' }}
                                >
                                {selectedTask.type}
                            </span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-tight font-headline">
                        {selectedTask.reporter_name || selectedTask.name}
                    </h2>
                    
                    <div className="flex items-center gap-3 mt-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[24px]">call</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contatar Solicitante</p>
                            <a href={`tel:${selectedTask.reporter_phone}`} className="text-lg font-black text-slate-700 dark:text-white leading-none">{selectedTask.reporter_phone}</a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-2 text-slate-400 mb-3">
                                <span className="material-symbols-outlined text-[20px]">location_on</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Endereço Exato</span>
                            </div>
                            <p className="text-base font-bold text-slate-700 dark:text-slate-200 leading-relaxed">
                                {selectedTask.address || selectedTask.location}
                            </p>
                            
                            <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedTask.lat},${selectedTask.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full mt-6 py-4 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">directions</span>
                                Abrir GPS (Google Maps)
                            </a>
                        </div>

                        {selectedTask.description && (
                            <div className="px-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Observações do Pedido</p>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed italic">
                                    "{selectedTask.description}"
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions in Modal */}
                    <div className="mt-10 flex gap-3 pb-8">
                        <button 
                            onClick={() => setShowDetail(false)}
                            className="flex-1 py-4 rounded-2xl border-2 border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all"
                        >
                            Fechar
                        </button>
                        {selectedTask.status === 'ongoing' && (
                            <button 
                                onClick={() => { 
                                  setShowDetail(false); 
                                  if (selectedTask.type === 'volunteer') {
                                    handleFinishVolunteerTask(selectedTask.assignment_id);
                                  } else {
                                    setShowCheckout(true); 
                                  }
                                }}
                                className="flex-[1.5] py-4 rounded-2xl bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all"
                            >
                                Concluir Missão
                            </button>
                        )}
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* Detail Modal Overlay can be added here if needed */}
        {showCheckout && selectedTask && (
          <div className="fixed inset-0 z-[100] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCheckout(false)} />
            <div className="relative z-10 bg-white dark:bg-[#0a1628] rounded-t-[2.5rem] px-6 pt-6 pb-20 reveal-pop border-t border-white/5">
              <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 mx-auto mb-6 shrink-0" />
              <h2 className="text-2xl font-black text-slate-800 dark:text-white font-headline mb-2">Finalizar Resgate</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">Informe para onde você levou o(a) {selectedTask.reporter_name || selectedTask.name || 'solicitante'}</p>

              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'shelter', label: 'Levado para um Abrigo', icon: 'house', desc: 'A pessoa foi acolhida com segurança.', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                  { id: 'safe', label: 'Deixado em Local Seguro', icon: 'verified_user', desc: 'A pessoa seguiu para casa de familiares ou área seca.', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleComplete(option.id)}
                    className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 rounded-[1.8rem] active:scale-[0.98] transition-all text-left group hover:border-primary/30"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${option.bg} ${option.color}`}>
                      <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>{option.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold text-slate-800 dark:text-white text-base leading-tight">{option.label}</p>
                      <p className="text-[11px] text-slate-500 mt-1 font-bold uppercase tracking-widest">{option.desc}</p>
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
  );
}
