'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import { api } from '@/services/api'
import { toast } from 'react-hot-toast'

interface MissingPerson {
  id_code: string
  name: string
  age: number
  last_seen: string
  description: string
  status: 'missing' | 'found'
  reporter_name: string
  reporter_phone: string
  created_at: string
  photo_url?: string
}

export default function MissingPage() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<'missing' | 'found'>('missing')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [people, setPeople] = useState<MissingPerson[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    last_seen: '',
    description: '',
    reporter_name: '',
    reporter_phone: '',
    reporter_relation: ''
  })

  const fetchPeople = async () => {
    setLoading(true)
    try {
      const res = await api.get('/missing', {
        params: {
          status: activeTab,
          name: search || undefined
        }
      })
      if (res.data.success) {
        setPeople(res.data.data)
      }
    } catch (error) {
      console.error('Erro ao buscar desaparecidos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPeople()
  }, [activeTab, search])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/missing', {
        ...formData,
        age: parseInt(formData.age),
        status: 'missing'
      })
      if (res.data.success) {
        toast.success('Registro criado com sucesso!')
        setShowAddModal(false)
        setFormData({
            name: '', age: '', last_seen: '', description: '',
            reporter_name: '', reporter_phone: '', reporter_relation: ''
        })
        fetchPeople()
      }
    } catch (error) {
      toast.error('Erro ao registrar. Tente novamente.')
    }
  }

  return (
    <main className="min-h-screen bg-surface dark:bg-[#0a1628] flex flex-col pb-40 transition-colors">
      {/* Clean Header Pattern */}
      <div className="bg-white/90 dark:bg-[#0a1628]/90 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 px-6 pt-12 pb-8 sticky top-0 z-20">
        <section className="flex items-start gap-4 relative max-w-2xl mx-auto">
          <Link 
            href="/help?module=help"
            className="w-11 h-11 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-200 active:scale-95 transition-all shadow-sm shrink-0 border border-slate-100 dark:border-white/5"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-tight font-headline">
              {t('missingPage.title')}
            </h1>
            <p className="mt-1.5 text-slate-500 dark:text-slate-400 font-body text-base font-medium">
              {t('missingPage.subtitle')}
            </p>
          </div>
          <button 
             onClick={() => setShowAddModal(true)}
             className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-all shrink-0"
          >
             <span className="material-symbols-outlined font-variation-fill">person_add</span>
          </button>
        </section>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto w-full font-sans">
        {/* Toggle Tabs */}
        <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5">
          <button
            onClick={() => setActiveTab('missing')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${
              activeTab === 'missing' 
                ? 'bg-white dark:bg-primary text-red-600 dark:text-white shadow-sm' 
                : 'text-slate-400 hover:bg-white/50'
            }`}
          >
            {t('missingPage.tabMissing')}
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${
              activeTab === 'found' 
                ? 'bg-white dark:bg-primary text-emerald-600 dark:text-white shadow-sm' 
                : 'text-slate-400 hover:bg-white/50'
            }`}
          >
            {t('missingPage.tabFound')}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('missingPage.searchPlace')}
            className="w-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 pl-14 pr-6 py-4 rounded-3xl text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-300 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">Buscando registros...</p>
             </div>
          ) : people.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/5">
              <span className="material-symbols-outlined text-[64px] text-slate-200 mb-4" style={{ fontVariationSettings: `'FILL' 1` }}>person_search</span>
              <p className="text-slate-800 dark:text-white font-black uppercase tracking-widest text-xs mb-1">{t('missingPage.notFound')}</p>
              <p className="text-xs text-slate-400 font-medium">{t('missingPage.notFoundDesc')}</p>
            </div>
          ) : (
            people.map(person => (
              <div key={person.id_code} className="bg-white dark:bg-white/5 rounded-[2.5rem] p-6 border border-slate-50 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-3xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-colors overflow-hidden border border-slate-100 dark:border-white/5">
                       {person.photo_url ? (
                           <img src={person.photo_url} alt={person.name} className="w-full h-full object-cover" />
                       ) : (
                           <span className="material-symbols-outlined text-[40px]">person</span>
                       )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="font-headline font-black text-slate-900 dark:text-white text-2xl tracking-tighter leading-tight">
                        {person.name}
                    </h2>
                    <div className="mt-2 flex items-center gap-3">
                        <span className="bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        {t('missingPage.age').replace('{age}', person.age.toString())}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${person.status === 'missing' ? 'bg-red-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${person.status === 'missing' ? 'text-red-500' : 'text-emerald-500'}`}>
                            {person.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 italic text-slate-600 dark:text-slate-400 text-sm leading-relaxed border border-slate-50 dark:border-white/5">
                     "{person.description}"
                  </div>
                  
                  <div className="flex items-start gap-3 px-1">
                      <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t('missingPage.lastSeen')}</p>
                        <p className="text-xs text-slate-700 dark:text-white font-bold leading-snug">{person.last_seen}</p>
                      </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 transition-colors">
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t('missingPage.reporter')}</p>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{person.reporter_name}</p>
                    </div>
                    {person.reporter_phone && (
                        <a href={`tel:${person.reporter_phone}`} className="flex items-center gap-2.5 bg-blue-600 text-white px-6 py-3 rounded-2xl active:scale-95 transition-all shadow-lg shadow-blue-500/20">
                            <span className="material-symbols-outlined text-[18px]">call</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Contatar</span>
                        </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <div className="relative z-10 bg-white dark:bg-[#0d2247] rounded-t-[3.5rem] px-8 pt-6 pb-40 animate-in slide-in-from-bottom duration-500 max-h-[92vh] overflow-y-auto w-full shadow-2xl transition-colors font-sans">
            <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 mx-auto mb-8 shrink-0" />
            
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                    <span className="material-symbols-outlined text-[36px] font-variation-fill">person_search</span>
                </div>
                <div>
                   <h2 className="text-2xl font-black text-slate-900 dark:text-white font-headline tracking-tight">{t('missingPage.modalTitle')}</h2>
                   <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('missingPage.modalDesc')}</p>
                </div>
            </div>
            
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="flex bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 border-dashed rounded-[2rem] h-32 items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[32px]">add_a_photo</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{t('missingPage.addPhoto')}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{t('missingPage.formName')}</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" placeholder={t('missingPage.formNamePlace')} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{t('missingPage.formAge')}</label>
                  <input required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} type="number" placeholder={t('missingPage.formAgePlace')} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{t('missingPage.formLastSeen')}</label>
                <input required value={formData.last_seen} onChange={e => setFormData({...formData, last_seen: e.target.value})} type="text" placeholder={t('missingPage.formLastSeenPlace')} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">{t('missingPage.formDesc')}</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} placeholder={t('missingPage.formDescPlace')} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none" />
              </div>

              <div className="p-6 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-4">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Informações de Contato</p>
                <div className="space-y-4">
                  <input required value={formData.reporter_name} onChange={e => setFormData({...formData, reporter_name: e.target.value})} type="text" placeholder={t('missingPage.formReporterName')} className="w-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 dark:text-white outline-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required value={formData.reporter_relation} onChange={e => setFormData({...formData, reporter_relation: e.target.value})} type="text" placeholder={t('missingPage.formReporterRelation')} className="w-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 dark:text-white outline-none" />
                    <input required value={formData.reporter_phone} onChange={e => setFormData({...formData, reporter_phone: e.target.value})} type="tel" placeholder={t('missingPage.formReporterPhone')} className="w-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 dark:text-white outline-none" />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-red-600 text-white font-black py-5 rounded-[2rem] text-sm uppercase tracking-widest shadow-xl shadow-red-500/30 active:scale-95 transition-all"
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
