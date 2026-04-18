'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import { api } from '@/services/api'
import ProtectedRoute from '@/components/ProtectedRoute'

const CapacityBar = ({ current, total }: { current: number; total: number }) => {
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  const isFull = percentage >= 100;

  return (
    <div className="w-full space-y-1.5 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ocupação do Abrigo</span>
        <span className={`text-xs font-black ${isFull ? 'text-red-500' : percentage > 80 ? 'text-orange-500' : 'text-blue-600'}`}>
          {percentage}%
        </span>
      </div>
      <div className="h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200/50 dark:border-white/5 p-[2px]">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
            isFull ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
        {current} de {total} vagas preenchidas
      </p>
    </div>
  );
};

export default function VolunteerTasksPage() {
  const { t } = useI18n()
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'opportunities' | 'ongoing' | 'finished'>('opportunities')
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [showDetail, setShowDetail] = useState(false)
  const [allShelters, setAllShelters] = useState<any[]>([])
  const [isSelectingShelter, setIsSelectingShelter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const refreshData = async () => {
    setLoading(true)
    try {
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
          assignment_id: s.id,
          reporter_name: s.name,
          address: s.address,
          status: s.volunteer_status === 'accepted' ? 'ongoing' : 'finished',
          type: 'shelter',
          isMission: true
        }))
      ]
      setTasks(unifiedTasks)

      const resOpps = await api.get('/requests?status=pending&radiusKm=100')
      setOpportunities(resOpps.data.data.map((o: any) => ({
        ...o,
        id: o.id_code,
        reporter_name: o.reporter_name || o.requester?.name || 'Solicitante',
        reporter_phone: o.reporter_phone || o.requester?.phone || 'N/A'
      })))

      // Buscar todos os abrigos para o desfecho
      const resShelters = await api.get('/shelters')
      setAllShelters(resShelters.data.data)

    } catch (error) {
      console.error('Error loading data', error)
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

  const handleComplete = async (dest: string, shelterId?: string) => {
    if (!selectedTask) return
    try {
      const payload: any = { status: 'completed', dropoff: dest }
      if (shelterId) payload.shelter_id = shelterId

      await api.put(`/requests/${selectedTask.id}/status`, payload)
      
      refreshData()
      setShowCheckout(false); setShowDetail(false); setIsSelectingShelter(false);
      setSelectedTask(null)
    } catch (e) {
      refreshData()
      setShowCheckout(false); setShowDetail(false); setIsSelectingShelter(false);
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

  const baseItems = activeTab === 'opportunities' 
    ? opportunities.filter(o => !tasks.some(t => t.id_code === o.id_code))
    : tasks.filter(t => t.status === activeTab)

  const filteredItems = baseItems.filter(item => {
    return item.reporter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.volunteer_message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           item.address?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const displayItems = activeTab === 'opportunities' 
    ? filteredItems.map(o => ({
        ...o,
        slots: o.total_slots,
        available_ids: [o.id_code]
      }))
    : filteredItems

  const tabCounts = {
    opportunities: opportunities.filter(o => !tasks.some(t => t.id_code === o.id_code)).length,
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
      case 'medical': return '#ba1a1a';
      case 'boat': return '#0277BD';
      case 'rescue': return '#E65100';
      case 'food': return '#2E7D32';
      case 'shelter': return '#1565C0';
      default: return '#1565C0';
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 dark:bg-[#0a1628] flex flex-col pb-32 transition-colors">
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
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-white/5 rounded-[2.5rem] p-10 border border-dashed border-slate-200 dark:border-white/10 opacity-60">
                <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-slate-300 text-4xl">inventory_2</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Nada encontrado</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2 px-10">
                  {activeTab === 'opportunities' ? 'Nenhuma nova solicitação disponível.' : activeTab === 'ongoing' ? 'Sem missões ativas no momento.' : 'Histórico de atividades vazio.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {displayItems.map((item: any) => (
                  <div 
                    key={item.id}
                    onClick={() => { setSelectedTask(item); setShowDetail(true); }}
                    className={`bg-white dark:bg-white/5 rounded-[2.5rem] p-6 shadow-sm border border-slate-100 dark:border-white/10 hover:shadow-md transition-all relative overflow-hidden group cursor-pointer active:scale-[0.98] ${
                      item.status === 'finished' ? 'opacity-60 grayscale' : ''
                    }`}
                  >
                    <div 
                      className="absolute right-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2.5"
                      style={{ backgroundColor: getTaskColor(item.type) }}
                    />

                    <div className="flex items-start gap-4 mb-4">
                      <div className="shrink-0 w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 shadow-inner group-hover:scale-105 transition-transform border border-slate-100 dark:border-white/5">
                        <span className="material-symbols-outlined text-[28px]" style={{ color: getTaskColor(item.type) }}>
                          {getTaskIcon(item.type)}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0 pr-2">
                         <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-white shadow-sm" style={{ backgroundColor: getTaskColor(item.type) }}>
                              {item.type.toUpperCase()}
                            </span>
                            {item.urgency === 'high' && (
                              <div className="flex items-center justify-center text-red-500 animate-pulse bg-red-50 dark:bg-red-900/20 w-6 h-6 rounded-full">
                                  <span className="material-symbols-outlined text-sm font-bold">priority_high</span>
                              </div>
                            )}
                            {item.is_verified && (
                              <div className="flex items-center justify-center text-blue-500 bg-blue-50 dark:bg-blue-900/20 w-6 h-6 rounded-full">
                                  <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                              </div>
                            )}
                            {item.photo_url && (
                              <div className="flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-white/5 w-6 h-6 rounded-full border border-slate-200 dark:border-white/10">
                                  <span className="material-symbols-outlined text-xs font-bold">image</span>
                              </div>
                            )}
                         </div>
                         <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-headline leading-tight truncate">
                            {item.reporter_name || item.name || 'Pedido de Ajuda'}
                         </h3>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-6">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-outline-variant text-[11px] font-bold">
                          <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                          <span className="truncate">{item.address || item.location || 'Localização no Mapa'}</span>
                      </div>
                      {item.description && (
                           <div className="ml-6">
                              <p className="text-[10px] text-slate-400 font-medium italic truncate">
                                  "{item.description}"
                              </p>
                           </div>
                      )}
                    </div>

                    {item.type === 'shelter' && item.capacity > 0 && (
                       <div className="mb-6 px-1">
                           <CapacityBar current={item.occupied} total={item.capacity} />
                       </div>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2.5">
                         {activeTab !== 'opportunities' && (
                           <a 
                             href={`tel:${item.reporter_phone || item.phone}`}
                             onClick={(e) => e.stopPropagation()}
                             className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center active:scale-95 transition-all border border-emerald-100 dark:border-emerald-500/10 shadow-sm"
                           >
                             <span className="material-symbols-outlined text-[20px]">call</span>
                           </a>
                         )}
                         <div className="flex items-center gap-3">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-80 leading-tight">
                                {new Date(item.created_at).toLocaleDateString()}
                            </div>
                            {(item.type === 'rescue' || item.type === 'transport' || item.type === 'boat') && item.people_count > 0 && (
                               <div className="flex items-center gap-1 text-slate-400">
                                  <span className="material-symbols-outlined text-[16px]">group</span>
                                  <span className="text-[10px] font-black leading-tight">{item.people_count}</span>
                               </div>
                            )}
                         </div>
                      </div>

                      {activeTab === 'opportunities' ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAcceptOpportunity(item.available_ids?.[0] || item.id); }}
                          className="px-6 py-3 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">send</span>
                          Aceitar
                        </button>
                      ) : (
                        item.status === 'ongoing' && (
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if (item.isMission) {
                                handleFinishVolunteerTask(item.assignment_id);
                              } else if (item.type === 'rescue' || item.type === 'transport' || item.type === 'boat') {
                                setSelectedTask(item); 
                                setShowCheckout(true); 
                              } else {
                                setSelectedTask(item);
                                handleComplete('completed');
                              }
                            }}
                            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[18px]">task_alt</span>
                            Concluir
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Task Detail Modal */}
        {showDetail && selectedTask && (
          <div className="fixed inset-0 z-[110] flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowDetail(false)} />
             <div className="relative z-10 bg-white dark:bg-[#0a1628] rounded-t-[3rem] w-full max-w-2xl mx-auto overflow-hidden reveal-pop border-t border-white/5 max-h-[92vh] flex flex-col pt-2 transition-transform duration-500">
                <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 mx-auto my-4 shrink-0" onClick={() => setShowDetail(false)} />
                <div className="flex-1 overflow-y-auto px-6 pb-20">
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-white/5 mb-6 border border-slate-100 dark:border-white/5">
                        {selectedTask.photo_url ? (
                            <img src={selectedTask.photo_url} alt="Localização" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-white/10">
                                <span className="material-symbols-outlined text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>image</span>
                                <p className="text-xs font-black uppercase tracking-widest mt-2">{selectedTask.type === 'shelter' ? 'Abrigo Oficial' : 'Sem foto do local'}</p>
                            </div>
                        )}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                             <span className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-xl backdrop-blur-xl bg-primary text-white">
                                {selectedTask.type}
                            </span>
                            {(selectedTask.type === 'rescue' || selectedTask.type === 'transport' || selectedTask.type === 'boat') && selectedTask.people_count > 0 && (
                               <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-xl backdrop-blur-xl bg-white/90 text-slate-900 border border-slate-200">
                                  <span className="material-symbols-outlined text-[16px]">group</span>
                                  {selectedTask.people_count}
                               </span>
                            )}
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-slate-800 dark:text-white leading-tight font-headline">
                        {selectedTask.reporter_name || selectedTask.name}
                    </h2>
                    
                    {selectedTask.status !== 'pending' && (
                      <div className="flex items-center gap-3 mt-4 mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
                          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[24px]">call</span>
                          </div>
                          <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contatar Solicitante</p>
                              <a href={`tel:${selectedTask.reporter_phone}`} className="text-lg font-black text-slate-700 dark:text-white leading-none">{selectedTask.reporter_phone}</a>
                          </div>
                      </div>
                    )}

                    {selectedTask.status === 'pending' && (
                      <div className="mt-4 mb-8 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/10 flex items-center gap-3 text-blue-600 dark:text-blue-400">
                         <span className="material-symbols-outlined">lock</span>
                         <p className="text-[11px] font-bold leading-tight uppercase tracking-tight">O contato será liberado após aceitar a missão.</p>
                      </div>
                    )}

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

                    <div className="mt-10 flex gap-3 pb-8">
                        <button onClick={() => setShowDetail(false)} className="flex-1 py-4 rounded-2xl border-2 border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all">
                            Fechar
                        </button>
                        {selectedTask.status === 'ongoing' && (
                            <button 
                                onClick={() => { 
                                  setShowDetail(false); 
                                  if (selectedTask.isMission) handleFinishVolunteerTask(selectedTask.assignment_id);
                                  else if (selectedTask.type === 'rescue' || selectedTask.type === 'transport' || selectedTask.type === 'boat') setShowCheckout(true);
                                  else handleComplete('completed');
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

        {showCheckout && selectedTask && (
          <div className="fixed inset-0 z-[130] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowCheckout(false); setIsSelectingShelter(false); }} />
            <div className="relative z-10 bg-white dark:bg-[#0a1628] rounded-t-[2.5rem] px-6 pt-6 pb-20 reveal-pop border-t border-white/5 max-h-[90vh] flex flex-col">
              <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 mx-auto mb-6 shrink-0" />
              
              {!isSelectingShelter ? (
                <>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white font-headline mb-2">Finalizar Missão</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">Informe o desfecho deste atendimento:</p>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'shelter', label: 'Levado para um Abrigo', icon: 'house', desc: 'A pessoa foi acolhida com segurança.', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                      { id: 'safe', label: 'Deixado em Local Seguro', icon: 'verified_user', desc: 'A pessoa seguiu para casa de familiares ou área seca.', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => option.id === 'shelter' ? setIsSelectingShelter(true) : handleComplete(option.id)}
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
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => setIsSelectingShelter(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500">
                       <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                      <h2 className="text-xl font-black text-slate-800 dark:text-white font-headline leading-tight">Escolher Abrigo</h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ponto de entrega do solicitante</p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[300px]">
                    {allShelters.length === 0 ? (
                       <div className="py-10 text-center opacity-50 italic text-sm">Nenhum abrigo cadastrado.</div>
                    ) : (
                      allShelters.map((sh: any) => {
                        const perc = Math.round((sh.occupied / sh.capacity) * 100) || 0;
                        return (
                          <button 
                            key={sh.id_code} 
                            onClick={() => handleComplete('shelter', sh.id_code)}
                            className="w-full text-left bg-slate-50 dark:bg-white/5 p-5 rounded-[1.8rem] border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-all group active:scale-[0.98]"
                          >
                             <div className="flex items-start justify-between gap-4">
                               <div className="flex-1 min-w-0">
                                  <p className="font-black text-slate-800 dark:text-white text-base leading-tight truncate group-hover:text-blue-600 transition-colors">{sh.name}</p>
                                  <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest truncate">{sh.address}</p>
                               </div>
                               <div className="text-right shrink-0">
                                  <div className={`px-2 py-1 rounded-lg text-[10px] font-black inline-block ${perc >= 90 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                     {perc}%
                                  </div>
                                  <p className="text-[8px] font-black text-slate-400 mt-1 uppercase tracking-tighter">Ocupado</p>
                               </div>
                             </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
}
