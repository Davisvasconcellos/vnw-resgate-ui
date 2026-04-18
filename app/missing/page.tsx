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
  const [selectedPerson, setSelectedPerson] = useState<MissingPerson | null>(null)
  
  const [uploading, setUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    last_seen: '',
    description: '',
    reporter_name: '',
    reporter_phone: '',
    reporter_relation: '',
    photo_url: ''
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Chamada para a API unificada de uploads
      const res = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      const url = res.data.data.url || res.data.data.fileUrl
      
      setFormData(prev => ({ ...prev, photo_url: url }))
      setPhotoPreview(url)
      toast.success('Foto carregada pela API!')
    } catch (error) {
      console.error('Erro no upload via API:', error)
      toast.error('Falha no upload da foto.')
    } finally {
      setUploading(false)
    }
  }

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
        setPhotoPreview(null)
        setFormData({
            name: '', age: '', last_seen: '', description: '',
            reporter_name: '', reporter_phone: '', reporter_relation: '',
            photo_url: ''
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
        <section className="flex items-start gap-4 relative max-w-4xl mx-auto">
          <Link 
            href="/help?module=help"
            className="w-11 h-11 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400 dark:text-slate-200 active:scale-95 transition-all shadow-sm shrink-0 border border-slate-100 dark:border-white/5"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-tight font-headline uppercase">
              {t('missingPage.title')}
            </h1>
            <p className="mt-1.5 text-slate-500 dark:text-slate-400 font-body text-sm font-medium">
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

      <div className="px-4 py-6 space-y-8 max-w-4xl mx-auto w-full font-sans">
        {/* Toggle Tabs & Search */}
        <div className="space-y-4">
          <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5">
            <button
              onClick={() => setActiveTab('missing')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${
                activeTab === 'missing' 
                  ? 'bg-white dark:bg-red-600 text-red-600 dark:text-white shadow-sm font-black' 
                  : 'text-slate-400 hover:bg-white/50'
              }`}
            >
              {t('missingPage.tabMissing')}
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${
                activeTab === 'found' 
                  ? 'bg-white dark:bg-emerald-600 text-emerald-600 dark:text-white shadow-sm' 
                  : 'text-slate-400 hover:bg-white/50'
              }`}
            >
              {t('missingPage.tabFound')}
            </button>
          </div>

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
        </div>

        {/* List Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {loading ? (
             <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-40">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sincronizando banco...</p>
             </div>
          ) : people.length === 0 ? (
            <div className="col-span-full text-center py-24 px-6 bg-white dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/5">
              <span className="material-symbols-outlined text-[64px] text-slate-200 mb-4" style={{ fontVariationSettings: `'FILL' 1` }}>person_search</span>
              <p className="text-slate-800 dark:text-white font-black uppercase tracking-widest text-xs mb-1">{t('missingPage.notFound')}</p>
              <p className="text-xs text-slate-400 font-medium">{t('missingPage.notFoundDesc')}</p>
            </div>
          ) : (
            people.map(person => (
              <button 
                key={person.id_code} 
                onClick={() => setSelectedPerson(person)}
                className="group relative flex flex-col bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm active:scale-95 transition-all outline-none focus:ring-4 focus:ring-primary/10 text-left"
              >
                {/* Image Container - Prioridade Visual */}
                <div className="aspect-[3/4] relative overflow-hidden bg-slate-100 dark:bg-white/10">
                   {person.photo_url ? (
                       <img src={person.photo_url} alt={person.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                           <span className="material-symbols-outlined text-[48px]">person</span>
                           <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Sem foto</span>
                       </div>
                   )}
                   
                   {/* Urgency Badge overlay */}
                   <div className="absolute top-3 left-3">
                      <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm border ${
                        person.status === 'missing' 
                          ? 'bg-red-500/90 text-white border-white/20' 
                          : 'bg-emerald-500/90 text-white border-white/20'
                      }`}>
                         {person.status}
                      </div>
                   </div>
                </div>

                <div className="p-4 flex-1">
                  <h2 className="font-headline font-black text-slate-900 dark:text-white text-lg tracking-tighter leading-tight truncate uppercase">
                      {person.name}
                  </h2>
                  <div className="mt-1 flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        {t('missingPage.age').replace('{age}', person.age.toString())}
                      </span>
                      <span className="material-symbols-outlined text-primary text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">info</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Selected Person Details Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 z-[110] flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setSelectedPerson(null)} />
          <div className="relative z-10 bg-white dark:bg-[#0a1628] rounded-t-[3.5rem] px-8 pt-6 pb-40 animate-in slide-in-from-bottom duration-500 max-h-[92vh] overflow-y-auto w-full shadow-2xl transition-colors font-sans">
            <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 mx-auto mb-8 shrink-0" />
            
            <div className="flex flex-col md:flex-row gap-8">
               <div className="w-full md:w-64 aspect-square md:aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 shrink-0">
                  {selectedPerson.photo_url ? (
                      <img src={selectedPerson.photo_url} alt={selectedPerson.name} className="w-full h-full object-cover" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                          <span className="material-symbols-outlined text-[80px]">person</span>
                      </div>
                  )}
               </div>

               <div className="flex-1 text-left">
                  <div className="flex items-center gap-3 mb-2">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                       selectedPerson.status === 'missing' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                     }`}>
                        {selectedPerson.status}
                     </span>
                     <span className="text-slate-400 text-xs font-bold">{selectedPerson.age} anos</span>
                  </div>

                  <h2 className="text-4xl font-black text-slate-900 dark:text-white font-headline tracking-tighter mb-4 uppercase">
                    {selectedPerson.name}
                  </h2>

                  <div className="space-y-6 text-left">
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Descrição Física / Roupas</p>
                        <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed text-sm">"{selectedPerson.description}"</p>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                           <span className="material-symbols-outlined">location_on</span>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('missingPage.lastSeen')}</p>
                           <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{selectedPerson.last_seen}</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-center justify-between mb-6">
                           <div className="text-left">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('missingPage.reporter')}</p>
                              <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{selectedPerson.reporter_name}</p>
                           </div>
                           {selectedPerson.reporter_phone && (
                              <a 
                                href={`tel:${selectedPerson.reporter_phone}`}
                                className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-all"
                              >
                                 <span className="material-symbols-outlined text-[28px]">call</span>
                              </a>
                           )}
                        </div>

                        <button 
                          onClick={() => setSelectedPerson(null)}
                          className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-[0.2em] active:scale-[0.98] transition-all"
                        >
                          Fechar Detalhes
                        </button>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

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
              <div 
                className="relative overflow-hidden flex bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 border-dashed rounded-[2rem] h-48 items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => document.getElementById('missing-photo-input')?.click()}
              >
                {photoPreview ? (
                   <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    {uploading ? (
                       <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2" />
                    ) : (
                       <span className="material-symbols-outlined text-[32px]">add_photo_alternate</span>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                       {uploading ? 'Subindo...' : t('missingPage.addPhoto')}
                    </span>
                  </div>
                )}
                <input 
                  id="missing-photo-input"
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoUpload}
                />
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
