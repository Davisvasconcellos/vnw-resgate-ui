'use client'

import Link from 'next/link'
import AppHeader from '@/components/headers/AppHeader'
import BottomNavWrapper from '@/components/BottomNavWrapper'
import Image from 'next/image'
import { useI18n } from '@/components/i18n/I18nProvider'
import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import { auth } from '@/services/firebase'
import { signOut } from 'firebase/auth'
import { api } from '@/services/api'
import dynamic from 'next/dynamic'
import TextInput from '@/components/ui/TextInput'
import LocationIndicator from '@/components/ui/LocationIndicator'
const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), { ssr: false })

export default function UserProfile() {
  const { t, language, setLanguage } = useI18n()
  const router = useRouter()
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // User States
  const [userData, setUserData] = useState<any>(null)
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  })

  // Map States
  const [showMap, setShowMap] = useState(false)
  const [pickedLoc, setPickedLoc] = useState<[number, number]>([-27.4350, -48.4550])

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark')
    }
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/me')
      if (res.data.success) {
        const u = res.data.data.user
        setUserData(u)
        setPhone(u.phone || '')
        setAddress({
          street: u.address_street || '',
          number: u.address_number || '',
          complement: u.address_complement || '',
          neighborhood: u.address_neighborhood || '',
          city: u.address_city || '',
          state: u.address_state || '',
          zipCode: u.address_zip_code || ''
        })
      }
    } catch (e) {
      console.error('Erro ao buscar perfil', e)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = {
        phone,
        address_street: address.street,
        address_number: address.number,
        address_complement: address.complement,
        address_neighborhood: address.neighborhood,
        address_city: address.city,
        address_state: address.state,
        address_zip_code: address.zipCode
      }
      const res = await api.put('/users/me', payload)
      if (res.data.success) {
        setUserData(res.data.data.user)
        localStorage.setItem('vnw_user', JSON.stringify(res.data.data.user))
        setIsEditing(false)
      }
    } catch (e) {
      console.error('Erro ao salvar perfil', e)
    } finally {
      setLoading(false)
    }
  }

  const reverseGeocode = async (coords: [number, number]) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`);
      const data = await res.json();
      if (data && data.address) {
        setAddress(prev => ({
          ...prev,
          street: data.address.road || '',
          neighborhood: data.address.suburb || data.address.neighbourhood || '',
          city: data.address.city || data.address.town || '',
          state: data.address['ISO3166-2-lvl4'] 
            ? data.address['ISO3166-2-lvl4'].split('-').pop() 
            : (data.address.state_code || data.address.state || ''),
          zipCode: data.address.postcode || ''
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      const token = localStorage.getItem('vnw_token');
      if (token) await api.post('/auth/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch(e) {
      console.error('Erro logout', e);
    } finally {
      localStorage.removeItem('vnw_token');
      localStorage.removeItem('vnw_user');
      router.push('/login');
    }
  }

  return (
    <ProtectedRoute>
    <div className="bg-surface dark:bg-[#0a1628] text-on-surface dark:text-white min-h-screen pb-32 transition-colors">
      <AppHeader avatarAlt="User profile photo" />
      <main className="pt-24 px-4 max-w-3xl mx-auto">
        <section className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-white/10">
              <Image
                alt={userData?.name || 'User'}
                width={128}
                height={128}
                className="w-full h-full object-cover"
                src={userData?.avatar_url || 'https://lh3.googleusercontent.com/a/default-user'}
              />
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#0a1628] active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            )}
          </div>
          <h2 className="text-2xl font-extrabold font-headline tracking-tight text-on-surface dark:text-white mb-2">
            {userData?.name || 'Calculando...'}
          </h2>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-primary text-sm">
              location_on
            </span>
            <span className="text-on-surface-variant dark:text-slate-400 text-sm font-medium">
              {userData?.address_city ? `${userData.address_city}, ${userData.address_state}` : 'Localização não definida'}
            </span>
          </div>
        </section>

        {isEditing ? (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-surface-container-lowest dark:bg-white/5 border border-outline-variant/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">contact_phone</span>
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-[#1565C0] dark:text-blue-400">Meus Dados</p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Telefone</p>
                  <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest dark:bg-white/5 border border-outline-variant/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">map</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest text-[#1565C0] dark:text-blue-400">Endereço</p>
                </div>
                <button 
                  onClick={() => setShowMap(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-xs">pin_drop</span>
                  Mapa
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Rua / Logradouro</p>
                  <TextInput value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} placeholder="Ex: Rua das Amoreiras" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Número</p>
                    <TextInput value={address.number} onChange={(e) => setAddress({...address, number: e.target.value})} placeholder="100" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Complemento</p>
                    <TextInput value={address.complement} onChange={(e) => setAddress({...address, complement: e.target.value})} placeholder="Apt 201" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Bairro</p>
                    <TextInput value={address.neighborhood} onChange={(e) => setAddress({...address, neighborhood: e.target.value})} placeholder="Centro" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">Cidade</p>
                    <TextInput value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} placeholder="Porto Alegre" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">UF</p>
                    <TextInput value={address.state} onChange={(e) => setAddress({...address, state: e.target.value.toUpperCase()})} maxLength={2} placeholder="RS" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">CEP</p>
                    <TextInput value={address.zipCode} onChange={(e) => setAddress({...address, zipCode: e.target.value})} placeholder="00000-000" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <button 
                onClick={() => setIsEditing(false)}
                className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform"
               >
                 Cancelar
               </button>
               <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#1565C0] text-white font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform shadow-lg shadow-blue-500/20 disabled:opacity-50"
               >
                 {loading ? 'Salvando...' : 'Salvar Alterações'}
               </button>
            </div>
          </section>
        ) : (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Card: Endereços */}
            <div className="bg-surface-container-lowest dark:bg-white/5 border border-outline-variant/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">map</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest">{t('request.location')}</p>
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 text-slate-400"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Endereço Residencial</p>
                      {userData?.address_street ? (
                        <>
                          <p className="font-bold text-sm text-slate-800 dark:text-white">
                            {userData.address_street}, {userData.address_number} {userData.address_complement ? ` - ${userData.address_complement}` : ''}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            {userData.address_neighborhood}, {userData.address_city} - {userData.address_state}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-400 italic">Nenhum endereço cadastrado. Clique em editar para adicionar.</p>
                      )}
                    </div>
                    {userData?.address_street && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#1565C0] bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-full">
                        Ativo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Configurações */}
            <div className="bg-surface-container-lowest dark:bg-white/5 border border-outline-variant/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <span className="material-symbols-outlined text-[24px]">settings</span>
                </div>
                <p className="text-sm font-black uppercase tracking-widest">Configurações</p>
              </div>

              <div className="space-y-6">
                {/* Idioma */}
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Idioma / Language</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setLanguage('pt-BR')}
                      className={`py-3.5 rounded-2xl font-bold text-xs transition-all ${
                      language === 'pt-BR' 
                        ? 'bg-[#1565C0] text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-slate-50 dark:bg-white/5 text-slate-500'
                      }`}
                    >
                      Português
                    </button>
                    <button 
                      onClick={() => setLanguage('en')}
                      className={`py-3.5 rounded-2xl font-bold text-xs transition-all ${
                      language === 'en' 
                        ? 'bg-[#1565C0] text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-slate-50 dark:bg-white/5 text-slate-500'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* Tema */}
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Tema / Theme</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => toggleTheme('light')}
                      className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-xs transition-all ${
                      theme === 'light' 
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                        : 'bg-slate-50 dark:bg-white/5 text-slate-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">light_mode</span>
                      Claro
                    </button>
                    <button 
                      onClick={() => toggleTheme('dark')}
                      className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-xs transition-all ${
                      theme === 'dark' 
                        ? 'bg-slate-900 border border-white/20 text-white shadow-lg shadow-black/40' 
                        : 'bg-slate-50 dark:bg-white/5 text-slate-500'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                      Escuro
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 space-y-4">
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 font-black py-4 rounded-2xl active:scale-95 transition-transform text-xs uppercase tracking-[0.1em]"
              >
                <span className="material-symbols-outlined text-[18px]">home</span>
                Voltar ao Início
              </Link>

              <button 
                onClick={handleLogout} 
                className="w-full py-4 text-red-500 font-extrabold uppercase tracking-[0.2em] text-[10px] hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-colors"
              >
                Sair da conta
              </button>
            </div>
          </section>
        )}
      </main>

      {/* MAP MODAL */}
      {showMap && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in">
           <div className="bg-white dark:bg-[#0d2247] w-full max-w-2xl sm:rounded-[2.5rem] overflow-hidden flex flex-col h-[90vh] sm:h-[80vh] shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
              <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-white/10 shrink-0">
                <h3 className="text-xl font-headline font-black text-slate-900 dark:text-white">Selecione no Mapa</h3>
                <button onClick={() => setShowMap(false)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="flex-1 relative">
                <MapComponent externalCenter={pickedLoc} onUpdateCenter={(center: [number, number]) => setPickedLoc(center)} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1000]">
                  <div className="relative">
                    <span className="material-symbols-outlined text-primary text-5xl drop-shadow-xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-[1px]" />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-[#0d2247] border-t border-slate-100 dark:border-white/10 shrink-0">
                {/* FORMULARIO COMPACTO - PERFIL */}
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Rua / Logradouro</p>
                    <TextInput 
                      value={address.street} 
                      onChange={(e) => setAddress({...address, street: e.target.value})} 
                      placeholder="Rua..." 
                      className="!py-2 !text-xs !rounded-xl"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Nº</p>
                      <TextInput 
                        value={address.number} 
                        onChange={(e) => setAddress({...address, number: e.target.value})} 
                        placeholder="100" 
                        className="!py-2 !text-xs !rounded-xl"
                      />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Compl.</p>
                      <TextInput 
                        value={address.complement} 
                        onChange={(e) => setAddress({...address, complement: e.target.value})} 
                        placeholder="Apt..." 
                        className="!py-2 !text-xs !rounded-xl"
                      />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">UF</p>
                      <TextInput 
                        value={address.state} 
                        onChange={(e) => setAddress({...address, state: e.target.value.toUpperCase()})} 
                        placeholder="RS" 
                        maxLength={2}
                        className="!py-2 !text-xs !rounded-xl text-center"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pb-1">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Bairro</p>
                      <TextInput 
                        value={address.neighborhood} 
                        onChange={(e) => setAddress({...address, neighborhood: e.target.value})} 
                        placeholder="Bairro..." 
                        className="!py-2 !text-xs !rounded-xl"
                      />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Cidade</p>
                      <TextInput 
                        value={address.city} 
                        onChange={(e) => setAddress({...address, city: e.target.value})} 
                        placeholder="Cidade..." 
                        className="!py-2 !text-xs !rounded-xl"
                      />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">CEP</p>
                      <TextInput 
                        value={address.zipCode} 
                        onChange={(e) => setAddress({...address, zipCode: e.target.value})} 
                        placeholder="00000" 
                        className="!py-2 !text-xs !rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest text-center">Mova o mapa para posicionar exatamente</p>
                <button 
                  onClick={() => {
                    reverseGeocode(pickedLoc);
                    setShowMap(false);
                  }}
                  className="w-full py-4 bg-[#1565C0] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
                >
                  Confirmar Localização
                </button>
              </div>
           </div>
        </div>
      )}

      <BottomNavWrapper />
    </div>
    </ProtectedRoute>
  )
}
