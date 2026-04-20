'use client'

import { useState, useEffect, Suspense } from 'react'
import { useI18n, Language } from '@/components/i18n/I18nProvider'
import AppHeader from '@/components/headers/AppHeader'
import { api } from '@/services/api'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'
import TextInput from '@/components/ui/TextInput'

const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), { ssr: false })

function ProfileContent() {
  const { t, language, setLanguage } = useI18n()
  const searchParams = useSearchParams()
  const isFirstSetup = searchParams.get('setup') === 'true'
  
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  const [role, setRole] = useState<string | null>('civilian')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    lat: 0,
    lng: 0,
    use_default_location: false
  })
  
  const [showMap, setShowMap] = useState(false)

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark')
    }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me')
      const data = res.data.data.user // Corrected mapping
      setUser(data)
      setRole(data.role)
      setAddress({
        street: data.address_street || '',
        number: data.address_number || '',
        complement: data.address_complement || '',
        neighborhood: data.address_neighborhood || '',
        city: data.address_city || '',
        state: data.address_state || '',
        zipCode: data.address_zip_code || '',
        lat: parseFloat(data.lat) || -27.5954, 
        lng: parseFloat(data.lng) || -48.5480,
        use_default_location: !!data.use_default_location
      })
    } catch (e) {
      console.error('Error fetching profile', e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (updates: any) => {
    setSaving(true)
    try {
      const payload = {
        address_street: updates.street,
        address_number: updates.number,
        address_complement: updates.complement,
        address_neighborhood: updates.neighborhood,
        address_city: updates.city,
        address_state: updates.state,
        address_zip_code: updates.zipCode,
        lat: updates.lat,
        lng: updates.lng,
        use_default_location: updates.use_default_location
      }
      await api.put('/auth/profile', payload)
      toast.success(t('profilePage.toasts.success') || 'Perfil atualizado!')
      
      const stored = localStorage.getItem('vnw_user')
      if (stored) {
        const u = JSON.parse(stored)
        localStorage.setItem('vnw_user', JSON.stringify({ ...u, ...payload }))
      }
      
      setUser((prev: any) => ({ ...prev, ...payload }))
    } catch (e) {
      toast.error(t('profilePage.toasts.error') || 'Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      const data = await res.json()
      if (data && data.address) {
        setAddress(prev => ({
          ...prev,
          street: data.address.road || prev.street,
          neighborhood: data.address.suburb || data.address.neighbourhood || prev.neighborhood,
          city: data.address.city || data.address.town || prev.city,
          state: (data.address.state_code || data.address.state || '').slice(0, 2).toUpperCase(),
          zipCode: data.address.postcode || prev.zipCode,
          lat,
          lng
        }))
      }
    } catch (e) {}
  }

  const toggleTheme = (newTheme: 'light'|'dark') => {
    setTheme(newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <main className="min-h-screen bg-surface dark:bg-[#0a1628] pb-28 pt-16 transition-colors">
      <AppHeader />

      <div className="px-4 pt-8 space-y-8 max-w-2xl mx-auto w-full">
        <section>
          <h1 className="text-3xl font-extrabold font-headline text-on-surface dark:text-white tracking-tight leading-tight">
            {t('profilePage.title')}
          </h1>
          {isFirstSetup && (
            <div className="mt-4 p-5 bg-primary/10 border border-primary/20 rounded-3xl animate-in fade-in slide-in-from-top-4">
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                    <span className="material-symbols-outlined">location_on</span>
                 </div>
                 <div>
                    <h3 className="font-black text-sm text-primary uppercase tracking-tight mb-1">Cofiguração Inicial</h3>
                    <p className="text-xs text-primary/70 font-bold leading-relaxed">Por favor, defina seu endereço de base abaixo para que possamos otimizar as buscas por você.</p>
                 </div>
              </div>
            </div>
          )}
        </section>

        {/* User Card */}
        <div className="bg-surface-container-lowest dark:bg-white/5 rounded-[2.5rem] p-6 border border-outline-variant/10 shadow-sm flex items-center gap-6 relative">
          {loading ? (
             <div className="absolute inset-0 bg-white/50 dark:bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center rounded-[2.5rem]">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
             </div>
          ) : null}
          <div className="relative group">
            <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
              {user?.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-[44px]">person</span>}
            </div>
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-on-surface dark:text-white font-headline leading-none">
              {user?.name || '...'}
            </h2>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 font-medium mt-1">{user?.phone || 'Telefone não informado'}</p>
            {role && (
              <span className="inline-block mt-3 bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary-fixed text-[10px] font-extrabold px-3 py-1.5 rounded-xl uppercase tracking-widest border border-secondary/10 shadow-sm">
                {t(`profilePage.roles.${role}`)}
              </span>
            )}
          </div>
        </div>

        {/* ENDEREÇO E LOCALIZAÇÃO */}
        <div className="space-y-6">
           <h3 className="text-sm font-extrabold text-on-surface dark:text-white uppercase tracking-widest px-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Endereço de Base
           </h3>
           
           <div className="bg-surface-container-lowest dark:bg-white/5 rounded-[2rem] border border-outline-variant/10 shadow-sm p-6 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                 <div className="col-span-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Rua / Logradouro</p>
                    <TextInput value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} placeholder="Ex: Av. Beira Mar" className="rounded-2xl" />
                 </div>
                 <div className="col-span-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nº</p>
                    <TextInput value={address.number} onChange={(e) => setAddress({...address, number: e.target.value})} placeholder="100" className="rounded-2xl text-center" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Bairro</p>
                    <TextInput value={address.neighborhood} onChange={(e) => setAddress({...address, neighborhood: e.target.value})} placeholder="Bairro" className="rounded-2xl" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Cidade / UF</p>
                    <div className="flex gap-2">
                       <TextInput value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} placeholder="Cid." className="rounded-2xl flex-1" />
                       <TextInput value={address.state} onChange={(e) => setAddress({...address, state: e.target.value.toUpperCase()})} placeholder="UF" maxLength={2} className="rounded-2xl w-14 text-center" />
                    </div>
                 </div>
              </div>

              <div className="pt-2">
                 <div onClick={() => setShowMap(true)} className="relative h-32 bg-slate-100 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
                    {address.lat !== 0 ? (
                       <>
                          <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                             <img src={`https://static-maps.yandex.ru/1.x/?lang=pt_BR&ll=${address.lng},${address.lat}&z=13&l=map&size=600,300`} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="relative z-10 bg-white dark:bg-black/40 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/10">
                             Alterar no Mapa
                          </div>
                       </>
                    ) : (
                       <>
                          <span className="material-symbols-outlined text-slate-300 dark:text-white/20 text-3xl mb-1">map</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Definir Coordenadas</span>
                       </>
                    )}
                 </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                 <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-500">my_location</span>
                    <div>
                       <p className="text-xs font-black text-slate-800 dark:text-white leading-none mb-1">Usar como localização padrão</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Otimiza buscas e pedidos de socorro</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setAddress({...address, use_default_location: !address.use_default_location})}
                   className={`w-12 h-6 rounded-full transition-all relative ${address.use_default_location ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'}`}
                 >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${address.use_default_location ? 'left-7' : 'left-1'}`} />
                 </button>
              </div>

              <button 
                 onClick={() => handleUpdateProfile(address)}
                 disabled={saving}
                 className="w-full py-4 bg-slate-900 dark:bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                 {saving ? <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" /> : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Salvar Alterações
                    </>
                 )}
              </button>
           </div>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-on-surface dark:text-white uppercase tracking-widest px-1 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-primary" />
             {t('profilePage.settings')}
          </h3>
          
          <div className="bg-surface-container-lowest dark:bg-white/5 rounded-[2rem] border border-outline-variant/10 shadow-sm overflow-hidden p-2 space-y-2">
            
            <div className="flex items-center justify-between p-4 bg-surface-container-low/30 dark:bg-white/5 rounded-2xl border border-outline-variant/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/5">
                   <span className="material-symbols-outlined text-[20px]">language</span>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-on-surface dark:text-white font-headline">{t('profilePage.language')}</p>
                  <p className="text-[10px] text-on-surface-variant dark:text-slate-500 font-medium uppercase tracking-wider">{t('profilePage.languageDesc')}</p>
                </div>
              </div>
              <div className="flex bg-slate-100 dark:bg-black/20 p-1.5 rounded-2xl shadow-inner border border-outline-variant/5">
                <button 
                  onClick={() => setLanguage('pt-BR')} 
                  className={`px-5 py-2 text-xs font-extrabold rounded-xl transition-all ${language === 'pt-BR' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400'}`}
                >
                  PT
                </button>
                <button 
                  onClick={() => setLanguage('en')} 
                  className={`px-5 py-2 text-xs font-extrabold rounded-xl transition-all ${language === 'en' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400'}`}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-surface-container-low/30 dark:bg-white/5 rounded-2xl border border-outline-variant/5">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary shrink-0 border border-secondary/5">
                   <span className="material-symbols-outlined text-[20px]">palette</span>
                </div>
                <div>
                  <p className="text-sm font-extrabold text-on-surface dark:text-white font-headline">{t('profilePage.theme')}</p>
                  <p className="text-[10px] text-on-surface-variant dark:text-slate-500 font-medium uppercase tracking-wider">{t('profilePage.themeDesc')}</p>
                </div>
              </div>
              <div className="flex bg-slate-100 dark:bg-black/20 p-1.5 rounded-2xl shadow-inner border border-outline-variant/5">
                <button 
                  onClick={() => toggleTheme('light')} 
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${theme === 'light' ? 'bg-white text-on-surface shadow-md border border-outline-variant/10' : 'text-slate-400'}`}
                >
                  <span className="material-symbols-outlined text-[16px]">light_mode</span> {t('profilePage.light')}
                </button>
                <button 
                  onClick={() => toggleTheme('dark')} 
                  className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center gap-2 ${theme === 'dark' ? 'bg-[#0d2247] text-white shadow-md border border-white/10' : 'text-slate-400'}`}
                >
                  <span className="material-symbols-outlined text-[16px]">dark_mode</span> {t('profilePage.dark')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAP MODAL */}
      {showMap && (
         <div className="fixed inset-0 z-[100] bg-surface dark:bg-[#0a1628]/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-[#0d2247] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col h-[80vh] border border-white/10 animate-in zoom-in-95 duration-300">
               <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <span className="material-symbols-outlined">map</span>
                     </div>
                     <div>
                        <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-1">Selecione sua base</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mova o marcador para a sua localização</p>
                     </div>
                  </div>
                  <button onClick={() => setShowMap(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
                     <span className="material-symbols-outlined">close</span>
                  </button>
               </div>
               <div className="flex-1 relative">
                  <MapComponent onUpdateCenter={(coords) => {
                     setAddress(prev => ({ ...prev, lat: coords[0], lng: coords[1] }))
                     reverseGeocode(coords[0], coords[1])
                  }} externalCenter={[address.lat, address.lng]} />
               </div>
               <div className="p-6">
                  <button onClick={() => setShowMap(false)} className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95">
                     Confirmar Localização
                  </button>
               </div>
            </div>
         </div>
      )}
    </main>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 animate-pulse" />}>
      <ProfileContent />
    </Suspense>
  )
}
