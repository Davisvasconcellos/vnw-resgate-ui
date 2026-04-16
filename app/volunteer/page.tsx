'use client'

import { useState } from 'react'
import { useI18n } from '@/components/i18n/I18nProvider'
import AppHeader from '@/components/headers/AppHeader'
import BottomNavVolunteer from '@/components/BottomNavVolunteer'

interface VolunteerRequest {
  id: string
  title: string
  location: string
  distance: string
  description: string
  category: 'clean' | 'sort' | 'cook' | 'health' | 'rescue'
  volunteersNeeded: number
  volunteersEnrolled: number
  urgency: 'high' | 'medium' | 'low'
}

const OPPORTUNITIES: VolunteerRequest[] = [
  {
    id: 'v-1',
    title: 'Triagem de Alimentos e Roupas',
    location: 'Ginásio da Trindade',
    distance: '1.2 km',
    description: 'Precisamos de pessoas para organizar as doações que chegam e montar cestas básicas para os abrigos da região norte.',
    category: 'sort',
    volunteersNeeded: 10,
    volunteersEnrolled: 4,
    urgency: 'medium'
  },
  {
    id: 'v-2',
    title: 'Limpeza de Áreas Residenciais',
    location: 'Saco Grande / João Paulo',
    distance: '4.5 km',
    description: 'Mutirão para retirada de lama e limpeza externa de residências de idosos afetados pelas chuvas.',
    category: 'clean',
    volunteersNeeded: 15,
    volunteersEnrolled: 2,
    urgency: 'high'
  },
  {
    id: 'v-3',
    title: 'Cozinha Comunitária',
    location: 'Escola Mauro Ramos',
    distance: '2.8 km',
    description: 'Auxílio no preparo de marmitas para o jantar e organização da bancada de alimentos.',
    category: 'cook',
    volunteersNeeded: 5,
    volunteersEnrolled: 3,
    urgency: 'low'
  }
]

const CATEGORY_ICONS = {
  clean: 'mop',
  sort: 'inventory_2',
  cook: 'restaurant',
  health: 'medical_services',
  rescue: 'sos'
}

const CATEGORY_LABELS = {
  clean: 'Limpeza',
  sort: 'Triagem',
  cook: 'Cozinha',
  health: 'Apoio Saúde',
  rescue: 'Resgate'
}

export default function VolunteerPage() {
  const { t } = useI18n()
  const [selectedRequest, setSelectedRequest] = useState<VolunteerRequest | null>(null)
  const [enrolledIds, setEnrolledIds] = useState<string[]>([])

  const handleEnroll = (id: string) => {
    setEnrolledIds([...enrolledIds, id])
    setSelectedRequest(null)
    alert('Você se candidatou com sucesso! Verifique "Minhas Atividades".')
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pb-32 pt-16">
      <AppHeader />

      <div className="px-4 pt-8">
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-1">
             <span className="material-symbols-outlined text-pink-600">volunteer_activism</span>
             <span className="text-[10px] font-bold uppercase tracking-widest text-pink-600">Área do Voluntário</span>
          </div>
          <h1 className="text-3xl font-extrabold font-headline text-slate-900 tracking-tight leading-tight">
            Oportunidades
          </h1>
          <p className="mt-2 text-slate-500 font-body text-sm">
            Encontre locais que precisam da sua força de trabalho hoje.
          </p>
        </section>
      </div>

      {/* List of Cards */}
      <div className="px-4 space-y-4 max-w-2xl mx-auto w-full">
        {OPPORTUNITIES.map((req) => (
          <button
            key={req.id}
            onClick={() => setSelectedRequest(req)}
            className="w-full text-left bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden group active:scale-[0.98]"
          >
            {/* Visual Urgency Indicator */}
            <div className={`absolute top-0 right-0 w-2 h-full ${req.urgency === 'high' ? 'bg-red-500' : req.urgency === 'medium' ? 'bg-orange-400' : 'bg-green-400'}`} />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                <span className="material-symbols-outlined text-slate-600 text-[24px]">
                  {CATEGORY_ICONS[req.category]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    {CATEGORY_LABELS[req.category]}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {req.distance}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-800 text-lg font-headline leading-tight line-clamp-1">{req.title}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {req.location}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-pink-100 text-pink-600 text-[8px] font-bold flex items-center justify-center">
                      +{req.volunteersEnrolled}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {req.volunteersEnrolled} / {req.volunteersNeeded} Vagas
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
          <div className="relative z-10 bg-white rounded-t-[3rem] px-6 pt-5 pb-32 reveal-pop max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-8 shrink-0" />
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 border border-pink-100 shadow-sm">
                <span className="material-symbols-outlined text-[32px]">
                   {CATEGORY_ICONS[selectedRequest.category]}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-500">
                  {CATEGORY_LABELS[selectedRequest.category]}
                </span>
                <h2 className="text-2xl font-black text-slate-900 font-headline leading-tight">
                  {selectedRequest.title}
                </h2>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-4 flex items-center gap-4 mb-8">
              <div className="flex-1 border-r border-slate-200">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Localização</p>
                <p className="text-sm font-bold text-slate-800">{selectedRequest.location}</p>
              </div>
              <div className="flex-1 px-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Urgência</p>
                <div className="flex items-center gap-1.5">
                   <div className={`w-2 h-2 rounded-full ${selectedRequest.urgency === 'high' ? 'bg-red-500' : 'bg-orange-400'}`} />
                   <p className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">
                      {selectedRequest.urgency === 'high' ? 'Crítica' : 'Média'}
                   </p>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">O que você fará</h4>
              <p className="text-slate-600 text-base leading-relaxed font-body">
                {selectedRequest.description}
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-500 font-medium whitespace-nowrap">
                  <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                  Não precisa de experiência prévia
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-500 font-medium whitespace-nowrap">
                  <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>
                  Equipamentos de proteção fornecidos no local
                </li>
              </ul>
            </div>

            <button
               onClick={() => handleEnroll(selectedRequest.id)}
               disabled={enrolledIds.includes(selectedRequest.id)}
               className={`w-full py-4 rounded-2xl font-black text-white text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${enrolledIds.includes(selectedRequest.id) ? 'bg-slate-400 shadow-none' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-600/30'}`}
            >
              {enrolledIds.includes(selectedRequest.id) ? (
                <>Candidatado ✓</>
              ) : (
                <>Aceitar e Iniciar</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Navbar Exclusiva de Voluntário */}
      <BottomNavVolunteer />
    </main>
  )
}
