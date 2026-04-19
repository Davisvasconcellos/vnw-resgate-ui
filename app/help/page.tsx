'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useI18n } from '@/components/i18n/I18nProvider'
import AppHeader from '@/components/headers/AppHeader'
import { getMyRequests } from '@/services/fingerprint'
import { api } from '@/services/api'

export default function HelpPage() {
  const { t } = useI18n()
  const [activeRequestsCount, setActiveRequestsCount] = useState<number>(0)
  
  useEffect(() => {
    async function fetchCounts() {
      const codes = getMyRequests()
      if (codes.length === 0) return

      try {
        const res = await api.get(`/requests?id_codes=${codes.join(',')}`)
        if (res.data.success) {
          // Contar apenas os que não estão resolvidos
          const active = res.data.data.filter((r: any) => r.status !== 'resolved').length
          setActiveRequestsCount(active)
        }
      } catch (error) {
        console.error('Erro ao contar pedidos ativos:', error)
      }
    }
    fetchCounts()
  }, [])

  const HELP_CARDS = [
    {
      label: t('help.myRequests') || 'Minhas Solicitações',
      icon: 'list_alt',
      description: t('help.myRequestsDesc') || 'Acompanhe o status e as mensagens dos seus pedidos de ajuda.',
      color: '#1565C0',
      bg: 'rgba(21,101,192,0.1)',
      border: 'rgba(21,101,192,0.2)',
      href: '/help/my-requests',
      span: 'col-span-2',
      badge: activeRequestsCount > 0 ? t('help.activeBadge').replace('{count}', String(activeRequestsCount)) : null
    },
    {
      label: t('help.missing') || 'Pessoas Desaparecidas',
      icon: 'person_search',
      description: t('help.missingDesc') || 'Consultar ou registrar pessoas não localizadas.',
      color: '#7B1FA2',
      bg: 'rgba(123,31,162,0.1)',
      border: 'rgba(123,31,162,0.2)',
      href: '/missing?module=help',
      span: 'col-span-2'
    },
    {
      label: t('help.shelters') || 'Abrigos Próximos',
      icon: 'house',
      description: t('help.sheltersDesc') || 'Encontre locais de acolhimento seguros na região.',
      color: '#0277BD',
      bg: 'rgba(2,119,189,0.1)',
      border: 'rgba(2,119,189,0.2)',
      href: '/help/shelters?module=help',
      span: 'col-span-1'
    },
    {
      label: t('help.phones') || 'Tel. Úteis',
      icon: 'call',
      description: t('help.phonesDesc') || 'Contatos de emergência e apoio.',
      color: '#E65100',
      bg: 'rgba(230,81,0,0.1)',
      border: 'rgba(230,81,0,0.2)',
      href: '/help/phones?module=help',
      span: 'col-span-1'
    },
  ]

  return (
    <main className="min-h-screen bg-surface dark:bg-[#0a1628] pb-32 transition-colors">
      <AppHeader />

      <div className="px-4 pt-24 pb-8 space-y-8 max-w-2xl mx-auto font-sans">
        {/* Intro Section */}
        <section className="px-1">
          <h1 className="text-4xl font-extrabold font-headline text-on-surface dark:text-white tracking-tight leading-tight">
             {t('help.centralTitle')}
          </h1>
          <p className="mt-2 text-on-surface-variant dark:text-slate-400 font-body text-base font-medium">
             {t('help.centralSubtitle')}
          </p>
        </section>

        {/* SOS Quick Action Banner */}
        <Link href="/request?type=rescue&module=help" className="block">
          <div
            className="flex items-center gap-4 rounded-[2.2rem] p-5 active:scale-[0.98] transition-all relative overflow-hidden group shadow-xl border border-red-500/20"
            style={{ background: 'linear-gradient(135deg, #ba1a1a, #ff5449)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-700" />
            
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md shrink-0">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: `'FILL' 1` }}>sos</span>
            </div>
            
            <div className="flex-1 relative z-10">
              <p className="text-white font-extrabold font-headline text-lg leading-none">{t('help.requestNow')}</p>
              <p className="text-white/80 text-[11px] font-medium mt-1 leading-tight">{t('help.requestNowDesc')}</p>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </div>
          </div>
        </Link>

        {/* Action Grid */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            {HELP_CARDS.map((card) => (
              <Link key={card.label} href={card.href} className={`group ${card.span || 'col-span-1'}`}>
                <div
                  className="flex flex-col items-start gap-4 rounded-[2.5rem] p-6 active:scale-[0.97] transition-all min-h-[170px] shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10"
                >
                  {/* Decorative faint icon in background */}
                  <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-[90px] opacity-[0.03] rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-6" style={{ color: card.color }}>
                    {card.icon}
                  </span>
                  
                  <div className="flex w-full items-start justify-between relative z-10">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 transition-colors group-hover:scale-110 shadow-sm" style={{ background: card.bg, border: `1px solid ${card.border}` }}>
                      <span
                        className="material-symbols-outlined text-[28px]"
                        style={{ color: card.color, fontVariationSettings: `'FILL' 1` }}
                      >
                        {card.icon}
                      </span>
                    </div>
                    {card.badge && (
                      <span className="text-[10px] font-black px-3 py-1 bg-primary text-white rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                        {card.badge}
                      </span>
                    )}
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-white/10 flex items-center justify-center border border-slate-100 dark:border-white/10 transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </div>
                  </div>
                  <div className="flex-1 relative z-10 w-full mt-3">
                    <p className="font-extrabold text-[#191C1E] dark:text-white font-headline text-xl leading-tight group-hover:text-primary transition-colors">{card.label}</p>
                    <p className="text-[11px] text-on-surface-variant dark:text-slate-400 mt-2 leading-relaxed font-medium pr-6">{card.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Info Note */}
        <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-start gap-4 opacity-80">
           <span className="material-symbols-outlined text-primary text-[24px]">info</span>
           <div>
             <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest mb-1">{t('help.notesTitle')}</p>
             <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
               {t('help.notesDesc')}
             </p>
           </div>
        </div>
      </div>
    </main>
  )
}


