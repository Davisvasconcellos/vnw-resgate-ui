'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import AppHeader from '@/components/headers/AppHeader'
import BottomNavMissing from '@/components/BottomNavMissing'

interface MissingPerson {
  id: string
  name: string
  age: number
  lastSeen: string
  description: string
  status: 'missing' | 'found'
  reporterName: string
  reporterPhone: string
  dateReported: string
}

const MOCK_DATA: MissingPerson[] = [
  {
    id: '1',
    name: 'João Pedro Silva',
    age: 8,
    lastSeen: 'Rua das Gaivotas, perto do Mercado Central',
    description: 'Camiseta azul e bermuda vermelha. Se perdeu durante o nivelamento da água ontem.',
    status: 'missing',
    reporterName: 'Maria Silva (Mãe)',
    reporterPhone: '(48) 99999-1111',
    dateReported: 'Ontem, 16:30'
  },
  {
    id: '2',
    name: 'Dona Helena Souza',
    age: 72,
    lastSeen: 'Abrigo Ginásio Municipal',
    description: 'Cabelos brancos, veste casaco verde. Estava no abrigo mas saiu e não retornou.',
    status: 'missing',
    reporterName: 'Carlos Souza',
    reporterPhone: '(48) 98888-2222',
    dateReported: 'Hoje, 08:15'
  },
  {
    id: '3',
    name: 'Tiago Alves',
    age: 34,
    lastSeen: 'Morro das Pedras',
    description: 'Sem contato celular há dois dias.',
    status: 'found',
    reporterName: 'Ana Alves',
    reporterPhone: '(48) 97777-3333',
    dateReported: 'Há 3 dias'
  }
]

export default function MissingPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<'missing' | 'found'>('missing')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const handleOpenAdd = () => setShowAddModal(true)
    window.addEventListener('open-add-missing', handleOpenAdd)
    return () => window.removeEventListener('open-add-missing', handleOpenAdd)
  }, [])

  const filtered = MOCK_DATA.filter(p => p.status === activeTab && p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <main className="min-h-screen bg-surface dark:bg-[#0a1628] flex flex-col pb-40 transition-colors">
      {/* Clean Header Pattern */}
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
              {t('missingPage.title')}
            </h1>
            <p className="mt-1.5 text-slate-500 dark:text-slate-400 font-body text-base font-medium">
              {t('missingPage.subtitle')}
            </p>
          </div>
        </section>
      </div>

      <div className="px-5 pt-6 shrink-0 max-w-2xl mx-auto w-full">
      </div>

      <div className="px-4 pb-6 space-y-6 max-w-2xl mx-auto w-full">
        {/* Toggle Tabs */}
        <div className="flex bg-surface-container-low dark:bg-white/5 p-1.5 rounded-2xl shadow-sm border border-outline-variant/10 dark:border-white/5">
          <button
            onClick={() => setActiveTab('missing')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'missing' 
                ? 'bg-white text-error shadow-sm' 
                : 'text-on-surface-variant hover:bg-white/50'
            }`}
          >
            {t('missingPage.tabMissing')}
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'found' 
                ? 'bg-white text-secondary shadow-sm' 
                : 'text-on-surface-variant dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5'
            }`}
          >
            {t('missingPage.tabFound')}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('missingPage.searchPlace')}
            className="w-full bg-surface-container-highest dark:bg-white/5 border-none dark:border dark:border-white/5 pl-14 pr-6 py-4 rounded-2xl text-sm font-semibold text-on-surface dark:text-white placeholder:text-outline/70 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
        </div>

        {/* List */}
        <div className="space-y-4 mt-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 px-6">
              <span className="material-symbols-outlined text-[48px] text-slate-300 mb-3" style={{ fontVariationSettings: `'FILL' 1` }}>person_search</span>
              <p className="text-slate-500 font-semibold mb-1">{t('missingPage.notFound')}</p>
              <p className="text-xs text-slate-400">{t('missingPage.notFoundDesc')}</p>
            </div>
          ) : (
            filtered.map(person => (
              <div key={person.id} className="bg-surface-container-lowest dark:bg-white/5 rounded-[2rem] p-5 border border-outline-variant/10 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-2xl bg-surface-container-low flex items-center justify-center text-outline group-hover:bg-primary/5 group-hover:text-primary transition-colors overflow-hidden">
                       <span className="material-symbols-outlined text-[48px]">person</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="font-extrabold text-on-surface dark:text-white font-headline text-2xl tracking-tight">
                          {person.name}
                        </h2>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="bg-surface-container-high dark:bg-white/5 text-on-surface-variant dark:text-slate-400 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-outline-variant/5 dark:border-white/5">
                            {t('missingPage.age').replace('{age}', person.age.toString())}
                          </span>
                          <div className="flex items-center gap-1.5 text-secondary">
                             <span className={`w-2 h-2 rounded-full ${person.status === 'missing' ? 'bg-error' : 'bg-secondary animate-pulse'}`} />
                             <span className="text-[10px] font-extrabold uppercase tracking-widest leading-none translate-y-[0.5px]">
                              {person.status === 'missing' ? 'Missing' : 'Found'}
                             </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-5 flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                      </div>
                      <div className="text-xs">
                        <p className="text-outline dark:text-slate-500 uppercase text-[9px] font-extrabold tracking-widest mb-0.5">{t('missingPage.lastSeen')}</p>
                        <p className="text-on-surface dark:text-white font-semibold leading-tight">{person.lastSeen}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="relative p-4 rounded-xl bg-surface-container-low/50 dark:bg-white/5 italic text-on-surface-variant dark:text-slate-400 text-[13px] leading-relaxed border border-outline-variant/5 dark:border-white/5">
                     "{person.description}"
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-outline-variant/10 dark:border-white/10 -mx-5 -mb-5 px-5 py-5 transition-colors">
                    <div className="flex-1">
                      <p className="text-[9px] font-extrabold text-outline uppercase tracking-widest mb-0.5">{t('missingPage.reporter')}</p>
                      <p className="text-xs font-extrabold text-on-surface-variant dark:text-white">{person.reporterName}</p>
                    </div>
                    <a href={`tel:${person.reporterPhone}`} className="flex items-center gap-2.5 text-on-primary bg-primary px-6 py-3.5 rounded-[1.25rem] active:scale-95 transition-all shadow-lg shadow-primary/20">
                      <span className="material-symbols-outlined text-[20px]">call</span>
                      <span className="text-sm font-extrabold tracking-tight">{person.reporterPhone}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Missing Person Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <div className="relative z-10 bg-white dark:bg-[#0d2247] rounded-t-[3rem] px-6 pt-5 pb-40 reveal-pop max-h-[92vh] overflow-y-auto w-full shadow-2xl transition-colors">
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5 shrink-0" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white font-headline mb-1">{t('missingPage.modalTitle')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{t('missingPage.modalDesc')}</p>
            
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }}>
              <div className="flex bg-slate-50 border border-slate-200 border-dashed rounded-2xl h-24 items-center justify-center text-slate-400 active:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[28px]">add_a_photo</span>
                  <span className="text-xs font-bold font-headline">{t('missingPage.addPhoto')}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('missingPage.formName')}</label>
                  <input required type="text" placeholder={t('missingPage.formNamePlace')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('missingPage.formAge')}</label>
                  <input required type="number" placeholder={t('missingPage.formAgePlace')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-400" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('missingPage.formLastSeen')}</label>
                <input required type="text" placeholder={t('missingPage.formLastSeenPlace')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-400" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1.5 block">{t('missingPage.formDesc')}</label>
                <textarea required rows={2} placeholder={t('missingPage.formDescPlace')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-400 resize-none" />
              </div>

              <div className="border-t border-slate-100 pt-4 mt-2 mb-2">
                <p className="text-xs font-bold text-slate-800 mb-3">{t('missingPage.formReporterTitle')}</p>
                <div className="space-y-3">
                  <div>
                    <input required type="text" placeholder={t('missingPage.formReporterName')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input required type="text" placeholder={t('missingPage.formReporterRelation')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-400" />
                    <input required type="tel" placeholder={t('missingPage.formReporterPhone')} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-red-400" />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-2 bg-red-600 text-white font-bold py-4 rounded-2xl text-base shadow-[0_8px_24px_-6px_rgba(220,38,38,0.5)] active:scale-95 transition-transform"
              >
                {t('missingPage.formSubmit')}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
