'use client'

import { useEffect, useState } from 'react'
import AppHeader from '@/components/headers/AppHeader'
import BottomNav from '@/components/BottomNav'
import { getLocalRequests, LocalRequest, syncPendingRequests } from '@/services/fingerprint'
import { api } from '@/services/api'
import { useI18n } from '@/components/i18n/I18nProvider'
import Link from 'next/link'

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<LocalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const { t } = useI18n()

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')

  const loadData = async () => {
    setLoading(true)
    
    // 1. Tentar sincronizar pedidos pendentes primeiro (Push)
    setSyncing(true)
    await syncPendingRequests()
    setSyncing(false)

    try {
      const localData = getLocalRequests()
      let apiData: any[] = []

      // Se estiver logado, buscar dados da API
      const storedUser = localStorage.getItem('vnw_user')
      if (storedUser) {
        try {
          const res = await api.get('/requests/my')
          apiData = res.data.data || []
        } catch (e) {
          console.error('Erro ao buscar pedidos da API, usando locais.', e)
        }
      }

      // Merge Inteligente: API ganha de Local se houver o mesmo id_code
      const merged: LocalRequest[] = [...localData]

      apiData.forEach((item: any) => {
        const exists = merged.find(m => m.id_code === item.id_code)
        if (!exists) {
          merged.push({
            id_code: item.id_code,
            local_id: `api-${item.id_code}`,
            type: item.type,
            description: item.description,
            status: item.status,
            urgency: item.urgency,
            created_at: item.created_at,
            sync_status: 'synced',
            address: item.address
          })
        } else {
          const idx = merged.indexOf(exists)
          merged[idx] = { ...exists, status: item.status, sync_status: 'synced' }
        }
      })

      merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setRequests(merged)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-slate-500/10 text-slate-500'
      case 'viewed': return 'bg-blue-500/10 text-blue-500'
      case 'attending': return 'bg-orange-500/10 text-orange-500'
      case 'resolved': return 'bg-emerald-500/10 text-emerald-500'
      default: return 'bg-slate-100 text-slate-400'
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-[#0a1628] min-h-screen pb-32 transition-colors">
      <AppHeader />
      
      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black font-headline tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
              Meus Pedidos
            </h1>
            
            {/* Resumo de Atividade (Novo) */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/10">
                 <span className="material-symbols-outlined text-[16px] text-blue-600">assignment_turned_in</span>
                 <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
                   {requests.filter(r => r.status !== 'resolved' && r.status !== 'canceled').length} Ativos
                 </span>
              </div>
              <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/10 animate-in fade-in zoom-in duration-500">
                 <span className="material-symbols-outlined text-[16px] text-red-600 font-bold">notifications_active</span>
                 <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">
                   {requests.filter(r => r.status === 'attending').length} Notificações
                 </span>
              </div>
            </div>
          </div>
          <button 
            onClick={loadData}
            disabled={loading}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-90 transition-all shadow-sm"
          >
            <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>refresh</span>
          </button>
        </header>

        {/* Tabs Control (Novo) */}
        <div className="bg-slate-200/50 dark:bg-white/5 p-1 rounded-3xl mb-8 flex shadow-inner max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'active' 
                ? 'bg-white dark:bg-primary text-blue-700 dark:text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            Em Aberto ({requests.filter(r => r.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'history' 
                ? 'bg-white dark:bg-primary text-blue-700 dark:text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            Histórico ({requests.filter(r => r.status === 'resolved').length})
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sincronizando dados...</p>
          </div>
        ) : requests.filter(r => activeTab === 'active' ? r.status !== 'resolved' : r.status === 'resolved').length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-white/5 p-10">
            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-200">
               <span className="material-symbols-outlined text-[48px]">receipt_long</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sem pedidos aqui</h3>
            <p className="text-xs text-slate-500 max-w-[200px] mt-2 font-medium">
               {activeTab === 'active' ? 'Você não tem solicitações ativas no momento.' : 'Seu histórico está limpo.'}
            </p>
            <Link href="/request" className="mt-8 px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 active:scale-95 transition-all">
               Pedir Ajuda
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests
              .filter(r => activeTab === 'active' ? r.status !== 'resolved' : r.status === 'resolved')
              .map((req) => (
              <div 
                key={req.local_id} 
                className="bg-white dark:bg-[#0d2247] border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-7 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
              >
                {/* Sync Badge */}
                {req.sync_status === 'pending' && (
                  <div className="absolute top-0 right-0 p-4">
                     <span className="flex items-center gap-1.5 text-[9px] font-black bg-orange-500 text-white px-3 py-1 rounded-full uppercase shadow-lg shadow-orange-500/20">
                       <span className="material-symbols-outlined text-[12px] animate-pulse">cloud_off</span>
                       Offline
                     </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(req.status)} shadow-inner`}>
                          <span className="material-symbols-outlined text-[28px]">
                            {req.type === 'rescue' ? 'sos' : req.type === 'food' ? 'restaurant' : req.type === 'shelter' ? 'house' : 'medical_services'}
                          </span>
                       </div>
                       <div>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${getStatusColor(req.status)}`}>
                            {req.status === 'pending' ? 'Pendente' : req.status === 'attending' ? 'Atendimento' : req.status === 'resolved' ? 'Resolvido' : req.status}
                          </span>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                             Cod: {req.id_code ? req.id_code.split('-')[0].toUpperCase() : 'PENDENTE'}
                          </p>
                       </div>
                    </div>
                    
                    <h2 className="font-headline font-black text-xl text-slate-900 dark:text-white tracking-tight">
                       {req.type === 'rescue' ? 'Socorro Urgente' : req.type === 'shelter' ? 'Abrigo / Acolhimento' : 'Apoio Gerais'}
                    </h2>
                    
                    <div className="mt-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl italic text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-white/5">
                       &quot;{req.description || 'Sem descrição'}&quot;
                    </div>

                    {/* Mensagem do Salvador (Novo) */}
                    {(req as any).volunteer_message && (
                       <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-l-4 border-blue-500 animate-in slide-in-from-left-2 duration-300">
                          <div className="flex items-center gap-2 mb-2">
                             <span className="material-symbols-outlined text-[14px] text-blue-600 font-bold">chat_bubble</span>
                             <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Resposta do Salvador</span>
                          </div>
                          <p className="text-[11px] font-bold text-blue-800 dark:text-blue-200 leading-relaxed italic">
                             &quot;{(req as any).volunteer_message}&quot;
                          </p>
                       </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-5 items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                        {new Date(req.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 max-w-[200px] truncate">
                        <span className="material-symbols-outlined text-[16px]">map</span>
                        {req.address}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                   <div className={`flex items-center gap-1.5 ${req.urgency === 'high' ? 'text-red-500' : 'text-slate-400'}`}>
                      <span className="material-symbols-outlined text-sm font-bold">priority_high</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {req.urgency === 'high' ? 'Urgência Crítica' : 'Normal'}
                      </span>
                   </div>
                   <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary group-hover:gap-3 transition-all">
                      Acompanhar
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
