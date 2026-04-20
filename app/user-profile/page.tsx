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
import toast from 'react-hot-toast'

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
    zipCode: '',
    lat: 0,
    lng: 0,
    use_default_location: false
  })

  // Map States
  const [showMap, setShowMap] = useState(false)
  const [pickedLoc, setPickedLoc] = useState<[number, number]>([-27.4350, -48.4550])

  // Debounce para o reverse geocode live no mapa
  useEffect(() => {
    if (!showMap) return;
    const timeout = setTimeout(() => {
      reverseGeocode(pickedLoc);
    }, 500);
    return () => clearTimeout(timeout);
  }, [pickedLoc, showMap]);

  const maskPhone = (value: string) => {
    let clean = value.replace(/\D/g, '');
    if (clean.length > 11) clean = clean.slice(0, 11);
    
    if (clean.length > 10) {
      return clean.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (clean.length > 6) {
      return clean.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (clean.length > 2) {
      return clean.replace(/^(\d{2})(\d{0,4}).*/, '($1) $2');
    } else if (clean.length > 0) {
      return clean.replace(/^(\d{0,2}).*/, '($1');
    }
    return clean;
  }

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
        setPhone(maskPhone(u.phone || ''))
        setAddress({
          street: u.address_street || '',
          number: u.address_number || '',
          complement: u.address_complement || '',
          neighborhood: u.address_neighborhood || '',
          city: u.address_city || '',
          state: u.address_state || '',
          zipCode: u.address_zip_code || '',
          lat: u.lat ? parseFloat(u.lat) : 0,
          lng: u.lng ? parseFloat(u.lng) : 0,
          use_default_location: u.use_default_location !== undefined ? !!u.use_default_location : true
        })
        if (u.lat && u.lng) {
          setPickedLoc([parseFloat(u.lat), parseFloat(u.lng)])
        }
        // Se não tiver SEQUER a rua, aí sim força a edição inicial
        if (!u.address_street) {
          setIsEditing(true)
          setAddress(prev => ({ ...prev, use_default_location: true }))
        }
      }
    } catch (e) {
      console.error('Erro ao buscar perfil', e)
    }
  }

  const handleSave = async () => {
    // Validação de telefone obrigatório
    if (!phone || phone.trim() === '') {
      toast.error("O telefone é obrigatório!");
      return;
    }

    // Sanitização: deixar somente números
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length < 10) {
      toast.error("Informe um telefone válido com DDD.");
      return;
    }

    setLoading(true)
    try {
      const payload = {
        phone: cleanPhone,
        address_street: address.street,
        address_number: address.number,
        address_complement: address.complement,
        address_neighborhood: address.neighborhood,
        address_city: address.city,
        address_state: address.state,
        address_zip_code: address.zipCode,
        lat: address.lat,
        lng: address.lng,
        use_default_location: address.use_default_location
      }
      const res = await api.put('/users/me', payload)
      if (res.data.success) {
        const updatedUser = res.data.data.user
        setUserData(updatedUser)
        localStorage.setItem('vnw_user', JSON.stringify(updatedUser))
        setIsEditing(false)
        toast.success("Perfil atualizado!")
      }
    } catch (e) {
      console.error('Erro ao salvar perfil', e)
      toast.error("Erro ao salvar perfil")
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
          street: data.address.road || prev.street,
          neighborhood: data.address.suburb || data.address.neighbourhood || prev.neighborhood,
          city: data.address.city || data.address.town || prev.city,
          state: (data.address.state_code || data.address.state || '').slice(0, 2).toUpperCase() || prev.state,
          zipCode: data.address.postcode || prev.zipCode,
          lat: parseFloat(data.lat) || coords[0],
          lng: parseFloat(data.lon) || coords[1]
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
                onClick={() => {
                  setIsEditing(true);
                  if (userData?.lat && userData?.lng) {
                    setPickedLoc([parseFloat(userData.lat), parseFloat(userData.lng)])
                  }
                }}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#0a1628] active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            )}
          </div>
          <h2 className="text-2xl font-extrabold font-headline tracking-tight text-on-surface dark:text-white mb-2">
            {userData?.name || 'Carregando...'}
          </h2>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-primary text-sm">
              location_on
            </span>
            <span className="text-on-surface-variant dark:text-slate-400 text-sm font-medium">
              {(address.lat && address.lng) ? `${address.city}, ${address.state}` : 'Localização não definida'}
            </span>
          </div>
        </section>

        {isEditing && (!userData?.address_street) && (
          <div className="mb-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-primary/5 dark:bg-primary/20 border-2 border-dashed border-primary/30 rounded-3xl p-6 relative overflow-hidden">
               <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">info</span>
                  </div>
                  <h3 className="font-black text-sm text-primary dark:text-blue-400 uppercase tracking-widest">Configuração Necessária</h3>
                </div>
                <p className="text-sm text-on-surface-variant dark:text-slate-200 font-medium leading-relaxed">
                  Para sua segurança e agilidade nos resgates, use o <b>Mapa</b> para definir sua localização exata e preencher o endereço. Recomendamos manter o endereço como <b>padrão</b> para facilitar suas buscas.
                </p>
               </div>
               <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-8xl text-primary">pin_drop</span>
               </div>
            </div>
          </div>
        )}

        {isEditing ? (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-surface-container-lowest dark:bg-white/5 border border-outline-variant/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">contact_phone</span>
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-[#1565C0] dark:text-blue-400">MEUS DADOS</p>
              </div>

              <div className="space-y-4">
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">TELEFONE</p>
                   <TextInput 
                     value={phone} 
                     onChange={(e) => setPhone(maskPhone(e.target.value))} 
                     type="tel"
                     placeholder="(00) 00000-0000" 
                   />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest dark:bg-white/5 border border-outline-variant/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">map</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest text-[#1565C0] dark:text-blue-400">ENDEREÇO</p>
                </div>
                <button 
                  onClick={() => setShowMap(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30 active:scale-95 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-xs animate-pulse-slow">map</span>
                  MAPA
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">RUA / LOGRADOURO</p>
                   <TextInput value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} placeholder="Ex: Rua das Amoreiras" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">NÚMERO</p>
                    <TextInput value={address.number} onChange={(e) => setAddress({...address, number: e.target.value})} placeholder="100" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">COMPLEMENTO</p>
                    <TextInput value={address.complement} onChange={(e) => setAddress({...address, complement: e.target.value})} placeholder="Apt 201" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">BAIRRO</p>
                    <TextInput value={address.neighborhood} onChange={(e) => setAddress({...address, neighborhood: e.target.value})} placeholder="Centro" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">CIDADE</p>
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

                <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 mt-2">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-500">my_location</span>
                    <div>
                        <p className="text-xs font-black text-slate-800 dark:text-white leading-none mb-1">Usar como endereço padrão</p>
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
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <button 
                onClick={() => setIsEditing(false)}
                className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform"
               >
                 CANCELAR
               </button>
               <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#1565C0] text-white font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform shadow-lg shadow-blue-500/20 disabled:opacity-50"
               >
                 {loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
               </button>
            </div>
          </section>
        ) : (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Card: Localização */}
            <div className="bg-surface-container-lowest dark:bg-white/5 border border-outline-variant/20 dark:border-white/5 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">map</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest">LOCALIZAÇÃO</p>
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
                        <p className="text-sm text-slate-400 italic">Nenhum endereço cadastrado.</p>
                      )}
                    </div>
                    {address.use_default_location && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#1565C0] bg-blue-50 dark:bg-blue-900/40 px-3 py-1.5 rounded-full">
                        PADRÃO
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
                <p className="text-sm font-black uppercase tracking-widest">CONFIGURAÇÕES</p>
              </div>

              <div className="space-y-6">
                {/* Idioma */}
                <div>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">IDIOMA</p>
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
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">TEMA</p>
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
                      CLARO
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
                      ESCURO
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
                VOLTAR AO INÍCIO
              </Link>

              <button 
                onClick={handleLogout} 
                className="w-full py-4 text-red-500 font-extrabold uppercase tracking-[0.2em] text-[10px] hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-colors"
              >
                SAIR DA CONTA
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
                <h3 className="text-xl font-headline font-black text-slate-900 dark:text-white uppercase tracking-tight">SELECIONE NO MAPA</h3>
                <button onClick={() => setShowMap(false)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-white/10">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="flex-1 relative bg-slate-100">
                <MapComponent externalCenter={pickedLoc} onUpdateCenter={(center: [number, number]) => setPickedLoc(center)} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1000]">
                  <div className="relative">
                    <span className="material-symbols-outlined text-primary text-5xl drop-shadow-xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full blur-[1px]" />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white dark:bg-[#0d2247] border-t border-slate-100 dark:border-white/10 shrink-0">
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1 leading-none">RUA / LOGRADOURO</p>
                    <TextInput 
                      value={address.street} 
                      onChange={(e) => setAddress({...address, street: e.target.value})} 
                      placeholder="Rua..." 
                      className="!py-3.5 !text-xs !rounded-2xl"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1 leading-none">NÚMERO</p>
                      <TextInput 
                        value={address.number} 
                        onChange={(e) => setAddress({...address, number: e.target.value})} 
                        placeholder="100" 
                        className="!py-3.5 !text-xs !rounded-2xl text-center"
                      />
                    </div>
                    <div className="col-span-2">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1 leading-none">BAIRRO</p>
                      <TextInput 
                        value={address.neighborhood} 
                        onChange={(e) => setAddress({...address, neighborhood: e.target.value})} 
                        placeholder="Ex: Centro" 
                        className="!py-3.5 !text-xs !rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pb-1">
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1 leading-none">CIDADE</p>
                      <TextInput 
                        value={address.city} 
                        onChange={(e) => setAddress({...address, city: e.target.value})} 
                        placeholder="Cidade..." 
                        className="!py-3.5 !text-xs !rounded-2xl"
                      />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1 leading-none">ESTADO / UF</p>
                      <TextInput 
                         value={address.state} 
                         onChange={(e) => setAddress({...address, state: e.target.value.toUpperCase()})} 
                         placeholder="UF" 
                         maxLength={2}
                         className="!py-3.5 !text-xs !rounded-2xl text-center"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest text-center mt-2">MOVA O MAPA PARA POSICIONAR EXATAMENTE</p>
                <button 
                  onClick={() => setShowMap(false)}
                  className="w-full py-4.5 bg-[#1565C0] text-white rounded-[1.25rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all min-h-[56px] flex items-center justify-center"
                >
                  CONFIRMAR LOCALIZAÇÃO
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
