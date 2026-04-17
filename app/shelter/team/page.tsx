'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import BottomNavShelter from '@/components/BottomNavShelter'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { api } from '@/services/api'
import { toast } from 'react-hot-toast'

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


export default function ShelterTeam() {
  const { t } = useI18n()
  const { profile } = useSelector((state: RootState) => state.auth)
  const [activeTab, setActiveTab] = useState<'request' | 'pending' | 'team'>('request')
  const [categories, setCategories] = useState<VolunteerCategory[]>(INITIAL_CATEGORIES)
  const [loading, setLoading] = useState(false)
  const [broadcasts, setBroadcasts] = useState<any[]>([])
  const [team, setTeam] = useState<any[]>([])

  const fetchBroadcasts = async () => {
    const shelterId = profile?.managed_shelters?.[0]?.id_code
    if (!shelterId) return
    try {
      const res = await api.get(`/shelters/${shelterId}/broadcast-needs`)
      setBroadcasts(res.data.data)
      setTeam(res.data.team || [])
    } catch (e) {
      console.error('Error fetching broadcasts', e)
    }
  }

  useEffect(() => {
    fetchBroadcasts()
  }, [profile])

  useEffect(() => {
    fetchBroadcasts()
  }, [activeTab])

  const updateCount = (id: string, delta: number) => {
    setCategories((prev: any) => prev.map((cat: any) => 
      cat.id === id ? { ...cat, count: Math.max(0, cat.count + delta) } : cat
    ))
  }

  const totalNeeded = categories.reduce((acc: any, cat: any) => acc + cat.count, 0)

  const handleSendInvites = async () => {
    const shelterId = profile?.managed_shelters?.[0]?.id_code
    if (!shelterId) return toast.error('Abrigo não identificado')

    const needs = categories
      .filter(cat => cat.count > 0)
      .map(cat => ({ label: cat.label, count: cat.count }))

    setLoading(true)
    try {
      await api.post(`/shelters/${shelterId}/broadcast-needs`, { needs })
      toast.success('Solicitações enviadas com sucesso!', {
        icon: '🚀',
        style: { borderRadius: '1rem', background: '#333', color: '#fff' }
      })
      setCategories(INITIAL_CATEGORIES)
      if (activeTab === 'request') setActiveTab('pending')
    } catch (error) {
      console.error('Error sending invites', error)
      toast.error('Erro ao enviar solicitações')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBroadcast = async (requestIdCode: string) => {
    const shelterId = profile?.managed_shelters?.[0]?.id_code
    if (!shelterId) return
    try {
      await api.delete(`/shelters/${shelterId}/broadcast-needs/${requestIdCode}`)
      toast.success('Solicitação removida')
      fetchBroadcasts()
    } catch (e) {
      toast.error('Erro ao remover')
    }
  }

  const handleRemoveFromTeam = async (userIdCode: string) => {
    const shelterId = profile?.managed_shelters?.[0]?.id_code
    if (!shelterId || !userIdCode) return
    
    if (!confirm('Tem certeza que deseja remover este voluntário da equipe? Todas as atividades vinculadas a ele neste abrigo serão removidas.')) return

    try {
      await api.delete(`/shelters/${shelterId}/volunteers/${userIdCode}`)
      toast.success('Voluntário removido')
      fetchBroadcasts()
    } catch (e) {
      toast.error('Erro ao remover voluntário')
    }
  }

  return (
    <main className="min-h-screen bg-surface dark:bg-[#0a1628] flex flex-col pb-44 transition-colors">
      <div className="bg-white/90 dark:bg-[#0a1628]/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 px-6 pt-12 pb-8 sticky top-0 z-20">
        <section className="flex items-start gap-4 relative max-w-2xl mx-auto">
          <Link 
            href="/assist"
            className="w-11 h-11 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-200 active:scale-95 transition-all shadow-sm shrink-0 border border-slate-100 dark:border-white/5"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-tight font-headline">
              Gestão de Equipe
            </h1>
            <p className="mt-1.5 text-slate-500 dark:text-slate-400 font-body text-base font-medium">
              Solicite reforços ou gerencie seus voluntários atuais.
            </p>
          </div>
        </section>
      </div>

      <div className="px-5 pt-10 shrink-0 max-w-2xl mx-auto w-full">

        {/* Toggle Tabs */}
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-[1.5rem] shadow-sm border border-slate-200/50 dark:border-white/5 mb-8 overflow-x-auto scrollbar-hide shrink-0">
          {[
            { id: 'request', label: 'Solicitar' },
            { id: 'pending', label: 'Solicitados' },
            { id: 'team', label: 'Equipe' }
          ].map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all min-w-[100px] ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-[#1565C0] text-[#1565C0] dark:text-white shadow-sm' 
                  : 'text-slate-400 font-bold'
              }`}
            >
              {tab.label}
              {tab.id === 'pending' && broadcasts.filter(b => b.status === 'pending').length > 0 && (
                 <span className="ml-1.5 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ring-2 ring-slate-100 dark:ring-black translate-y-[-1px]">
                   {broadcasts.filter(b => b.status === 'pending').length}
                 </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'request' ? (
          <div className="space-y-4">
            {categories.map((cat: any) => (
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
              onClick={handleSendInvites}
              disabled={totalNeeded === 0 || loading}
              className={`w-full mt-8 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                totalNeeded > 0 
                  ? 'bg-gradient-to-br from-[#1565C0] to-[#1E88E5] text-white shadow-blue-500/30' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                   <span className="material-symbols-outlined text-[20px]">send</span>
                   Enviar Convites ({totalNeeded})
                </>
              )}
            </button>
          </div>
        ) : activeTab === 'pending' ? (
          <div className="space-y-4">
             {broadcasts.length === 0 ? (
               <div className="text-center py-20 bg-white/50 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10 opacity-60">
                 <span className="material-symbols-outlined text-slate-300 dark:text-white/10 text-6xl mb-4">history</span>
                 <p className="text-slate-500 dark:text-slate-400 font-bold px-10 uppercase text-[10px] tracking-widest">
                   Nenhuma vaga aberta no momento.
                 </p>
               </div>
             ) : (
               <>
                {broadcasts.map((b: any) => (
                   <div key={b.id_code} className="bg-white dark:bg-white/5 rounded-3xl p-4 border border-slate-100 dark:border-white/10 shadow-sm flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-blue-600 flex items-center justify-center border border-blue-100 dark:border-blue-500/10">
                            <span className="material-symbols-outlined text-[20px]">groups</span>
                         </div>
                         <div>
                           <p className="text-sm font-black text-slate-800 dark:text-white leading-tight">
                             {b.volunteer_message.replace('NECESSIDADE DE VOLUNTÁRIOS: ', '')}
                           </p>
                           <div className="mt-1 flex items-center gap-2">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg ${b.accepted_count >= b.total_slots ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                {b.total_slots - b.accepted_count} / {b.total_slots} Livres
                              </span>
                              {b.accepted_count >= b.total_slots && (
                                <span className="material-symbols-outlined text-emerald-500 text-[14px]">check_circle</span>
                              )}
                           </div>
                         </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDeleteBroadcast(b.id_code)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center active:scale-95 transition-all opacity-40 group-hover:opacity-100"
                       >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                   </div>
                 ))}
               </>
             )}
          </div>
        ) : (
          <div className="space-y-4">
            {team.map(member => (
              <div key={member.name} className="bg-surface-container-lowest dark:bg-white/5 rounded-3xl p-5 border border-outline-variant/10 dark:border-white/5 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{member.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {member.activities.map((act: any) => (
                        <span key={act.id} className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${act.status === 'finished' ? 'bg-slate-100 text-slate-400 dark:bg-white/5' : 'bg-emerald-500/10 text-emerald-500'}`}>
                           {act.label} {act.status === 'finished' ? '(CONCLUÍDO)' : '(ATIVO)'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 text-[11px] text-slate-400">
                  <span className="font-semibold">📞 {member.phone || 'N/A'}</span>
                  <button 
                    onClick={() => handleRemoveFromTeam(member.id_code)}
                    className="text-red-500 font-bold uppercase tracking-widest hover:underline"
                  >
                    Remover da Equipe
                  </button>
                </div>
              </div>
            ))}

            {team.length === 0 && (
              <div className="text-center py-20 px-8">
                <span className="material-symbols-outlined text-[64px] text-slate-300 dark:text-white/10 mb-4">group_off</span>
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Nenhum voluntário na sua equipe ainda.</p>
                <p className="text-[11px] text-slate-400 mt-2">As missões aceitas aparecerão aqui agrupadas por usuário.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNavShelter />
    </main>
  )
}
