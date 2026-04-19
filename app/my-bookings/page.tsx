'use client'

import { useEffect, useState } from 'react'
import AppHeader from '@/components/headers/AppHeader'
import BottomNav from '@/components/BottomNav'
import { getLocalRequests, LocalRequest } from '@/services/fingerprint'
import { api } from '@/services/api'
import { useI18n } from '@/components/i18n/I18nProvider'
import Link from 'next/link'

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<LocalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useI18n()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
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
        // Mas Local mantém pedidos 'pending' que ainda não subiram
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
            // Atualiza o local com dados frescos da API
            const idx = merged.indexOf(exists)
            merged[idx] = { ...exists, status: item.status, sync_status: 'synced' }
          }
        })

        // Ordenar por data (mais recentes primeiro)
        merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setRequests(merged)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/10 text-blue-500'
      case 'in_progress': return 'bg-orange-500/10 text-orange-500'
      case 'closed': return 'bg-emerald-500/10 text-emerald-500'
      case 'pending': return 'bg-slate-500/10 text-slate-500'
      default: return 'bg-slate-100 text-slate-400'
    }
  }

  return (
    <div className="bg-slate-50 dark:bg-[#0a1628] min-h-screen pb-32 transition-colors">
      <AppHeader />
      
      <main className="pt-24 px-6 max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black font-headline tracking-tighter text-slate-900 dark:text-white uppercase">
            {t('nav.bookings')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium italic">
            Histórico e acompanhamento das suas solicitações.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">Buscando dados...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10 p-10">
            <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-300">
               <span className="material-symbols-outlined text-[40px]">history</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nenhum pedido encontrado</h3>
            <p className="text-sm text-slate-500 max-w-[240px] mt-2">Você ainda não realizou solicitações de ajuda neste dispositivo ou conta.</p>
            <Link href="/request" className="mt-8 px-8 py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
               Solicitar agora
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div 
                key={req.local_id} 
                className="bg-white dark:bg-[#0d2247] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
              >
                {/* Indicador de Sincronização */}
                {req.sync_status === 'pending' && (
                  <div className="absolute top-0 right-0 p-3">
                     <span className="flex items-center gap-1 text-[8px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-full uppercase">
                       <span className="material-symbols-outlined text-[10px] animate-pulse">cloud_off</span>
                       Local
                     </span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className={`material-symbols-outlined text-[18px] ${getStatusColor(req.status).split(' ')[1]}`}>
                         {req.type === 'rescue' ? 'sos' : req.type === 'food' ? 'restaurant' : req.type === 'shelter' ? 'house' : 'medical_services'}
                       </span>
                       <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${getStatusColor(req.status)}`}>
                         {req.status === 'open' ? 'Aberto' : req.status === 'pending' ? 'Pendente' : 'Concluído'}
                       </span>
                    </div>
                    
                    <h2 className="font-headline font-black text-lg text-slate-900 dark:text-white leading-tight">
                      {req.type === 'rescue' ? 'Resgate / SOS' : req.type === 'shelter' ? 'Abrigo' : 'Assistência'}
                    </h2>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 italic">
                       &quot;{req.description}&quot;
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 items-center text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {new Date(req.created_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        <span className="max-w-[150px] truncate">{req.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${req.urgency === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
                       {req.urgency === 'high' ? 'Crítico' : 'Normal'}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 dark:border-white/5 flex justify-end">
                   <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver detalhes
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
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
