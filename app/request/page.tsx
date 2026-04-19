'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import LocationIndicator from '@/components/ui/LocationIndicator'
import CameraInput from '@/components/ui/CameraInput'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), { ssr: false })
import { useI18n } from '@/components/i18n/I18nProvider'
import TextInput from '@/components/ui/TextInput'
import AppHeader from '@/components/headers/AppHeader'
import { api } from '@/services/api' // <-- HTTP Client real
import { getDeviceId, saveHelpRequest } from '@/services/fingerprint'
import toast from 'react-hot-toast'

type HelpType = 'rescue' | 'shelter' | 'medical' | 'food' | 'transport' | 'boat'

function RequestForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useI18n()

  const TYPES: { value: HelpType | 'volunteer'; label: string; icon: string; description: string; color: string }[] = [
    { value: 'rescue', label: t('request.rescue'), icon: 'sos', description: t('request.rescueDesc'), color: '#ba1a1a' },
    { value: 'shelter', label: t('request.shelter'), icon: 'house', description: t('request.shelterDesc'), color: '#1565C0' },
    { value: 'medical', label: t('request.medical'), icon: 'medical_services', description: t('request.medicalDesc'), color: '#C62828' },
    { value: 'food', label: t('request.food'), icon: 'restaurant', description: t('request.foodDesc'), color: '#E65100' },
    { value: 'transport', label: 'Transporte', icon: 'directions_car', description: 'Ajuda com movimentação via terra ou água', color: '#0277BD' },
    { value: 'volunteer', label: 'Voluntários', icon: 'groups', description: 'Preciso de braços para ajudar na ocorrência', color: '#2E7D32' },
  ]

  const initialType = (searchParams.get('type') as HelpType) ?? 'rescue'

  const [selectedType, setSelectedType] = useState<HelpType | 'volunteer'>(initialType)
  const [subTypes, setSubTypes] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState<'high' | 'medium' | 'low'>('high')
  const [people, setPeople] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [locationStatus, setLocationStatus] = useState<'acquiring' | 'ready' | 'error'>('acquiring')
  const [locationAddress, setLocationAddress] = useState('Obtendo localização...')
  const [addressDetails, setAddressDetails] = useState({ street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' })
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [showSubTypeModal, setShowSubTypeModal] = useState(false)
  const [pickedLoc, setPickedLoc] = useState<[number, number]>([-27.4350, -48.4550])
  const [mapFlyTrigger, setMapFlyTrigger] = useState<[number, number] | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

  // Pré-preencher se estiver logado
  useEffect(() => {
    const storedUser = localStorage.getItem('vnw_user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setName(user.name || '')
        setPhone(user.phone || '')
        setUserId(user.id || null)
      } catch (e) {}
    }
  }, [])

  const searchAddressForCoords = async () => {
    const query = addressDetails.street ? `${addressDetails.street}, ${addressDetails.number}, ${addressDetails.city}` : locationAddress;
    if (!query || query.includes('Obtendo')) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setPickedLoc([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setMapFlyTrigger([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        setLocationStatus('ready');
      }
    } catch(e) {}
  }

  const reverseGeocode = async (center: [number, number]) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${center[0]}&lon=${center[1]}`);
      const data = await res.json();
      if (data) {
        if (data.display_name) setLocationAddress(data.display_name);
        if (data.address) {
          setAddressDetails({
            street: data.address.road || '',
            number: data.address.house_number || '',
            complement: '',
            neighborhood: data.address.suburb || data.address.neighbourhood || '',
            city: data.address.city || data.address.town || '',
            state: data.address['ISO3166-2-lvl4'] ? data.address['ISO3166-2-lvl4'].split('-').pop() : (data.address.state_code || data.address.state || ''),
            zipCode: data.address.postcode || ''
          })
          setLocationStatus('ready');
        }
      }
    } catch (e) {}
  }

  // Simulate geolocation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationStatus('ready')
      setLocationAddress('Rua dos Chernes, 180 - Canasvieiras, Florianópolis')
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handlePhotoCapture = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotoPreview(url)
      setPhotoFile(file)
    } else {
      setPhotoPreview(null)
      setPhotoFile(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    // 0. Gerar ID Local Temporário
    const temporaryId = `loc-${Date.now()}`;
    
    // 1. Salvar IMEDIATAMENTE no LocalStorage (Offline-First)
    // Isso garante que se a internet cair AGORA, o usuário já tem o registro local
    saveHelpRequest({
      local_id: temporaryId,
      type: selectedType,
      description: description,
      status: 'pending',
      urgency: urgency,
      address: locationAddress,
      sync_status: 'pending'
    });

    try {
      let finalPhotoUrl = ''
      
      // Fluxo 1: Upload da Imagem
      if (photoFile) {
        const mainFolder = process.env.NEXT_PUBLIC_MAIN_FOLDER || 'uploads';
        const formData = new FormData()
        formData.append('file', photoFile)
        formData.append('folder', `${mainFolder}/rescue`)
        
        const uploadRes = await api.post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' }})
        finalPhotoUrl = uploadRes.data.data.url || uploadRes.data.data.fileUrl;
      }

      // Fluxo 2: Payload para API
      const payload = {
        type: selectedType === 'volunteer' ? 'volunteer' : selectedType,
        sub_type: subTypes.join(', '),
        description: description,
        urgency: urgency,
        people_count: people,
        address: locationAddress,
        lat: pickedLoc[0],
        lng: pickedLoc[1],
        photo_url: finalPhotoUrl,
        reporter_name: name,
        reporter_phone: phone,
        device_id: getDeviceId(),
        user_id: userId,
        is_verified: !!userId
      }

      const res = await api.post('/requests', payload)
      const newRequest = res.data.data;
      
      // 3. Sucesso! Atualizar registro local para 'synced'
      if (newRequest?.id_code) {
        saveHelpRequest({
          local_id: temporaryId,
          id_code: newRequest.id_code,
          status: 'pending',
          sync_status: 'synced'
        });
      }
      
      setSubmitted(true)
    } catch (error: any) {
       console.error('Erro ao enviar pedido:', error)
       
       if (error.response?.status === 429) {
          toast.error('Muitos pedidos em pouco tempo. Aguarde.');
       } else {
          // INTERNET CAIU OU ERRO DE SERVIDOR
          // O dado já está salvo localmente como 'pending'
          toast.success('Pedido salvo localmente! Tentaremos sincronizar quando houver conexão.', { duration: 5000 });
          setSubmitted(true); // Permitimos que o usuário veja a tela de sucesso local
       }
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#0a1628] flex flex-col items-center justify-center px-6 transition-colors">
        <div
          className="flex items-center justify-center w-20 h-20 rounded-full mb-6"
          style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', boxShadow: '0 12px 32px -8px rgba(27,94,32,0.5)' }}
        >
          <span className="material-symbols-outlined text-white text-[44px]" style={{ fontVariationSettings: `'FILL' 1` }}>
            check_circle
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white font-headline text-center">{t('request.successTitle')}</h2>
        <p className="text-slate-500 text-center mt-2 leading-relaxed">
          {t('request.successDesc').replace('{type}', TYPES.find(t => t.value === selectedType)?.label || '')}
        </p>
        <div className="mt-6 bg-white dark:bg-white/5 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/10 w-full max-w-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">{t('request.summary')}</p>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>{t('request.type')}</span>
              <span className="font-bold">{TYPES.find(t => t.value === selectedType)?.label} {subTypes.length > 0 ? `(${subTypes.join(', ')})` : ''}</span>
            </div>
            {description && (
              <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-lg mt-1 italic text-xs">
                 &quot;{description}&quot;
              </div>
            )}
            <div className="flex justify-between items-center">
              <span>Urgência</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${urgency === 'high' ? 'text-red-700 bg-red-100' : urgency === 'medium' ? 'text-orange-700 bg-orange-100' : 'text-emerald-700 bg-emerald-100'}`}>
                {urgency === 'high' ? 'Emergência' : urgency === 'medium' ? 'Moderado' : 'Monitorando'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t('request.name')}</span>
              <span className="font-bold">{name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('request.people')}</span>
              <span className="font-bold">{people}</span>
            </div>
            <div className="flex justify-between">
              <span>Local</span>
              <span className="font-bold text-right max-w-[180px] truncate">{locationAddress}</span>
            </div>
          </div>
        </div>
        <Link href="/help?module=help" className="mt-8 text-blue-600 font-bold text-sm bg-blue-50 px-6 py-3 rounded-xl border border-blue-100">
          {t('request.backHome')}
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-surface dark:bg-[#0a1628] pt-16 pb-[120px] transition-colors">
      <AppHeader />

      <div className="px-4 pt-6 shrink-0 max-w-2xl mx-auto">
        {/* Navigation / Back */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/help?module=help" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Voltar</span>
          </Link>
        </div>

        <section className="mb-8">
          <h1 className="text-3xl font-extrabold font-headline text-on-surface dark:text-white tracking-tight leading-tight">
            {t('request.title')}
          </h1>
          <p className="mt-2 text-on-surface-variant dark:text-slate-400 font-body">
            {t('request.noLogin')}
          </p>
        </section>
      </div>

      <form onSubmit={handleSubmit} className="px-4 pt-5 pb-[220px] space-y-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">{t('request.helpType')}</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {TYPES.map((t_item) => (
              <button
                key={t_item.value}
                type="button"
                onClick={() => {
                  setSelectedType(t_item.value as any);
                  setSubTypes([]); // Limpa sub-opções ao trocar de tipo principal
                  if (t_item.value === 'transport' || t_item.value === 'volunteer') {
                    setShowSubTypeModal(true);
                  }
                }}
                className={`flex flex-col items-start gap-2 rounded-2xl p-4 border-2 text-left transition-all active:scale-[0.97] ${
                  selectedType === t_item.value
                    ? 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'
                    : 'border-slate-100 dark:border-white/5 bg-white dark:bg-white/5 shadow-sm'
                }`}
                style={{ borderColor: selectedType === t_item.value ? t_item.color : undefined }}
              >
                <span
                  className={`material-symbols-outlined text-[28px] ${selectedType === t_item.value ? '' : 'text-slate-400 opacity-60'}`}
                  style={{ 
                    color: selectedType === t_item.value ? t_item.color : undefined,
                    fontVariationSettings: `'FILL' ${selectedType === t_item.value ? 1 : 0}` 
                  }}
                >
                  {t_item.icon}
                </span>
                <div>
                  <p className="font-black text-xs uppercase tracking-tight" style={{ color: selectedType === t_item.value ? t_item.color : undefined }}>
                    {t_item.label}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Badges de Seleção (Movidas para baixo) */}
          {subTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-top-2">
              {subTypes.map(tag => {
                const currentColor = TYPES.find(to => to.value === selectedType)?.color || '#3b82f6';
                return (
                  <span 
                    key={tag} 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-colors"
                    style={{ 
                      backgroundColor: `${currentColor}15`, 
                      color: currentColor,
                      borderColor: `${currentColor}30`
                    }}
                  >
                    <span className="material-symbols-outlined text-sm">done</span>
                    {tag}
                  </span>
                )
              })}
              <button 
                type="button"
                onClick={() => setShowSubTypeModal(true)}
                className="text-[10px] font-bold text-primary underline underline-offset-2 ml-1"
              >
                Editar
              </button>
            </div>
          )}
        </section>

        {/* DETALHES DO PEDIDO (Novo campo sugerido) */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-500">
           <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Descrição dos Detalhes</p>
           <textarea 
             placeholder={selectedType === 'volunteer' ? 'Ex: Preciso de voluntários para limpar a escola X...' : 'Dê mais detalhes sobre sua necessidade aqui...'}
             value={description}
             onChange={(e) => setDescription(e.target.value)}
             className="w-full min-h-[100px] p-4 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm"
           />
        </section>

        {/* Urgency */}
        <section>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Grau de Urgência</p>
          <div className="flex gap-2">
            {[
              { value: 'high', label: 'Emergência', icon: 'warning', color: 'text-error bg-error/10 border-error/20' },
              { value: 'medium', label: 'Moderado', icon: 'priority_high', color: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20' },
              { value: 'low', label: 'Monitorando', icon: 'info', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' }
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setUrgency(opt.value as any)}
                className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-all active:scale-95 ${
                  urgency === opt.value
                    ? `border-current shadow-sm ${opt.color}`
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-400 grayscale opacity-70 hover:opacity-100 hover:grayscale-0'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: `'FILL' ${urgency === opt.value ? 1 : 0}` }}>
                  {opt.icon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Location */}
        <section>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">{t('request.location')}</p>
          <LocationIndicator 
            address={locationAddress} 
            status={locationStatus} 
            onClick={() => setShowMapModal(true)} 
          />
        </section>

        {/* Photo */}
        <section>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
            {t('request.photo')} <span className="opacity-60">{t('request.photoDesc')}</span>
          </p>
          <CameraInput onCapture={handlePhotoCapture} preview={photoPreview} />
        </section>

        {/* Contact info form */}
        <section className="bg-surface-container-lowest dark:bg-white/5 rounded-[2rem] p-6 border border-outline-variant/10 dark:border-white/5 shadow-sm space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
              <span className="material-symbols-outlined text-[22px]">contact_phone</span>
            </div>
            <p className="text-sm font-extrabold text-on-surface dark:text-white uppercase tracking-widest">{t('request.contactInfo')}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">{t('request.name')}</p>
              <TextInput 
                placeholder="Ex: João Silva" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-surface-container-low border-none rounded-2xl"
              />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-500 mb-1.5 ml-1 uppercase tracking-wider">{t('request.phone')}</p>
              <TextInput 
                placeholder="(00) 00000-0000" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                type="tel"
                className="bg-surface-container-low border-none rounded-2xl"
              />
            </div>
          </div>

          {/* Se estiver logado (nome preenchido), não mostra o banner informativo */}
          {!name && (
            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
              <p className="text-[11px] text-on-primary-fixed-variant leading-relaxed font-medium">
                {t('request.verifiedTip')}
              </p>
            </div>
          )}
        </section>

        {/* People count */}
        <section className="bg-surface-container-lowest dark:bg-white/5 rounded-[2rem] p-6 border border-outline-variant/10 dark:border-white/5 shadow-sm">
          <div className="text-sm font-extrabold text-on-surface dark:text-white uppercase tracking-widest mb-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary border border-secondary/10">
              <span className="material-symbols-outlined text-[22px]">diversity_3</span>
            </div>
            {t('request.peopleCount')}
          </div>
          <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 rounded-3xl p-3 border border-slate-200 dark:border-white/5">
            <button
              type="button"
              onClick={() => setPeople(Math.max(1, people - 1))}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-white/10 text-slate-700 dark:text-white text-2xl font-bold active:scale-95 transition-all shadow-sm border border-slate-200 dark:border-white/10"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <div className="flex-1 text-center">
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white font-headline leading-none block">{people}</span>
              <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest mt-2">{people === 1 ? t('request.person') : t('request.people')}</p>
            </div>
            <button
              type="button"
              onClick={() => setPeople(Math.min(99, people + 1))}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white text-2xl font-bold active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </section>
      </form>

      {/* Fixed submit button - positioned higher to clear bottom nav */}
      <div className="fixed bottom-32 left-0 w-full px-4 pt-16 pb-2 bg-gradient-to-t from-surface dark:from-[#0a1628] via-surface/80 dark:via-[#0a1628]/80 to-transparent pointer-events-none z-50 transition-all">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <button
            type="submit"
            disabled={submitting}
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-4 rounded-[2rem] py-5 font-bold text-on-primary text-xl font-headline transition-all active:scale-[0.97] disabled:opacity-60 shadow-2xl shadow-error/30"
            style={{ background: 'linear-gradient(135deg, #ba1a1a, #ff5449)' }}
          >
            {submitting ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: `'FILL' 1` }}>send</span>
            )}
            <span className="tracking-tight">{submitting ? t('request.submitting') : t('request.submit')}</span>
          </button>
        </div>
      </div>

      {/* BOTTOM SHEET DE SUB-TIPOS */}
      {showSubTypeModal && (
        <div className="fixed inset-0 z-[110] flex items-end">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSubTypeModal(false)} />
           <div className="relative w-full bg-white dark:bg-[#0d2247] rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-6" />
              <div className="flex items-center justify-between mb-2">
                 <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {selectedType === 'transport' ? 'Tipo de Transporte' : 'Necessidade de Voluntários'}
                 </h2>
                 <button 
                   onClick={() => setShowSubTypeModal(false)} 
                   className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-colors"
                   style={{ backgroundColor: `${TYPES.find(to => to.value === selectedType)?.color}15`, color: TYPES.find(to => to.value === selectedType)?.color }}
                 >
                    Ok
                 </button>
              </div>
              <p className="text-xs text-slate-500 mb-6">Você pode selecionar várias opções.</p>
              
              <div className="grid gap-3 mb-6">
                 {(selectedType === 'transport' 
                   ? ['Carro / Jipe / Moto', 'Caminhão de Mantimentos', 'Barco / Jet-ski', 'Aeronave / Drone']
                   : ['Cozinha e Alimentos', 'Limpeza e Pesado', 'Logística / Triagem', 'Saúde e Primeiros Socorros', 'Acolhimento / Recreação']
                 ).map(option => {
                    const isSelected = subTypes.includes(option);
                    const currentColor = TYPES.find(to => to.value === selectedType)?.color || '#3b82f6';
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => { 
                          if (isSelected) setSubTypes(subTypes.filter(s => s !== option));
                          else setSubTypes([...subTypes, option]);
                        }}
                        className="w-full flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all active:scale-[0.98]"
                        style={{ 
                          backgroundColor: isSelected ? `${currentColor}10` : undefined,
                          borderColor: isSelected ? currentColor : 'transparent'
                        }}
                      >
                         <span className={`font-bold text-sm tracking-tight ${isSelected ? '' : 'text-slate-800 dark:text-slate-200'}`} style={{ color: isSelected ? currentColor : undefined }}>
                           {option}
                         </span>
                         <span className="material-symbols-outlined" style={{ color: isSelected ? currentColor : '#cbd5e1' }}>
                            {isSelected ? 'check_circle' : 'add_circle'}
                         </span>
                      </button>
                    )
                 })}
              </div>
              
              <button
                onClick={() => setShowSubTypeModal(false)}
                className="w-full py-4 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95"
                style={{ 
                  backgroundColor: TYPES.find(to => to.value === selectedType)?.color,
                  boxShadow: `0 10px 25px -5px ${TYPES.find(to => to.value === selectedType)?.color}50`
                }}
              >
                 Concluir Seleção
              </button>
           </div>
        </div>
      )}

      {/* MODAL DE MAPA */}
      {showMapModal && (
        <div className="fixed inset-0 z-[100] bg-surface dark:bg-[#0a1628] flex flex-col">
          <div className="flex flex-col gap-3 p-4 shrink-0 glass-header border-b border-slate-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setShowMapModal(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 active:scale-95"
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
              </button>
              <div className="flex-1">
                <p className="text-sm font-bold uppercase tracking-widest text-on-surface dark:text-white">Localização</p>
                <p className="text-[10px] text-slate-500">Mova o mapa ou complete os campos</p>
              </div>
              <button 
                type="button"
                title="Buscar no mapa pelo endereço digitado"
                onClick={searchAddressForCoords}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 active:scale-95 transition-all mr-2"
              >
                <span className="material-symbols-outlined text-[20px]">travel_explore</span>
              </button>
              <button 
                type="button"
                onClick={() => {
                  setLocationStatus('ready');
                  if (addressDetails.street) {
                    const { street, number, complement, neighborhood, city, state } = addressDetails;
                    const parts = [
                      street ? `${street}${number ? `, ${number}` : ''}${complement ? ` - ${complement}` : ''}` : '',
                      neighborhood,
                      city ? (state ? `${city} - ${state}` : city) : state
                    ].filter(Boolean);
                    setLocationAddress(parts.join(' / '));
                  } else if (!locationAddress || locationAddress === 'Obtendo localização...') {
                    setLocationAddress(`Lat: ${pickedLoc[0].toFixed(5)}, Lng: ${pickedLoc[1].toFixed(5)}`);
                  }
                  setShowMapModal(false);
                }} 
                className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold uppercase tracking-wider text-xs active:scale-95 transition-transform shadow-md shadow-primary/30"
              >
                Confirmar
              </button>
            </div>
            
             {/* Formulário Detalhado para o Endereço - Compacto */}
            <div className="space-y-2 mt-2">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Rua / Logradouro</p>
                <TextInput 
                  value={addressDetails.street} 
                  onChange={(e) => setAddressDetails({...addressDetails, street: e.target.value})} 
                  placeholder="Rua..." 
                  className="!py-2 !text-xs !rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Nº</p>
                  <TextInput 
                    value={addressDetails.number} 
                    onChange={(e) => setAddressDetails({...addressDetails, number: e.target.value})} 
                    placeholder="100" 
                    className="!py-2 !text-xs !rounded-xl"
                  />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Compl.</p>
                  <TextInput 
                    value={addressDetails.complement} 
                    onChange={(e) => setAddressDetails({...addressDetails, complement: e.target.value})} 
                    placeholder="Apt..." 
                    className="!py-2 !text-xs !rounded-xl"
                  />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">UF</p>
                  <TextInput 
                    value={addressDetails.state} 
                    onChange={(e) => setAddressDetails({...addressDetails, state: e.target.value.toUpperCase()})} 
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
                    value={addressDetails.neighborhood} 
                    onChange={(e) => setAddressDetails({...addressDetails, neighborhood: e.target.value})} 
                    placeholder="Bairro..." 
                    className="!py-2 !text-xs !rounded-xl"
                  />
                </div>
                <div className="col-span-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Cidade</p>
                  <TextInput 
                    value={addressDetails.city} 
                    onChange={(e) => setAddressDetails({...addressDetails, city: e.target.value})} 
                    placeholder="Cidade..." 
                    className="!py-2 !text-xs !rounded-xl"
                  />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">CEP</p>
                  <TextInput 
                    value={addressDetails.zipCode} 
                    onChange={(e) => setAddressDetails({...addressDetails, zipCode: e.target.value})} 
                    placeholder="00000" 
                    className="!py-2 !text-xs !rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative bg-slate-100 dark:bg-slate-900 border-t-2 border-primary/20">
            <MapComponent onUpdateCenter={(center) => { setPickedLoc(center); reverseGeocode(center); }} externalCenter={mapFlyTrigger} />
          </div>
        </div>
      )}
    </main>
  )
}

export default function RequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#0a1628] flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" /></div>}>
      <RequestForm />
    </Suspense>
  )
}
