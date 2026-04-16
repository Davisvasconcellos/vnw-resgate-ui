'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import CapacityBar from '@/components/ui/CapacityBar'
import { useSearchParams } from 'next/navigation'
import { useI18n } from '@/components/i18n/I18nProvider'
import AppHeader from '@/components/headers/AppHeader'
import BottomNavShelterManage from '@/components/BottomNavShelterManage'

const INITIAL = {
  name: 'Ginásio Municipal Lauro Linhares',
  capacity: 300,
  occupied: 241,
  phone: '(48) 3251-9000',
}

type EntryStatus = 'request' | 'incoming' | 'present' | 'left'

interface Entry {
  id: string
  name: string
  phone: string
  people: number
  status: EntryStatus
  updatedAt: string
  assumeMessage?: string
}

const INITIAL_ENTRIES: Entry[] = [
  { id: 'req-1', name: 'Família Pereira (Enchente Centro)', phone: 'Desconhecido', people: 5, status: 'request', updatedAt: 'Agora' },
  { id: 'req-2', name: 'João Carlos', phone: '(48) 98888-1111', people: 1, status: 'request', updatedAt: '5 min' },
  { id: 'inc-1', name: 'Dona Maria e netos', phone: '(48) 97777-2222', people: 3, status: 'incoming', updatedAt: '10 min', assumeMessage: 'O resgate chegará em 10 minutos.' },
  { id: 'pr-1', name: 'Família Silva', phone: '(48) 99999-0000', people: 4, status: 'present', updatedAt: '18:30' },
  { id: 'pr-2', name: 'Ana Souza', phone: '(48) 91111-2222', people: 2, status: 'present', updatedAt: '19:05' },
  { id: 'lf-1', name: 'Carlos e amigos', phone: 'Sem celular', people: 3, status: 'left', updatedAt: 'Ontem' },
]

export default function ShelterManagePage() {
  const { t, language } = useI18n()
  const [shelter, setShelter] = useState(INITIAL)
  const [entries, setEntries] = useState<Entry[]>(INITIAL_ENTRIES)
  
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
  const searchParams = useSearchParams()

  useEffect(() => {
    // Escuta evento customizado da bottom nav
    const handleOpenCheckin = () => setShowCheckinModal(true)
    window.addEventListener('open-manual-checkin', handleOpenCheckin)
    
    // Escuta query param (ex: caso venha do dashboard)
    if (searchParams.get('action') === 'checkin') {
      setShowCheckinModal(true)
      // limpa query
      window.history.replaceState({}, '', '/shelter/manage')
    }

    return () => window.removeEventListener('open-manual-checkin', handleOpenCheckin)
  }, [searchParams])

  const getTime = () => new Date().toLocaleTimeString(language === 'pt-BR' ? 'pt-BR' : 'en-US', { hour: '2-digit', minute: '2-digit' })

  const handleManualCheckin = () => {
    if (!name.trim()) return
    const newEntry: Entry = {
      id: `m-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || 'Não informado',
      people,
      status: 'present',
      updatedAt: getTime(),
    }
    setEntries([newEntry, ...entries])
    setShelter((s) => ({ ...s, occupied: Math.min(s.capacity, s.occupied + people) }))
    setName('')
    setPhone('')
    setPeople(1)
    setShowCheckinModal(false)
  }

  const changeStatus = (entry: Entry, newStatus: EntryStatus, extraData?: any) => {
    if (entry.status === 'present' && newStatus !== 'present') {
      setShelter((s) => ({ ...s, occupied: Math.max(0, s.occupied - entry.people) }))
    }
    if (entry.status !== 'present' && newStatus === 'present') {
      setShelter((s) => ({ ...s, occupied: Math.min(s.capacity, s.occupied + entry.people) }))
    }

    setEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, status: newStatus, updatedAt: getTime(), ...extraData } : e))
    )
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
    <main className="min-h-screen bg-surface flex flex-col pb-44 pt-16">
      <AppHeader />

      <div className="px-5 pt-8 shrink-0 max-w-2xl mx-auto w-full">
        <section className="mb-8">
          <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight leading-tight">
            {t('shelterManage.title')}
          </h1>
          <p className="mt-2 text-on-surface-variant font-body text-base">
            {shelter.name}
          </p>
        </section>
      </div>

      <div className="px-5 pb-8 space-y-6 max-w-2xl mx-auto w-full">
        {/* Capacity dashboard element */}
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-8 shadow-sm border border-outline-variant/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-[10px] font-extrabold text-outline uppercase tracking-[0.2em] mb-2">{t('shelterManage.labelCapacity')}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-on-surface font-headline tracking-tighter">{shelter.occupied}</span>
                <span className="text-outline text-2xl font-bold">/ {shelter.capacity}</span>
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
                    isActive ? `${tab.bg} ${tab.border} shadow-sm` : 'bg-white border-slate-100 opacity-70'
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
              className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* List */}
          <div className="space-y-3">
            {filteredEntries.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-10">{t('shelterManage.empty')}</p>
            ) : (
              filteredEntries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => {
                    setSelectedEntry(entry)
                    setAssuming(false)
                    setAssumeMessage('')
                  }}
                  className="w-full text-left flex items-start gap-3 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-transform"
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
                      <p className="font-bold text-slate-800 text-sm leading-tight truncate">{entry.name}</p>
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
            <div className="relative z-10 bg-white rounded-t-[2rem] px-5 pt-4 pb-14 reveal-pop">
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
            <div className="relative z-10 bg-white rounded-t-[2rem] px-5 pt-4 pb-14 reveal-pop max-h-[90vh] overflow-y-auto">
              <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5 shrink-0" />
              <h2 className="text-xl font-bold text-slate-800 font-headline mb-5">{t('shelterManage.manualCheckin')}</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.shelterForm.name')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('onboarding.shelterForm.namePlace')}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 text-slate-800 font-semibold text-sm outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('request.phone')}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(48) 99999-9999"
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3.5 text-slate-800 font-semibold text-sm outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('onboarding.boatForm.spots')}</label>
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
      <BottomNavShelterManage onCheckinClick={() => setShowCheckinModal(true)} />
    </main>
  )
}
