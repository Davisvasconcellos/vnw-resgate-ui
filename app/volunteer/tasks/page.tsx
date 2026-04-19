'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import { api } from '@/services/api'
import ProtectedRoute from '@/components/ProtectedRoute'
import toast from 'react-hot-toast'

const CapacityBar = ({ current, total }: { current: number; total: number }) => {
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  const isFull = percentage >= 100;

  return (
    <div className="w-full space-y-1.5 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ocupação do Abrigo</span>
        <span className={`text-[10px] font-black ${isFull ? 'text-red-500' : percentage > 80 ? 'text-orange-500' : 'text-blue-600'}`}>
          {percentage}%
        </span>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200/50 dark:border-white/5 p-[1px]">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
            isFull ? 'bg-red-500' : percentage > 80 ? 'bg-orange-500' : 'bg-blue-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
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
      toast.success('Missão aceita!')
      setActiveTab('ongoing')
      refreshData()
    } catch (e) {
      toast.error('Erro ao aceitar missão.')
    }
  }

  const handleComplete = async (dest: string, shelterId?: string) => {
    if (!selectedTask) return
    try {
      const payload: any = { status: 'completed', dropoff: dest }
      if (shelterId) payload.shelter_id = shelterId
      await api.put(`/requests/${selectedTask.id}/status`, payload)
      toast.success('Missão concluída!')
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
      toast.success('Turno finalizado!')
      refreshData()
    } catch (e) {
      toast.error('Erro ao finalizar turno.')
    }
  }

  const baseItems = activeTab === 'opportunities' 
    ? opportunities.filter(o => !tasks.some(t => t.id_code === o.id_code))
    : tasks.filter(t => t.status === activeTab)

  const filteredItems = baseItems.filter(item => {
    return item.reporter_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      case 'medical': return '#ef4444';
      case 'boat': return '#3b82f6';
      case 'rescue': return '#f97316';
      case 'food': return '#10b981';
      default: return '#6366f1';
    }
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 dark:bg-[#0a1628] flex flex-col pb-32 transition-colors font-sans">
        <div className="bg-white dark:bg-[#0a1628]/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 px-6 pt-12 pb-6 sticky top-0 z-20">
          <section className="flex items-center justify-between relative max-w-2xl mx-auto mb-6">
            <div className="flex items-center gap-4">
              <Link href="/assist" className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </Link>
              <h1 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Minhas Missões</h1>
            </div>
            <button onClick={refreshData} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 active:rotate-180 transition-all duration-500">
               <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
            </button>
          </section>

          <div className="max-w-2xl mx-auto w-full">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">search</span>
              <input 
                type="text"
                placeholder="Buscar missão ou local..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-slate-700 dark:text-white placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="px-5 pt-6 max-w-2xl mx-auto w-full flex-1">
          <div className="flex bg-slate-200/50 dark:bg-white/5 p-1 rounded-2xl mb-8 border border-slate-200/20">
            {(['opportunities', 'ongoing', 'finished'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-400'
                }`}
              >
                {tabCounts[tab]} {tab === 'opportunities' ? 'Novas' : tab === 'ongoing' ? 'Ativas' : 'Histórico'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-20 opacity-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              </div>
            ) : displayItems.length === 0 ? (
              <div className="text-center py-20 opacity-20">
                 <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                 <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma missão</p>
              </div>
            ) : (
              displayItems.map((item: any) => (
                <div 
                  key={item.id}
                  onClick={() => { setSelectedTask(item); setShowDetail(true); }}
                  className={`bg-white dark:bg-white/5 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-white/10 active:scale-[0.98] transition-all cursor-pointer ${
                    item.status === 'finished' ? 'opacity-50 grayscale' : ''
                  }`}
                >
                  {/* Top: Name & Status */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 dark:bg-white/5">
                        <span className="material-symbols-outlined text-[18px]" style={{ color: getTaskColor(item.type) }}>
                          {getTaskIcon(item.type)}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate max-w-[180px]">
                        {item.reporter_name || item.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                       {item.urgency === 'high' && <span className="material-symbols-outlined text-red-500 text-[18px]">priority_high</span>}
                       {item.is_verified && <span className="material-symbols-outlined text-blue-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>}
                    </div>
                  </div>

                  {/* Middle: Description */}
                  {item.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mb-4 px-1 line-clamp-1">
                      &quot;{item.description}&quot;
                    </p>
                  )}

                  {/* Capacity if Shelter */}
                  {item.type === 'shelter' && item.capacity > 0 && (
                    <div className="mb-4">
                      <CapacityBar current={item.occupied} total={item.capacity} />
                    </div>
                  )}

                  {/* Footer: Stats & Button */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-4">
                      {(item.people_count > 0) && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="material-symbols-outlined text-[16px]">group</span>
                          <span className="text-[10px] font-black">{item.people_count}</span>
                        </div>
                      )}
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (activeTab === 'opportunities') handleAcceptOpportunity(item.id);
                        else if (item.status === 'ongoing') {
                          setSelectedTask(item);
                          if (item.isMission) handleFinishVolunteerTask(item.assignment_id);
                          else if (['rescue', 'transport', 'boat'].includes(item.type)) setShowCheckout(true);
                          else handleComplete('completed');
                        }
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-all ${
                        activeTab === 'opportunities' ? 'bg-primary shadow-primary/20' : 'bg-emerald-500 shadow-emerald-500/20'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {activeTab === 'opportunities' ? 'send' : 'task_alt'}
                      </span>
                    </button>
                  </div>

                  {/* Bottom: Address (Always Last) */}
                  <div className="pt-3 border-t border-slate-50 dark:border-white/5 flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <p className="text-[10px] font-bold truncate flex-1 uppercase tracking-tight">{item.address || 'Localização no Mapa'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail Modal (Simplified) */}
        {showDetail && selectedTask && (
          <div className="fixed inset-0 z-[110] flex flex-col justify-end">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetail(false)} />
             <div className="relative z-10 bg-white dark:bg-[#0d2247] rounded-t-[3rem] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom duration-500 max-w-2xl mx-auto w-full">
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-8" />
                
                <header className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                       <span className="material-symbols-outlined text-[28px]" style={{ color: getTaskColor(selectedTask.type) }}>{getTaskIcon(selectedTask.type)}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">{selectedTask.reporter_name || selectedTask.name}</h2>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedTask.type} • {new Date(selectedTask.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button onClick={() => setShowDetail(false)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                     <span className="material-symbols-outlined">close</span>
                  </button>
                </header>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest mb-2">Descrição</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic">&quot;{selectedTask.description || 'Sem descrição.'}&quot;</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-3xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest mb-2">Endereço</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-4">{selectedTask.address}</p>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedTask.lat},${selectedTask.lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                       <span className="material-symbols-outlined text-[18px]">directions</span>
                       Navegar GPS
                    </a>
                  </div>

                  {activeTab !== 'opportunities' && (
                    <div className="flex gap-4">
                      <a href={`tel:${selectedTask.reporter_phone}`} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg">
                        <span className="material-symbols-outlined">call</span> Ligar
                      </a>
                    </div>
                  )}

                  {activeTab === 'ongoing' && (
                    <button 
                      onClick={() => { 
                        setShowDetail(false); 
                        if (selectedTask.isMission) handleFinishVolunteerTask(selectedTask.assignment_id);
                        else if (['rescue', 'transport', 'boat'].includes(selectedTask.type)) setShowCheckout(true);
                        else handleComplete('completed');
                      }}
                      className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-widest"
                    >
                      Concluir Missão
                    </button>
                  )}
                </div>
             </div>
          </div>
        )}

        {showCheckout && selectedTask && (
          <div className="fixed inset-0 z-[130] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowCheckout(false); setIsSelectingShelter(false); }} />
            <div className="relative z-10 bg-white dark:bg-[#0d2247] rounded-t-[3rem] p-8 pb-12 reveal-pop max-w-2xl mx-auto w-full">
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-8" />
              
              {!isSelectingShelter ? (
                <>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-2">Desfecho</h2>
                  <p className="text-xs text-slate-500 mb-8 font-bold uppercase tracking-widest">Onde o solicitante foi deixado?</p>

                  <div className="space-y-3">
                    <button onClick={() => setIsSelectingShelter(true)} className="w-full flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-5 rounded-[2rem] border border-slate-100 dark:border-white/5 group active:scale-95 transition-all">
                       <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-[28px]">house</span>
                       </div>
                       <div className="text-left">
                          <p className="font-black text-slate-800 dark:text-white">Abrigo Oficial</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Ponto de acolhimento</p>
                       </div>
                    </button>
                    <button onClick={() => handleComplete('safe')} className="w-full flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-5 rounded-[2rem] border border-slate-100 dark:border-white/5 group active:scale-95 transition-all">
                       <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                          <span className="material-symbols-outlined text-[28px]">verified_user</span>
                       </div>
                       <div className="text-left">
                          <p className="font-black text-slate-800 dark:text-white">Local Seguro</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Casa de parentes ou área seca</p>
                       </div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-8">
                     <button onClick={() => setIsSelectingShelter(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined">arrow_back</span>
                     </button>
                     <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">Escolher Abrigo</h2>
                  </div>
                  <div className="max-h-[40vh] overflow-y-auto space-y-2.5 pr-1">
                    {allShelters.map((sh: any) => (
                      <button key={sh.id_code} onClick={() => handleComplete('shelter', sh.id_code)} className="w-full text-left bg-slate-50 dark:bg-white/5 p-5 rounded-3xl border border-slate-100 dark:border-white/5 active:scale-95 transition-all">
                        <p className="font-black text-slate-800 dark:text-white">{sh.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{sh.address}</p>
                      </button>
                    ))}
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
