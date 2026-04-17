'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/services/api'
import { getMyRequests } from '@/services/fingerprint'
import AppHeader from '@/components/headers/AppHeader'
import { useI18n } from '@/components/i18n/I18nProvider'

interface RequestStatus {
  id_code: string
  type: string
  status: 'pending' | 'viewed' | 'attending' | 'resolved'
  created_at: string
  is_verified?: boolean
  volunteer_name?: string
  volunteer_phone?: string
}

export default function MyRequestsPage() {
  const { t } = useI18n()
  const [requests, setRequests] = useState<RequestStatus[]>([])
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')

  const fetchStatuses = async () => {
    setLoading(true)
    const codes = getMyRequests()
    if (codes.length === 0) {
      setRequests([])
      setLoading(false)
      return
    }

    try {
      const res = await api.get(`/requests?id_codes=${codes.join(',')}`)
      if (res.data.success) {
        setRequests(res.data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatuses()
  }, [])

  const filteredRequests = requests.filter(r => 
    activeTab === 'active' ? r.status !== 'resolved' : r.status === 'resolved'
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rescue': return '#ba1a1a'
      case 'shelter': return '#1565C0'
      case 'medical': return '#C62828'
      case 'food': return '#E65100'
      case 'transport': return '#0277BD'
      default: return '#1565C0'
    }
  }

  const getRequestInfo = (req: RequestStatus & { sub_type?: string, description?: string }) => {
    switch (req.type) {
      case 'rescue': return { label: 'Resgate Urgente', icon: 'sos' }
      case 'shelter': return { label: 'Solicitação de Abrigo', icon: 'house' }
      case 'medical': return { label: 'Auxílio Médico', icon: 'medical_services' }
      case 'food': return { label: 'Suprimentos / Alimento', icon: 'restaurant' }
      case 'transport': return { label: 'Transporte', icon: 'directions_car' }
      case 'volunteer': return { label: 'Pedido de Voluntários', icon: 'groups' }
      default: return { label: 'Pedido de Ajuda', icon: 'volunteer_activism' }
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a1628] pb-32 transition-colors">
      <div className="bg-white dark:bg-[#0d2247] pt-16 pb-6 px-4 border-b border-slate-100 dark:border-white/5">
        <div className="max-w-2xl mx-auto space-y-4">
           {/* Navigation / Back */}
          <Link href="/help?module=help" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#0d2247] dark:text-white opacity-60">Central de Ajuda</span>
          </Link>

          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold font-headline text-slate-900 dark:text-white tracking-tight">
                Minhas Solicitações
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Acompanhe seus pedidos e histórico de suporte.</p>
            </div>
            <button 
              onClick={fetchStatuses}
              disabled={loading}
              className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 active:rotate-180 transition-transform duration-500"
            >
              <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>refresh</span>
            </button>
          </header>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Tabs Control */}
        <div className="bg-white dark:bg-white/5 p-1 rounded-3xl border border-slate-100 dark:border-white/5 flex shadow-sm max-w-sm mx-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'active' 
                ? 'bg-blue-50 text-blue-700 dark:bg-primary dark:text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            Aguardando ({requests.filter(r => r.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'history' 
                ? 'bg-blue-50 text-blue-700 dark:bg-primary dark:text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            Histórico ({requests.filter(r => r.status === 'resolved').length})
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-40 bg-white dark:bg-white/5 rounded-[2rem] animate-pulse border border-slate-100 dark:border-white/5" />
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-10 text-center border border-slate-100 dark:border-white/10 shadow-sm mt-8">
            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-slate-300 text-4xl">inventory_2</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Nenhum pedido aqui</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium px-4">
               {activeTab === 'active' 
                 ? 'Você não tem solicitações ativas no momento.' 
                 : 'Seu histórico está vazio.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req: any) => {
              const info = getRequestInfo(req);
              const color = getTypeColor(req.type);
              return (
                <div 
                  key={req.id_code}
                  className="bg-white dark:bg-white/5 rounded-[2.2rem] p-6 border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden group"
                >
                  {/* Lateral Indicator Bar */}
                  <div className="absolute right-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2.5" style={{ background: color }} />

                  {/* Header: Icon + Title/Badges */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 shadow-inner group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[28px]" style={{ color: color }}>
                        {info.icon}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: color }}>
                          {req.type.toUpperCase()}
                        </span>
                        {req.status === 'pending' && (
                          <div className="flex items-center gap-1 text-red-500 animate-pulse">
                            <span className="material-symbols-outlined text-xs font-bold">emergency</span>
                            <span className="text-[8px] font-black uppercase tracking-widest">Aguardando</span>
                          </div>
                        )}
                        {req.is_verified && (
                          <div className="flex items-center gap-1 text-blue-500">
                            <span className="material-symbols-outlined text-[10px] font-bold">verified</span>
                            <span className="text-[8px] font-black uppercase tracking-widest">Verificado</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-extrabold text-xl text-slate-900 dark:text-white font-headline leading-tight">
                        {info.label}
                      </h3>
                      {req.sub_type && (
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">🏷️ {req.sub_type}</p>
                      )}
                    </div>
                  </div>

                  {/* Body Content: Spans full width */}
                  <div className="space-y-4">
                    {req.description && (
                       <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 italic text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          "{req.description}"
                       </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-50 dark:border-white/5">
                       <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                          <span className="material-symbols-outlined text-base">location_on</span>
                          <span className="font-semibold truncate">{req.address || 'Localização não informada'}</span>
                       </div>
                       <div className="flex items-center gap-2 text-slate-400 text-xs">
                          <span className="material-symbols-outlined text-base">event</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                             Cod: {req.id_code.split('-')[0].toUpperCase()} • {new Date(req.created_at).toLocaleDateString()}
                          </span>
                       </div>
                    </div>

                    {req.status === 'attending' && (
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                              <span className="material-symbols-outlined text-[20px]">support_agent</span>
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Equipe em campo</p>
                              <p className="text-xs font-extrabold text-slate-700 dark:text-slate-200">Em atendimento</p>
                            </div>
                         </div>
                         <Link href={`tel:${req.volunteer_phone || ''}`} className="flex items-center gap-3 px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                           <span className="material-symbols-outlined text-sm font-bold">call</span>
                           Contatar
                         </Link>
                      </div>
                    )}

                    {req.status === 'pending' && (
                      <div className="pt-2">
                         <div className="flex items-center justify-between mb-2">
                           <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Buscando equipe...</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status: Pendente</span>
                         </div>
                         <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 animate-pulse" style={{ width: '40%' }} />
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="p-6 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 text-center opacity-70">
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-tighter">
            Estes registros são temporários e locais. 
            Mantenha este aparelho com bateria para atualizações.
          </p>
        </div>
      </div>
    </main>
  )
}
