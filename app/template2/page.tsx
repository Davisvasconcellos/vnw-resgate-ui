'use client'

import { useState } from 'react'
import Image from 'next/image'
import AppHeader from '@/components/headers/AppHeader'

/**
 * PAGE: /template
 * THE DEFINITIVE MASTER TEMPLATE (VNW Resgate V1.0)
 * Unindo Legado de Design, Componentes da Aplicação Final e Novos Elementos Premium.
 */
export default function TemplatePage() {
  const [showModal, setShowModal] = useState(false)
  const [toggleActive, setToggleActive] = useState('one')
  const [showPopover, setShowPopover] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [activeTabStyle, setActiveTabStyle] = useState('tab1')
  const [activeTabFilter, setActiveTabFilter] = useState('active')

  const tableData = [
    { id: '#RE-001', name: 'Alimentos', status: 'entregue', priority: 'baixa', date: '10/05/2026' },
    { id: '#RE-002', name: 'Resgate Barco', status: 'em_rota', priority: 'alta', date: '12/05/2026' },
    { id: '#RE-003', name: 'Kit Médico', status: 'pendente', priority: 'crítica', date: '14/05/2026' },
  ]

  return (
    <div className="bg-surface dark:bg-[#0a1628] text-on-surface dark:text-white min-h-screen pb-60 transition-colors font-sans antialiased">
      <AppHeader />

      <main className="pt-24 px-6 max-w-6xl mx-auto space-y-24">

        {/* --- 00. STATUS & FILTROS (RESTORED GROUP BUTTONS & BORDER CARDS) --- */}
        <section className="space-y-10">
          <h2 className="text-xs font-black text-red-600 uppercase tracking-[0.3em] border-l-4 border-red-600 pl-4">00. Status & Filtros Rápidos (Restaurado)</h2>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Group Buttons (My Requests Style) */}
            <div className="bg-slate-100 dark:bg-white/5 p-1 rounded-2xl flex w-full max-w-[320px] shadow-sm">
              <button
                onClick={() => setActiveTabFilter('active')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTabFilter === 'active'
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-md'
                    : 'text-slate-400'
                  }`}
              >
                Ativos (12)
              </button>
              <button
                onClick={() => setActiveTabFilter('history')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTabFilter === 'history'
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-md'
                    : 'text-slate-400'
                  }`}
              >
                Concluídos (45)
              </button>
            </div>

            {/* Cards with Colored Borders (SOS/Rescue Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="bg-white dark:bg-white/5 border-l-8 border-red-600 rounded-3xl p-6 shadow-sm flex items-center justify-between group cursor-pointer hover:bg-red-50/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl font-black">emergency</span>
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-tighter text-slate-900 dark:text-white leading-tight">Chamado SOS</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Prioridade Máxima</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-red-600 animate-pulse">priority_high</span>
              </div>

              <div className="bg-white dark:bg-white/5 border-l-8 border-blue-500 rounded-3xl p-6 shadow-sm flex items-center justify-between group cursor-pointer hover:bg-blue-50/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl">local_shipping</span>
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase tracking-tighter text-slate-900 dark:text-white leading-tight">Logística</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Transporte de Carga</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-blue-500 uppercase">Em Rota</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- 01. DASHBOARD & STATS (HARVESTED) --- */}
        <section className="space-y-10">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">01. Dashboard & Analíticos</h2>

          <div className="bg-white dark:bg-[#0d2247] rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 border border-slate-100 dark:border-white/5">
            <div className="flex flex-col gap-2 w-full md:w-1/2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ganhos Semanais (Legacy)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-primary tracking-tighter">R$ 1.284</span>
                <span className="text-emerald-500 font-black flex items-center gap-1 text-[10px] bg-emerald-500/10 px-3 py-1 rounded-full uppercase">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 12%
                </span>
              </div>
            </div>
            <div className="w-full md:w-px h-px md:h-20 bg-slate-100 dark:bg-white/10" />
            <div className="flex flex-col gap-2 w-full md:w-1/3 text-center md:text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Avaliação Global</span>
              <div className="flex items-center justify-center md:justify-start gap-1">
                <span className="text-4xl font-black text-tertiary">4.9</span>
                <div className="flex gap-0.5 ml-2 text-tertiary">
                  {[1, 2, 3, 4].map(i => <span key={i} className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                  <span className="material-symbols-outlined text-[20px]">star_half</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 text-primary rounded-[2rem] p-6 flex flex-col justify-between h-40 shadow-sm">
              <span className="material-symbols-outlined text-4xl">task_alt</span>
              <div>
                <div className="text-3xl font-black tracking-tighter">18</div>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-70">Missões Concluídas</div>
              </div>
            </div>
            <div className="bg-blue-500/10 text-blue-500 rounded-[2rem] p-6 flex flex-col justify-between h-40 shadow-sm">
              <span className="material-symbols-outlined text-4xl">schedule</span>
              <div>
                <div className="text-3xl font-black tracking-tighter">34h</div>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-70">Tempo em Campo</div>
              </div>
            </div>
            <div className="bg-slate-100 dark:bg-white/5 rounded-[2rem] p-6 h-40 flex flex-col justify-between shadow-sm">
              <span className="material-symbols-outlined text-4xl text-slate-300">group</span>
              <div>
                <div className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">124</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Apoios Recebidos</div>
              </div>
            </div>
            <div className="bg-emerald-500/10 text-emerald-600 rounded-[2rem] p-6 h-40 flex flex-col justify-between shadow-sm">
              <span className="material-symbols-outlined text-4xl">verified_user</span>
              <div>
                <div className="text-3xl font-black tracking-tighter">VNW</div>
                <div className="text-[9px] font-black uppercase tracking-widest opacity-70">Selos Ativos</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 02. BUSCA & MATCH (HARVESTED) --- */}
        <section className="space-y-10">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">02. Busca & Match (Legacy)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-white shadow-2xl shadow-primary/20 group col-span-1 md:col-span-2">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-all duration-1000" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                      <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    </div>
                    <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">IA Ativa</span>
                  </div>
                  <h2 className="text-4xl font-black font-headline tracking-tighter leading-tight mb-4">Conectando Recursos...</h2>
                  <button className="bg-white text-primary px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Ativar Agora</button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-[2rem] p-6 flex items-center gap-6 border border-slate-100 dark:border-white/5 hover:shadow-lg transition-all cursor-pointer group">
              <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 ring-4 ring-slate-50 dark:ring-white/5 shadow-md">
                <img src="https://i.pravatar.cc/150?u=mari" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-slate-900 dark:text-white text-lg leading-none">Mariana Silva</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Logística de Alimentos</p>
                <div className="mt-4 flex justify-between items-center text-[10px] font-black">
                  <span className="text-primary uppercase tracking-tighter">VNW PRO</span>
                  <span className="text-slate-300 font-bold uppercase">1.2km</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 03. DEPOIMENTOS & CONTEÚDO (MIXED) --- */}
        <section className="space-y-10">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">03. Depoimentos & Conteúdo</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial (Legacy) */}
            <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 relative shadow-sm">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-tertiary text-white rounded-full flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[20px]">format_quote</span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-200"><img src="https://i.pravatar.cc/100?u=rev" alt="rev" /></div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">Roberto Silva</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Feedback</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed">"O atendimento foi funcional e rápido nas orientações."</p>
            </div>

            {/* Missing Card (Final App) */}
            <div className="bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm group">
              <div className="aspect-[4/5] relative bg-slate-200 overflow-hidden">
                <img src="https://i.pravatar.cc/300?u=lucas" alt="m" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4"><span className="px-3 py-1 rounded-lg bg-red-600/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest border border-white/20">Desaparecido</span></div>
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                  <h4 className="text-white font-black text-xl font-headline uppercase leading-none">Lucas Fernandes</h4>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">12 Anos • Canasvieiras</p>
                </div>
              </div>
              <div className="p-4 bg-slate-900 text-center cursor-pointer active:bg-red-600 transition-colors">
                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Informar Localização</span>
              </div>
            </div>

            {/* Slim Mission (Final App) */}
            <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-6 border border-slate-100 dark:border-white/10 group active:scale-95 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[28px]">emergency</span></div>
                <span className="material-symbols-outlined text-red-500 font-black text-[20px]">priority_high</span>
              </div>
              <h4 className="font-black text-sm uppercase tracking-tighter mb-2">Resgate Crítico</h4>
              <p className="text-[11px] text-slate-500 italic line-clamp-2">"Setor D-4: Família aguarda apoio em área de risco."</p>
              <div className="mt-8 pt-4 border-t border-slate-50 dark:border-white/5 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <span>Há 5 min</span>
                <span className="text-primary group-hover:underline">Aceitar Missão</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- 04. FORMULÁRIOS & CONTROLES (MIXED) --- */}
        <section className="space-y-10">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">04. Formulários & Parâmetros</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Legacy Controls */}
            <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm space-y-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarifa & Tempo (Legacy)</h3>
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-3xl">bed</span></div>
                  <p className="font-black text-sm uppercase leading-none">Alojamento</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl px-3 py-2">
                    <span className="text-primary font-black mr-1">$</span>
                    <input className="w-10 bg-transparent border-none p-0 font-black text-sm outline-none" type="number" defaultValue={25} />
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-white/5">
                <div className="flex justify-between items-end"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempo Disponível</span><span className="text-xl font-black text-secondary">60 min</span></div>
                <input className="w-full h-2.5 bg-slate-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-secondary" type="range" defaultValue={60} min={15} max={120} />
              </div>
            </div>

            {/* New Controls */}
            <div className="space-y-8">
              <div className="relative group">
                <div className="relative flex items-center">
                  <span className="absolute left-6 font-black text-primary text-2xl z-10 transition-transform group-focus-within:scale-110">R$</span>
                  <input className="w-full pl-16 pr-8 py-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] focus:ring-4 focus:ring-primary/10 font-black text-2xl text-slate-900 dark:text-white outline-none shadow-sm transition-all" type="number" defaultValue={750} />
                  <span className="absolute right-8 text-[10px] font-black text-slate-300 uppercase tracking-widest">/MÊS</span>
                </div>
              </div>
              <div className="bg-white dark:bg-white/5 p-1.5 rounded-[2rem] flex border border-slate-200/10 shadow-sm">
                {['Português', 'English', 'Español'].map((l, i) => (
                  <button key={l} onClick={() => setToggleActive(i === 0 ? 'one' : i === 1 ? 'two' : 'three')} className={`flex-1 py-3 px-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${((i === 0 && toggleActive === 'one') || (i === 1 && toggleActive === 'two') || (i === 2 && toggleActive === 'three')) ? 'bg-primary text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>{l}</button>
                ))}
              </div>
              {/* Stepper +/- */}
              <div className="bg-white dark:bg-white/5 rounded-[2rem] p-6 border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                <span className="font-black text-sm uppercase tracking-tighter ml-2">Pessoas no Grupo</span>
                <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full">
                  <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-300"><span className="material-symbols-outlined">remove</span></button>
                  <span className="font-black text-lg w-6 text-center">3</span>
                  <button className="w-10 h-10 rounded-full bg-primary text-white shadow-lg flex items-center justify-center"><span className="material-symbols-outlined">add</span></button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 05. TABELAS & FEEDS (NEW FROM RECENT REQUEST) --- */}
        <section className="space-y-10">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">05. Tabelas & Feeds</h2>

          <div className="bg-white dark:bg-white/5 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-white/10 shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5">
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">ID/Missão</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Prioridade</th>
                  <th className="px-8 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase">{row.id}</td>
                    <td className="px-8 py-5"><span className="text-[8px] font-black uppercase bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-md text-slate-500 dark:text-slate-400">{row.status.replace('_', ' ')}</span></td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${row.priority === 'crítica' ? 'bg-red-500' : 'bg-blue-500'}`} />
                        <span className="text-xs font-bold capitalize">{row.priority}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right"><button className="material-symbols-outlined text-slate-300 hover:text-primary transition-colors">open_in_new</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/10 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Activity Timeline</h3>
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="flex gap-6 items-start border-b border-slate-50 dark:border-white/5 pb-6 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><span className="material-symbols-outlined">verified</span></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-[11px] font-black uppercase tracking-widest">Sincronização #{i}04</p>
                      <span className="text-[9px] text-primary font-black uppercase">Agora</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 italic">Todos os registros locais foram consolidados com a nuvem.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 06. ALERTS & PROGRESS (NEW) --- */}
        <section className="space-y-10">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">06. Alertas & Feedback</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="p-6 rounded-[2rem] bg-red-500/10 border-2 border-red-500/20 flex gap-4 text-red-600">
                <span className="material-symbols-outlined font-black">report_problem</span>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Evacuação Crítica</h4>
                  <p className="text-[11px] leading-relaxed font-medium">Zona vermelha detectada. Procure abrigo elevado imediatamente.</p>
                </div>
              </div>
              <div className="p-6 rounded-[2rem] bg-emerald-500/10 border-2 border-emerald-500/20 flex gap-4 text-emerald-600">
                <span className="material-symbols-outlined font-black">check_circle</span>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Local Seguro</h4>
                  <p className="text-[11px] leading-relaxed font-medium">Ponto de acolhimento verificado e com suprimentos ativos.</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400"><span>Upload da Missão</span><span className="text-primary">85%</span></div>
                <div className="w-full h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden p-1">
                  <div className="w-[85%] h-full bg-gradient-to-r from-primary to-blue-300 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.2)]" />
                </div>
              </div>
              <div className="flex gap-10 items-center justify-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-white/5" />
                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="round" className="text-primary" />
                  </svg>
                  <span className="absolute text-[12px] font-black uppercase tracking-widest">75%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 07. AVATARS, BADGES & TABS (NEW) --- */}
        <section className="space-y-10">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">07. Core UI Utils</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Avatars */}
            <div className="space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center md:text-left">Avatar Groups</p>
              <div className="flex justify-center md:justify-start -space-x-5">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-16 h-16 rounded-full border-8 border-white dark:border-[#0a1628] bg-slate-200 overflow-hidden shadow-lg"><img src={`https://i.pravatar.cc/150?u=${i + 100}`} alt="u" /></div>)}
              </div>
            </div>

            {/* Form Widgets Picker */}
            <div className="bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-slate-100 dark:border-white/10 shadow-sm flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Mini Datepicker</p>
              <div className="grid grid-cols-7 gap-1 text-[9px] font-black text-center mb-4 text-slate-300">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center font-bold">
                {[...Array(14)].map((_, i) => <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] ${i === 8 ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-white/10 cursor-pointer'}`}>{i + 1}</div>)}
              </div>
            </div>

            {/* Tab Switcher Styles */}
            <div className="space-y-8">
              <div className="flex gap-10 border-b border-white/5">
                {['Overview', 'Logs', 'Map'].map(t => (
                  <button key={t} onClick={() => setActiveTabStyle(t)} className={`pb-4 text-[11px] font-black uppercase tracking-widest relative ${activeTabStyle === t ? 'text-primary' : 'text-slate-400'}`}>
                    {t}
                    {activeTabStyle === t && <div className="absolute bottom-[-1px] left-0 w-full h-1 bg-primary rounded-full" />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                {['Week', 'Month'].map(t => (
                  <button key={t} className={`flex-1 py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest ${t === 'Week' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- 08. OVERLAYS & MOCKUPS (NEW) --- */}
        <section className="space-y-10 pb-60">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">08. Notificações & Overlays</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex items-center gap-10">
              {/* Notification Mock */}
              <div className="relative">
                <button onMouseEnter={() => setShowNotification(true)} onMouseLeave={() => setShowNotification(false)} className="w-16 h-16 rounded-3xl bg-primary text-white shadow-2xl flex items-center justify-center active:scale-95 transition-all"><span className="material-symbols-outlined text-[32px]">notifications_active</span></button>
                {showNotification && (
                  <div className="absolute top-20 left-0 w-80 bg-white dark:bg-[#0d2247] shadow-2xl rounded-[2.5rem] p-6 border border-slate-100 dark:border-white/10 animate-in fade-in slide-in-from-top-4 z-50">
                    <div className="flex gap-4 items-center">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-sm">emergency</span></div>
                      <div><p className="text-[11px] font-black uppercase text-slate-800 dark:text-white leading-tight">Nova Missão Detectada!</p><p className="text-[9px] text-slate-500 mt-1">Clique para assumir o chamado.</p></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Help Popover */}
              <div className="relative">
                <div onMouseEnter={() => setShowPopover(true)} onMouseLeave={() => setShowPopover(false)} className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 cursor-help transition-all hover:bg-slate-50"><span className="material-symbols-outlined text-[24px]">question_mark</span></div>
                {showPopover && (
                  <div className="absolute translate-y-[-80px] translate-x-12 p-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-medium max-w-[220px] shadow-2xl animate-in zoom-in duration-300 z-50">
                    <div className="absolute bottom-[-6px] left-6 w-4 h-4 bg-slate-900 rotate-45" />
                    <p>Popover Premium: Detalhes explicativos sobre segurança operacional.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Slider Image Mockup */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-100 border border-slate-200 dark:border-white/10 h-48 flex items-center justify-center">
              <img src="https://i.pravatar.cc/600?u=slider" alt="s" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
              <div className="absolute inset-0 flex items-center justify-center"><p className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em]">Galeria de Missão</p></div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-white' : 'bg-white/30'}`} />)}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* --- PREMIUM BOTTOM SHEET (FIXED) --- */}
      <div className="fixed bottom-32 right-8 z-50">
        <button onClick={() => setShowModal(true)} className="w-16 h-16 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center active:rotate-90 transition-all active:scale-90"><span className="material-symbols-outlined text-[28px] font-black">add_moderator</span></button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative z-10 bg-white dark:bg-[#0a1628] rounded-t-[4rem] p-10 pb-16 shadow-[0_-20px_100px_rgba(0,0,0,0.4)] animate-in slide-in-from-bottom-20 duration-500 max-w-4xl mx-auto w-full border-t border-white/10">
            <div className="w-20 h-2 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-10" />
            <h2 className="text-4xl font-black font-headline text-center uppercase tracking-tighter mb-12">Modal Confirmação VNW</h2>
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1 p-10 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-100 dark:border-white/10">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl mb-4"><span>Modo SOS Notificações</span><div className="w-12 h-6 bg-emerald-500 rounded-full p-1 flex justify-end items-center"><div className="w-4 h-4 bg-white rounded-full shadow-lg" /></div></div>
                <p className="text-[11px] text-slate-400 italic text-center">"Ative para alertas prioritários em tempo real."</p>
              </div>
              <div className="flex-[0.6] flex flex-col justify-center gap-6">
                <button className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl active:scale-95 transition-all">Sincronizar</button>
                <button onClick={() => setShowModal(false)} className="w-full py-6 text-slate-400 font-black uppercase text-[10px] tracking-widest">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nav Mockup */}
      <nav className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-[#0a1628]/95 backdrop-blur-3xl py-6 px-10 z-[200] rounded-t-[3rem] shadow-[0_-20px_80px_rgba(0,0,0,0.2)] border-t border-slate-100 dark:border-white/5">
        <div className="max-w-xl mx-auto flex justify-around">
          {[{ i: 'home', l: 'Início' }, { i: 'explore', l: 'Busca' }, { i: 'emergency_share', l: 'SOS' }, { i: 'account_circle', l: 'Perfil' }].map((btn, i) => (
            <div key={btn.i} className={`flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-all ${i === 2 ? 'text-primary' : 'text-slate-300 dark:text-slate-700'}`}>
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: i === 2 ? "'FILL' 1" : "" }}>{btn.i}</span>
              <span className="text-[9px] font-black uppercase tracking-tighter">{btn.l}</span>
            </div>
          ))}
        </div>
      </nav>
    </div>
  )
}
