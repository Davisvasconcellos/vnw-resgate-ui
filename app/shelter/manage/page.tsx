'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import CapacityBar from '@/components/ui/CapacityBar'
import { useSearchParams, useRouter } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'
import AppHeader from '@/components/headers/AppHeader'
import BottomNavShelter from '@/components/BottomNavShelter'

import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store'
import { fetchShelterEntries, processEntryStatus } from '@/store/slices/sheltersSlice'
import { api } from '@/services/api'

type EntryStatus = 'request' | 'incoming' | 'present' | 'left'

interface Entry {
  id_code: string
  name: string
  phone: string
  people: number
  status: EntryStatus
  updatedAt?: string
  assumeMessage?: string
}

function ShelterManageContent() {
  const { t, language } = useI18n()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const profile = useSelector((state: RootState) => state.auth.profile)
  const shelterIdCode = profile?.managed_shelters?.[0]?.id_code || null
  const [loading, setLoading] = useState(true)

  const entriesRaw = useSelector((state: RootState) => state.shelters.entries)
  
  // Mapping entries for frontend compat e fallback
  const entries: Entry[] = entriesRaw.map((e: any) => ({
    id_code: e.id_code || e.id,
    name: e.name,
    phone: e.phone,
    people: e.people || e.people_count || 1,
    status: e.status,
    updatedAt: e.updatedAt || t('shelterManage.recent'),
    assumeMessage: e.assume_message || e.assumeMessage
  }))

  const [shelter, setShelter] = useState({
    name: 'Abrigo (Carregando...)',
    capacity: 300,
    occupied: 0,
    phone: '(48) 3251-9000',
  })
  
  // Tabs/Filters
  const [activeTab, setActiveTab] = useState<EntryStatus>('present')
  const [search, setSearch] = useState('')

  // Modals
  const [showCheckinModal, setShowCheckinModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
  
  // Assumir form properties
  const [assuming, setAssuming] = useState(false)
  const [assumeMessage, setAssumeMessage] = useState('')

  // Manual checkin form
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [people, setPeople] = useState(1)

  const available = shelter.capacity - shelter.occupied

  useEffect(() => {
    if (!profile) return;
    if (!shelterIdCode) {
        router.push('/onboarding?offer=shelter')
    }
  }, [profile, shelterIdCode, router])

  useEffect(() => {
    if (!shelterIdCode) return

    setLoading(true)
    // Carregar os dados (Entries) baseados no ID do abrigo
    dispatch(fetchShelterEntries(shelterIdCode))
    
    // Fetch meta dados do shelter
    api.get(`/shelters/${shelterIdCode}`).then(res => {
      if(res.data.data) {
        setShelter({
           name: res.data.data.name,
           capacity: res.data.data.capacity,
           occupied: res.data.data.occupied,
           phone: res.data.data.phone || '(48) 3251-9000'
        })
      }
    }).catch(err => {
      console.warn("Falha ao carregar metadados do abrigo", err.message)
    }).finally(() => setLoading(false))
  }, [dispatch, shelterIdCode])

  useEffect(() => {
    // Escuta evento customizado da bottom nav
    const handleOpenCheckin = () => setShowCheckinModal(true)
    window.addEventListener('open-manual-checkin', handleOpenCheckin)
    
    // Escuta query param (ex: caso venha do dashboard)
    if (searchParams.get('action') === 'checkin') {
      setShowCheckinModal(true)
      window.history.replaceState({}, '', '/shelter/manage')
    }

    return () => window.removeEventListener('open-manual-checkin', handleOpenCheckin)
  }, [searchParams])

  const handleManualCheckin = async () => {
    if (!name.trim()) return
    
    try {
      await api.post(`/shelters/${shelterIdCode}/entries`, {
        name: name.trim(),
        phone: phone.trim() || t('shelterManage.notInformed'),
        people_count: people,
        status: 'present'
      })
      // Recarrega lista apos criacao
      dispatch(fetchShelterEntries(shelterIdCode))
    } catch(err) {
      console.warn("API Offline: manual checkin fallback")
    }

    setShelter((s) => ({ ...s, occupied: Math.min(s.capacity, s.occupied + people) }))
    setName('')
    setPhone('')
    setPeople(1)
    setShowCheckinModal(false)
  }

  const changeStatus = async (entry: Entry, newStatus: EntryStatus, extraData?: any) => {
    // Otimista: ajusta a tela na hora
    if (entry.status === 'present' && newStatus !== 'present') {
      setShelter((s) => ({ ...s, occupied: Math.max(0, s.occupied - entry.people) }))
    }
    if (entry.status !== 'present' && newStatus === 'present') {
      setShelter((s) => ({ ...s, occupied: Math.min(s.capacity, s.occupied + entry.people) }))
    }

    // Dispara para o backend
    dispatch(processEntryStatus({ id_code: shelterIdCode, entry_id: entry.id_code, status: newStatus }))

    setSelectedEntry(null)
    setAssuming(false)
    setAssumeMessage('')
  }

  const handleAssume = () => {
    changeStatus(selectedEntry!, 'incoming', { assumeMessage })
  }

  const filteredEntries = entries
    .filter((e) => e.status === activeTab)
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.phone.includes(search))

  const countByStatus = (status: EntryStatus) => entries.filter((e) => e.status === status).length

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
              {t('shelterManage.title')}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-slate-500 dark:text-slate-400 font-body text-sm font-bold uppercase tracking-wider">
                {shelter.name}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="px-5 pb-8 space-y-6 max-w-2xl mx-auto w-full">
        {/* Capacity dashboard element */}
        <div className="bg-surface-container-lowest dark:bg-white/5 rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10 dark:border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-[10px] font-extrabold text-outline uppercase tracking-[0.2em] mb-2">{t('shelterManage.labelCapacity')}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-on-surface dark:text-white font-headline tracking-tighter">{shelter.occupied}</span>
                <span className="text-outline dark:text-slate-500 text-2xl font-bold">/ {shelter.capacity}</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${available <= 10 ? 'bg-error/10 text-error border-error/20' : 'bg-secondary/10 text-secondary border-secondary/20'}`}>
                <span className={`w-2 h-2 rounded-full ${available <= 10 ? 'bg-error animate-pulse' : 'bg-secondary'}`} />
                {available} {t('shelterManage.slots')}
              </div>
              <p className="text-[10px] text-outline-variant font-bold mt-2 uppercase tracking-wider">{t('shelterManage.available')}</p>
            </div>
          </div>
          
          <div className="mt-8">
            <CapacityBar current={shelter.occupied} total={shelter.capacity} />
          </div>
        </div>



          {/* Tab Badges */}
          <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 scrollbar-hide shrink-0">
            {[
              { id: 'request', label: t('shelterManage.tabs.request'), icon: 'notifications_active', count: countByStatus('request'), color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
              { id: 'incoming', label: t('shelterManage.tabs.incoming'), icon: 'directions_walk', count: countByStatus('incoming'), color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
              { id: 'present', label: t('shelterManage.tabs.present'), icon: 'house', count: countByStatus('present'), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
              { id: 'left', label: t('shelterManage.tabs.left'), icon: 'logout', count: countByStatus('left'), color: 'text-slate-500', bg: 'bg-slate-100', border: 'border-slate-200' },
            ].map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as EntryStatus)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border shrink-0 transition-all ${
                    isActive ? `${tab.bg} ${tab.border} shadow-sm` : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 opacity-70'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${isActive ? tab.color : 'text-slate-400'}`} style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}>
                    {tab.icon}
                  </span>
                  <span className={`text-xs font-bold ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                    {tab.label} ({tab.count})
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search */}
          <div className="relative shrink-0">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('shelterManage.search')}
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 pl-10 pr-4 py-3 rounded-xl text-sm dark:text-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredEntries.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-10">{t('shelterManage.empty')}</p>
            ) : (
              filteredEntries.map((entry) => (
                <button
                  key={entry.id_code}
                  onClick={() => {

                    setSelectedEntry(entry)
                    setAssuming(false)
                    setAssumeMessage('')
                  }}
                  className="w-full text-left flex items-start gap-3 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-transform"
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${
                    entry.status === 'request' ? 'bg-orange-50 text-orange-600' :
                    entry.status === 'incoming' ? 'bg-blue-50 text-blue-600' :
                    entry.status === 'present' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `'FILL' 1` }}>person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-800 dark:text-white text-sm leading-tight truncate">{entry.name}</p>
                      <span className="text-[10px] font-bold text-slate-400 shrink-0">{entry.updatedAt}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">phone</span>
                      {entry.phone}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md text-[11px] font-semibold text-slate-600 border border-slate-100">
                      <span className="material-symbols-outlined text-[12px]">group</span>
                      {entry.people === 1 ? t('shelterManage.person') : t('shelterManage.people').replace('{count}', entry.people.toString())}
                    </div>
                    {entry.assumeMessage && (
                      <p className="text-[11px] text-blue-600 mt-2 bg-blue-50 p-2 rounded-lg italic">"{entry.assumeMessage}"</p>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-slate-300 text-[20px] self-center">chevron_right</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Entry Action Modal Details */}
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedEntry(null)} />
            <div className="relative z-10 bg-white rounded-t-[2rem] px-5 pt-4 pb-32 reveal-pop">
              <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5 shrink-0" />
              
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 font-headline">{selectedEntry.name}</h2>
                <p className="text-sm text-slate-500 mt-1">{selectedEntry.phone}</p>
                <p className="text-sm text-slate-500 mt-0.5">{selectedEntry.people === 1 ? t('shelterManage.person') : t('shelterManage.people').replace('{count}', selectedEntry.people.toString())} — {selectedEntry.updatedAt}</p>
              </div>

              <div className="space-y-4">
                {selectedEntry.status === 'request' && !assuming && (
                  <button
                    onClick={() => setAssuming(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white text-base active:scale-[0.97] transition-all bg-blue-600 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)]"
                  >
                    <span className="material-symbols-outlined text-[20px]">directions_walk</span>
                    {t('shelterManage.assumeBtn')}
                  </button>
                )}

                {assuming && (
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 space-y-4">
                    <label className="text-xs font-bold uppercase tracking-wide text-slate-400 block">{t('shelterManage.assumeMsg')}</label>
                    <textarea 
                      value={assumeMessage}
                      onChange={(e) => setAssumeMessage(e.target.value)}
                      placeholder={t('shelterManage.assumePlace')}
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 outline-none resize-none h-20"
                    />
                    <button
                      onClick={handleAssume}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-bold text-white text-base active:scale-[0.97] transition-all bg-blue-600"
                    >
                      <span className="material-symbols-outlined text-[20px]">send</span>
                      {t('shelterManage.confirmBtn')}
                    </button>
                  </div>
                )}
                
                {/* Direto checkin caso a pessoa chegue correndo no abrigo, msm não assumida antes */}
                {(selectedEntry.status === 'request' || selectedEntry.status === 'incoming') && !assuming && (
                  <button
                    onClick={() => changeStatus(selectedEntry, 'present')}
                    disabled={available < selectedEntry.people}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white text-base active:scale-[0.97] transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #0D47A1, #1565C0)', boxShadow: '0 8px 24px -6px rgba(13,71,161,0.4)' }}
                  >
                    <span className="material-symbols-outlined text-[20px]">login</span>
                    {t('shelterManage.checkinBtn')}
                  </button>
                )}

                {selectedEntry.status === 'present' && (
                  <button
                    onClick={() => changeStatus(selectedEntry, 'left')}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-slate-700 bg-slate-100 text-base active:scale-[0.97] transition-all border border-slate-200"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    {t('shelterManage.checkoutBtn')}
                  </button>
                )}

                {(selectedEntry.status === 'left' || selectedEntry.status === 'present') && (
                  <button
                    onClick={() => changeStatus(selectedEntry, 'incoming')}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-slate-500 bg-transparent text-sm active:opacity-70 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">undo</span>
                    {t('shelterManage.undo')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Manual Check-in Modal */}
        {showCheckinModal && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCheckinModal(false)} />
            <div className="relative z-10 bg-white rounded-t-[2rem] px-5 pt-4 pb-32 reveal-pop max-h-[90vh] overflow-y-auto">
              <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5 shrink-0" />
              <h2 className="text-xl font-bold text-slate-800 font-headline mb-5">{t('shelterManage.manualCheckin')}</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('shelterManage.labels.name')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('shelterManage.labels.namePlace')}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 text-slate-800 font-semibold text-sm outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('shelterManage.labels.phone')}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(48) 99999-9999"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 text-slate-800 font-semibold text-sm outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('shelterManage.labels.peopleCount')}</label>
                  <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <button type="button" onClick={() => setPeople(Math.max(1, people - 1))} className="w-12 h-12 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 text-2xl active:scale-95 transition-transform shrink-0">−</button>
                    <div className="flex-1 text-center flex flex-col">
                      <span className="text-3xl font-bold text-slate-800 font-headline leading-none">{people}</span>
                      <span className="text-[10px] text-slate-400 mt-1">{people === 1 ? t('shelterManage.person') : t('shelterManage.people').replace('{count}', people.toString())}</span>
                    </div>
                    <button type="button" onClick={() => setPeople(Math.min(available, people + 1))} className="w-12 h-12 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 text-2xl active:scale-95 transition-transform shrink-0">+</button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleManualCheckin}
                    disabled={!name.trim()}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-white text-base font-headline active:scale-[0.97] transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #0D47A1, #1565C0)', boxShadow: '0 8px 24px -6px rgba(13,71,161,0.4)' }}
                  >
                    <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: `'FILL' 1` }}>fact_check</span>
                    {t('onboarding.submit')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      <BottomNavShelter />
    </main>
  )
}

export default function ShelterManagePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#0a1628] flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" /></div>}>
       <ShelterManageContent />
    </Suspense>
  )
}
