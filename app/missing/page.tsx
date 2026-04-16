'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'

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

  const filtered = MOCK_DATA.filter(p => p.status === activeTab && p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pb-28">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800 font-headline leading-tight">{t('missingPage.title')}</h1>
            <p className="text-xs text-slate-400">{t('missingPage.subtitle')}</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 active:scale-95 transition-transform shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">add</span>
          </button>
        </div>
      </div>

      <div className="px-4 pt-5 pb-6 space-y-4">
        {/* Toggle Tabs */}
        <div className="flex bg-slate-200/50 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('missing')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'missing' 
                ? 'bg-white text-red-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('missingPage.tabMissing')}
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'found' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('missingPage.tabFound')}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('missingPage.searchPlace')}
            className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3.5 rounded-2xl text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 transition-colors shadow-sm"
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
              <div key={person.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${person.status === 'missing' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[32px] text-slate-300">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-slate-800 font-headline text-[17px] leading-tight flex items-center gap-2">
                      {person.name}
                      <span className="text-xs font-semibold text-slate-400 font-sans tracking-wide">
                        {t('missingPage.age').replace('{age}', person.age.toString())}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-2 flex items-start gap-1 leading-relaxed">
                      <span className="material-symbols-outlined text-[14px] shrink-0 translate-y-[2px]">location_on</span>
                      <span>
                        <strong className="text-slate-700">{t('missingPage.lastSeen')}</strong><br/>
                        {person.lastSeen}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl italic">
                    "{person.description}"
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('missingPage.reporter')}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-700">{person.reporterName}</p>
                      <a href={`tel:${person.reporterPhone}`} className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg active:scale-95 transition-transform">
                        <span className="material-symbols-outlined text-[14px]">call</span>
                        <span className="text-xs font-bold">{person.reporterPhone}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Missing Person Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative z-10 bg-white rounded-t-[2rem] px-5 pt-4 pb-10 reveal-pop max-h-[85vh] overflow-y-auto w-full">
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5 shrink-0" />
            <h2 className="text-xl font-bold text-slate-800 font-headline mb-1">{t('missingPage.modalTitle')}</h2>
            <p className="text-sm text-slate-500 mb-6">{t('missingPage.modalDesc')}</p>
            
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
