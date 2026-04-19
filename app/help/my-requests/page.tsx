'use client'

import { useEffect, useState } from 'react'
import AppHeader from '@/components/headers/AppHeader'
import BottomNav from '@/components/BottomNav'
import { getLocalRequests, LocalRequest, markAsRead, syncPendingRequests } from '@/services/fingerprint'
import { api } from '@/services/api'
import { useI18n } from '@/components/i18n/I18nProvider'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<LocalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const { t } = useI18n()

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active')
  const [selectedRequest, setSelectedRequest] = useState<LocalRequest | null>(null)
  const [confirmingResolve, setConfirmingResolve] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setSyncing(true)
    await syncPendingRequests()
    setSyncing(false)

    try {
      const localData = getLocalRequests()
      let apiData: any[] = []

      const storedUser = localStorage.getItem('vnw_user')
      if (storedUser) {
        try {
          const res = await api.get('/requests/my')
          apiData = res.data.data || []
        } catch (e) {
          console.error('Erro ao buscar pedidos da API, usando locais.', e)
        }
      }

      const merged: LocalRequest[] = [...localData]

      apiData.forEach((item: any) => {
        const exists = merged.find(m => m.id_code === item.id_code)
        if (!exists) {
            merged.push({
              ...item,
              local_id: `api-${item.id_code}`,
              sync_status: 'synced'
            })
          } else {
            const idx = merged.indexOf(exists)
            merged[idx] = { 
              ...exists, 
              ...item,
              sync_status: 'synced' 
            }
          }
      })

      merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setRequests(merged)
      
      merged.forEach(r => {
        if (r.status === 'attending' && r.id_code) {
          markAsRead(r.id_code);
        }
      });
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleResolve = async (id_code: string) => {
    try {
      setLoading(true)
      await api.put(`/requests/${id_code}/status`, { status: 'resolved' })
      toast.success(t('myRequestsPage.toastSuccess'))
      setSelectedRequest(null)
      setConfirmingResolve(false)
      loadData()
    } catch (e) {
      toast.error(t('myRequestsPage.toastError'))
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-slate-500/10 text-slate-500'
      case 'attending': return 'bg-orange-500/10 text-orange-500 font-bold'
      case 'resolved': return 'bg-emerald-500/10 text-emerald-500'
      default: return 'bg-slate-100 text-slate-400'
    }
  }

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'rescue': return t('request.rescue');
      case 'food': return t('request.food');
      case 'shelter': return t('request.shelter');
      case 'medical': return t('request.medical');
      case 'transport': return t('request.transport');
      default: return t('request.type');
    }
  }

  return (
    <div className="bg-[#FBFCFE] dark:bg-[#0a1628] min-h-screen pb-32 transition-colors">
      <AppHeader />
      
      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black font-headline tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
            {t('myRequestsPage.title')}
          </h1>
          <button 
            onClick={loadData}
            disabled={loading}
            className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 active:rotate-180 transition-all duration-500"
          >
            <span className={`material-symbols-outlined text-[20px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
          </button>
        </header>

        {/* Tabs Mini */}
        <div className="bg-slate-100 dark:bg-white/5 p-1 rounded-2xl mb-8 flex max-w-[280px]">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'active' 
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-400'
            }`}
          >
            {t('myRequestsPage.active')} ({requests.filter(r => r.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'history' 
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-400'
            }`}
          >
            {t('myRequestsPage.history')} ({requests.filter(r => r.status === 'resolved').length})
          </button>
        </div>

        {loading && requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-400 border-t-transparent mb-4" />
          </div>
        ) : requests.filter(r => activeTab === 'active' ? r.status !== 'resolved' : r.status === 'resolved').length === 0 ? (
          <div className="py-20 text-center opacity-30">
             <span className="material-symbols-outlined text-[48px] mb-2">inbox</span>
             <p className="text-[10px] font-black uppercase tracking-widest">{t('myRequestsPage.empty')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests
              .filter(r => activeTab === 'active' ? r.status !== 'resolved' : r.status === 'resolved')
              .map((req) => (
              <div 
                key={req.local_id} 
                onClick={() => {
                  setSelectedRequest(req)
                  setConfirmingResolve(false)
                }}
                className="bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-3xl p-5 shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${getStatusColor(req.status)}`}>
                         <span className="material-symbols-outlined text-[20px]">
                           {req.type === 'rescue' ? 'sos' : req.type === 'food' ? 'restaurant' : req.type === 'shelter' ? 'house' : 'medical_services'}
                         </span>
                      </div>
                      <span className="text-sm font-black dark:text-white uppercase tracking-tighter">
                         {getTypeLabel(req.type)}
                      </span>
                   </div>
                   <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${getStatusColor(req.status)}`}>
                      {req.status === 'pending' ? 'Pendente' : req.status === 'attending' ? 'Em atendimento' : 'Resolvido'}
                   </span>
                </div>

                <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2 mb-3 px-1">
                   {req.description || t('myRequestsPage.noDescription')}
                </p>

                <div className="flex items-center justify-between px-1">
                   <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                      {new Date(req.created_at).toLocaleDateString()}
                   </span>
                   {req.status === 'attending' && (
                      <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                   )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* DETAIL DRAWER / MODAL */}
      {selectedRequest && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" 
            onClick={() => setSelectedRequest(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[110] bg-white dark:bg-[#0d2247] rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500 max-w-2xl mx-auto">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-8" />
            
            <header className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getStatusColor(selectedRequest.status)} shadow-lg shadow-black/5`}>
                  <span className="material-symbols-outlined text-[32px]">
                    {selectedRequest.type === 'rescue' ? 'sos' : selectedRequest.type === 'food' ? 'restaurant' : 'volunteer_activism'}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter leading-none">
                    {getTypeLabel(selectedRequest.type)}
                  </h2>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(selectedRequest.created_at).toLocaleDateString()} às {new Date(selectedRequest.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </header>

            <div className="space-y-6">
              <div className="px-1">
                <p className="text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest mb-2">{t('myRequestsPage.request')}</p>
                <p className="text-[15px] font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  &quot;{selectedRequest.description}&quot;
                </p>
              </div>

              <div className="flex gap-6 px-1 py-4 border-y border-slate-50 dark:border-white/5">
                <div>
                  <p className="text-[9px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest mb-1">{t('myRequestsPage.location')}</p>
                  <p className="text-[11px] font-bold dark:text-white">{selectedRequest.address}</p>
                </div>
                <div className="shrink-0">
                  <p className="text-[9px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest mb-1">{t('myRequestsPage.impact')}</p>
                  <p className="text-[11px] font-bold dark:text-white">{t('myRequestsPage.peopleCount').replace('{count}', String(selectedRequest.people_count || 1))}</p>
                </div>
              </div>

              {/* Salvador Section */}
              {selectedRequest.status === 'attending' && selectedRequest.volunteer && (
                <div className="pt-2 animate-in slide-in-from-bottom-2">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 px-1">A caminho</p>
                  <div className="flex items-center justify-between bg-blue-500/5 p-4 rounded-[2rem] border border-blue-500/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-blue-500 shadow-md">
                        <img src={selectedRequest.volunteer?.avatar_url || 'https://ui-avatars.com/api/?name=' + selectedRequest.volunteer?.name} alt="Salvador" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-black dark:text-white">{selectedRequest.volunteer?.name}</p>
                          <span className="material-symbols-outlined text-blue-500 text-sm font-black" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">Pronto para apoiar</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {selectedRequest.volunteer?.phone && (
                        <>
                          <a 
                            href={`tel:${selectedRequest.volunteer.phone.replace(/\D/g, '')}`}
                            className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center text-slate-600 dark:text-white active:scale-90 transition-all border border-slate-200 dark:border-white/5"
                          >
                            <span className="material-symbols-outlined text-[20px]">call</span>
                          </a>
                          <a 
                            href={`https://wa.me/55${selectedRequest.volunteer.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 active:scale-90 transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {selectedRequest.volunteer_message && (
                    <div className="mt-4 px-1">
                      <p className="text-[10px] font-black text-slate-300 dark:text-white/20 uppercase tracking-widest mb-2">{t('myRequestsPage.volunteerMsg')}</p>
                      <p className="text-sm font-bold italic leading-relaxed text-blue-600 dark:text-blue-400">
                        &quot;{selectedRequest.volunteer_message}&quot;
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedRequest.status !== 'resolved' && (
                <div className="pt-6">
                  {confirmingResolve ? (
                    <div className="flex gap-2 animate-in slide-in-from-right-4">
                      <button 
                        onClick={() => setConfirmingResolve(false)}
                        className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                      >
                        {t('myRequestsPage.cancel')}
                      </button>
                      <button 
                        onClick={() => selectedRequest.id_code && handleResolve(selectedRequest.id_code)}
                        className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20"
                      >
                        {t('myRequestsPage.resolvedConfirm')}
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setConfirmingResolve(true)}
                      className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                      {t('myRequestsPage.markAsResolved')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  )
}
