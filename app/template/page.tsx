'use client'

import { useState } from 'react'
import Image from 'next/image'
import AppHeader from '@/components/headers/AppHeader'

/**
 * PAGE: /template
 * Página mestre EXAUSTIVA de componentes visuais (VNW Resgate).
 * Consolida legado de design e novos padrões premium em uma única fonte de verdade.
 */
export default function TemplatePage() {
   const [showModal, setShowModal] = useState(false)
   const [toggleActive, setToggleActive] = useState('one')
   const [showPopover, setShowPopover] = useState(false)
   const [showNotification, setShowNotification] = useState(false)
   const [activeTabStyle, setActiveTabStyle] = useState('tab1')

   const tableData = [
      { id: '#RE-001', name: 'Alimentos', status: 'entregue', priority: 'baixa', date: '10/05/2026' },
      { id: '#RE-002', name: 'Resgate Barco', status: 'em_rota', priority: 'alta', date: '12/05/2026' },
      { id: '#RE-003', name: 'Kit Médico', status: 'pendente', priority: 'crítica', date: '14/05/2026' },
   ]

   return (
      <div className="bg-surface dark:bg-[#0a1628] text-on-surface dark:text-white min-h-screen pb-40 transition-colors font-sans antialiased">
         <AppHeader />

         <main className="pt-24 px-6 max-w-6xl mx-auto space-y-24">

            {/* --- CABEÇALHO --- */}
            <section className="bg-primary/5 rounded-[3rem] p-10 border border-primary/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <span className="material-symbols-outlined text-[120px]">architecture</span>
               </div>
               <h1 className="text-5xl font-black font-headline tracking-tighter text-slate-900 dark:text-white uppercase mb-4">
                  Component <span className="text-primary italic">Vault</span>
               </h1>
               <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                  Consolidação completa de todos os elementos visuais criados para o ecossistema.
                  Este documento é a única fonte de verdade para o design do VNW Resgate.
               </p>
            </section>

            {/* --- 01. DASHBOARD & STATS (RESTORED) --- */}
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
                  <div className="flex flex-col gap-2 w-full md:w-1/3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Avaliação Global</span>
                     <div className="flex items-center gap-1">
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

            {/* --- 02. BUSCA & MATCH (RESTORED) --- */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">02. Busca & Match</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-white shadow-2xl shadow-primary/20 group col-span-1 md:col-span-2">
                     <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:bg-white/20 transition-all duration-1000" />
                     <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                           <div className="flex items-center gap-3 mb-6">
                              <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-md">
                                 <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                              </div>
                              <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Match Inteligente</span>
                           </div>
                           <h2 className="text-4xl font-black font-headline tracking-tighter leading-tight mb-4">Conectando Recursos...</h2>
                           <p className="text-white/80 font-medium mb-8 max-w-md">IA ativa localizando voluntários e suprimentos em tempo real para sua zona de resgate.</p>
                           <button className="bg-white text-primary px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Ativar Agora</button>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white dark:bg-white/5 rounded-[2rem] p-6 flex items-center gap-6 border border-slate-100 dark:border-white/5 hover:shadow-lg transition-all cursor-pointer group">
                     <div className="relative">
                        <div className="w-20 h-20 rounded-3xl overflow-hidden ring-4 ring-slate-50 dark:ring-white/5 bg-slate-100">
                           <img src="https://i.pravatar.cc/150?u=cleaner" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md border-4 border-white dark:border-[#0a1628]">ONLINE</div>
                     </div>
                     <div className="flex-1">
                        <h4 className="font-black text-slate-900 dark:text-white text-lg">Mariana Silva</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Logística de Alimentos</p>
                        <div className="mt-4 flex justify-between items-center">
                           <span className="text-primary font-black">VNW PRO</span>
                           <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span> 1.2km
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* --- 03. FORMULÁRIOS & PARÂMETROS (RESTORED) --- */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">03. Parâmetros & Inputs</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm space-y-8">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Controles de Tarifa (Legacy)</h3>
                     <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-3xl">bed</span>
                           </div>
                           <p className="font-black text-sm">Dormitório</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl px-3 py-2">
                              <span className="text-primary font-black mr-1">$</span>
                              <input className="w-8 bg-transparent border-none p-0 font-black text-sm outline-none" type="number" defaultValue={15} />
                           </div>
                        </div>
                     </div>
                     <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-white/5">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slider de Tempo</span>
                           <span className="text-xl font-black text-secondary">40 min</span>
                        </div>
                        <input className="w-full h-2.5 bg-slate-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-secondary" type="range" defaultValue={40} min={15} max={120} />
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="relative group">
                        <div className="relative flex items-center">
                           <span className="absolute left-6 font-black text-primary text-2xl z-10">R$</span>
                           <input className="w-full pl-16 pr-8 py-6 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] font-black text-2xl outline-none shadow-sm transition-all focus:ring-4 focus:ring-primary/10" type="number" defaultValue={500} />
                           <span className="absolute right-8 text-[10px] font-black text-slate-300 uppercase tracking-widest">/MÊS</span>
                        </div>
                     </div>
                     <div className="bg-white dark:bg-white/5 rounded-[2rem] p-6 border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                        <span className="font-black text-sm uppercase tracking-tighter ml-2">Pessoas</span>
                        <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full">
                           <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-slate-300"><span className="material-symbols-outlined">remove</span></button>
                           <span className="font-black text-lg w-6 text-center">4</span>
                           <button className="w-10 h-10 rounded-full bg-primary text-white shadow-xl flex items-center justify-center"><span className="material-symbols-outlined">add</span></button>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* --- 04. IDENTIDADE & STATUS (NEW) --- */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">04. Identidade & Badge Mix</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Avatars */}
                  <div className="space-y-6">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avatar Ecosystem</h3>
                     <div className="flex items-center gap-8">
                        <div className="relative">
                           <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-xl ring-4 ring-white dark:ring-white/10">
                              <img src="https://i.pravatar.cc/150?u=single" alt="User" />
                           </div>
                           <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-[#0a1628]" />
                        </div>
                        <div className="flex -space-x-4">
                           {[1, 2, 3].map(i => (
                              <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-[#0a1628] overflow-hidden bg-slate-200">
                                 <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" />
                              </div>
                           ))}
                           <div className="w-12 h-12 rounded-full border-4 border-white dark:border-[#0a1628] bg-primary text-white flex items-center justify-center text-[10px] font-black uppercase">
                              +12
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Badges */}
                  <div className="space-y-6">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Badge Library</h3>
                     <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 rounded-md bg-red-500 text-white text-[9px] font-black uppercase tracking-widest">Priority</span>
                        <span className="px-3 py-1 rounded-full border-2 border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">Verified</span>
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase">
                           <div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> In Draft
                        </span>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[9px] font-black uppercase">Safe Zone</span>
                     </div>
                  </div>
               </div>
            </section>

            {/* --- 05. TABELAS & LISTAS (NEW) --- */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">05. Tabelas & Feeds</h2>

               <div className="bg-white dark:bg-white/5 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-white/10 shadow-sm">
                  <div className="overflow-x-auto">
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
                                 <td className="px-8 py-5 text-[10px] font-black text-slate-500">{row.id}</td>
                                 <td className="px-8 py-5">
                                    <span className="text-[8px] font-black uppercase bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-md text-slate-500 dark:text-slate-400">
                                       {row.status.replace('_', ' ')}
                                    </span>
                                 </td>
                                 <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                       <div className={`w-2 h-2 rounded-full ${row.priority === 'crítica' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                       <span className="text-xs font-bold capitalize select-none">{row.priority}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-5 text-right">
                                    <button className="material-symbols-outlined text-slate-300 hover:text-primary transition-colors">open_in_new</button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               <div className="bg-white dark:bg-white/5 rounded-[3rem] p-8 border border-slate-100 dark:border-white/10 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Atividade Recente (Detailed List)</h3>
                  <div className="space-y-6">
                     {[1, 2].map(i => (
                        <div key={i} className="flex gap-4 items-start border-b border-slate-50 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                           <span className="material-symbols-outlined text-primary bg-primary/5 p-2 rounded-xl">emergency</span>
                           <div className="flex-1">
                              <div className="flex justify-between items-start">
                                 <p className="text-[11px] font-black uppercase tracking-tighter">Missão #{i}04-D</p>
                                 <span className="text-[9px] text-slate-300 font-bold uppercase">Há 5 min</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 italic">Solicitação de resgate submetida em Setor Delta.</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* --- 06. ALERTS & PROGRESS (NEW) --- */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">06. Feedback & Progresso</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <div className="p-5 rounded-3xl bg-red-500/10 border-2 border-red-500/20 flex gap-4 text-red-600 items-start">
                        <span className="material-symbols-outlined font-black">report</span>
                        <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest">Alerta de Crítica</h4>
                           <p className="text-[11px] leading-relaxed mt-1 font-medium">Zona de alto risco detectada. Evacuação imediata recomendada.</p>
                        </div>
                     </div>
                     <div className="p-5 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 flex gap-4 text-emerald-600 items-start">
                        <span className="material-symbols-outlined font-black">check_circle</span>
                        <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest">Operação Concluída</h4>
                           <p className="text-[11px] leading-relaxed mt-1 font-medium">Todos os itens foram sincronizados com o servidor central.</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                           <span>Progresso da Operação</span>
                           <span className="text-primary">85%</span>
                        </div>
                        <div className="w-full h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden p-1">
                           <div className="w-[85%] h-full bg-gradient-to-r from-primary to-blue-300 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.2)]" />
                        </div>
                     </div>
                     <div className="flex gap-10">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                           <svg className="w-full h-full transform -rotate-90">
                              <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-white/5" />
                              <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="213.6" strokeDashoffset="53.4" strokeLinecap="round" className="text-primary" />
                           </svg>
                           <span className="absolute text-[10px] font-black">75%</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                           <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Carga de Bateria</p>
                           <div className="w-20 h-3 bg-slate-100 dark:bg-white/5 border border-slate-200/50 rounded-sm relative">
                              <div className="w-3/4 h-full bg-emerald-500" />
                              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200/50 rounded-sm" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* --- 07. FORM ELEMENTS PRO (NEW) --- */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">07. Form Elements Premium</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {/* Checkbox / Radio / Switch */}
                  <div className="space-y-6 bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custom Toggles</h3>
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase transition-colors">Modo Escuro</span>
                        <div className="w-12 h-6 bg-primary rounded-full relative p-1 flex items-center justify-end">
                           <div className="w-4 h-4 bg-white rounded-full shadow-lg" />
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-primary rounded-lg flex items-center justify-center text-primary">
                           <span className="material-symbols-outlined text-sm font-black">check</span>
                        </div>
                        <span className="text-xs font-bold">Aceito os termos</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-primary rounded-full flex items-center justify-center">
                           <div className="w-3 h-3 bg-primary rounded-full" />
                        </div>
                        <span className="text-xs font-bold">Opção Primária</span>
                     </div>
                  </div>

                  {/* Datepicker Mockup */}
                  <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Datepicker UI</h3>
                     <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-300 mb-4">
                        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                     </div>
                     <div className="grid grid-cols-7 gap-1 text-center">
                        {[...Array(31)].map((_, i) => (
                           <button key={i} className={`py-2 text-[10px] font-black rounded-lg transition-all ${i === 14 ? 'bg-primary text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                              {i + 1}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Button Groups */}
                  <div className="space-y-6">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Button Grouping</h3>
                     <div className="flex rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5">
                        <button className="flex-1 bg-white dark:bg-white/5 py-4 text-[10px] font-black uppercase text-primary border-r border-slate-100 dark:border-white/5 active:bg-slate-50 transition-all">Today</button>
                        <button className="flex-1 bg-white dark:bg-white/5 py-4 text-[10px] font-black uppercase text-slate-400 border-r border-slate-100 dark:border-white/5">Week</button>
                        <button className="flex-1 bg-white dark:bg-white/5 py-4 text-[10px] font-black uppercase text-slate-400">Month</button>
                     </div>
                     <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm">
                        <button className="bg-white dark:bg-white/5 py-4 px-6 text-left text-[10px] font-black uppercase text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5">Option Top</button>
                        <button className="bg-white dark:bg-white/5 py-4 px-6 text-left text-[10px] font-black uppercase text-slate-400">Option Bottom</button>
                     </div>
                  </div>
               </div>
            </section>

            {/* --- 08. OVERLAYS & POPOVERS (NEW) --- */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">08. Overlays & Notificações</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="flex items-center gap-10">
                     {/* Notification Mockup */}
                     <div className="relative group">
                        <button
                           onMouseEnter={() => setShowNotification(true)}
                           onMouseLeave={() => setShowNotification(false)}
                           className="w-16 h-16 rounded-3xl bg-white dark:bg-white/5 shadow-xl border border-slate-100 dark:border-white/10 flex items-center justify-center text-primary relative active:scale-95 transition-all"
                        >
                           <span className="material-symbols-outlined text-[32px]">notifications_active</span>
                           <span className="absolute top-4 right-4 w-4 h-4 bg-red-500 rounded-full border-4 border-white dark:border-[#0a1628]" />
                        </button>
                        {showNotification && (
                           <div className="absolute top-20 left-0 w-80 bg-white dark:bg-[#0d2247] shadow-2xl rounded-[2.5rem] p-6 border border-slate-100 dark:border-white/10 animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-6">Central de Alertas</h4>
                              <div className="space-y-4">
                                 <div className="flex gap-4 group/item cursor-pointer">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                                       <span className="material-symbols-outlined text-[18px]">emergency</span>
                                    </div>
                                    <div>
                                       <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase leading-tight">SOS Urgente Detectado!</p>
                                       <p className="text-[9px] text-slate-500 mt-1">Novo chamado em zona vermelha a 1.2km de distância.</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Popover Helper */}
                     <div className="flex items-center gap-4 relative">
                        <div
                           className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400 cursor-help active:bg-primary active:text-white shadow-sm transition-all"
                           onMouseEnter={() => setShowPopover(true)}
                           onMouseLeave={() => setShowPopover(false)}
                        >
                           <span className="material-symbols-outlined text-[24px]">question_mark</span>
                        </div>
                        {showPopover && (
                           <div className="absolute translate-y-[-70px] translate-x-12 p-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-medium max-w-[220px] shadow-2xl animate-in fade-in zoom-in duration-300 z-50">
                              <div className="absolute bottom-[-6px] left-6 w-4 h-4 bg-slate-900 rotate-45" />
                              <p className="leading-relaxed">Este é um <b>Popover Premium</b>. Use para explicar termos técnicos ou fluxos de segurança complexos.</p>
                           </div>
                        )}
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Popover Hover</span>
                     </div>
                  </div>

                  <div className="flex flex-col justify-center">
                     <button className="py-5 px-10 rounded-2xl border-2 border-red-500/20 text-red-500 font-extrabold uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-all hover:bg-red-600 hover:text-white hover:border-transparent shadow-xl shadow-red-500/5">
                        Ação Crítica Irreversível
                     </button>
                  </div>
               </div>
            </section>

            {/* --- 09. TABS & CAROUSAL (NEW) --- */}
            <section className="space-y-10 pb-40">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">09. Abas & Galerias</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Tab Styles */}
                  <div className="space-y-10 bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Estilo 1: Underline Premium</p>
                        <div className="flex gap-8 border-b border-slate-50 dark:border-white/5">
                           {['Geral', 'Segurança', 'Avançado'].map(t => (
                              <button key={t} onClick={() => setActiveTabStyle(t)} className={`pb-4 text-[11px] font-black uppercase tracking-widest relative transition-all ${activeTabStyle === t ? 'text-primary' : 'text-slate-400'}`}>
                                 {t}
                                 {activeTabStyle === t && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full animate-in fade-in" />}
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Estilo 2: Capsule System</p>
                        <div className="flex gap-2">
                           {['Missões', 'Suporte', 'Logs'].map(t => (
                              <button key={t} className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${t === 'Missões' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-white/10 text-slate-400'}`}>
                                 {t}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Gallery / Slider Mockup */}
                  <div className="space-y-6">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Galeria de Fotos (Mockup)</h3>
                     <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
                        {[1, 2, 3, 4].map(i => (
                           <div key={i} className="min-w-[180px] h-[240px] bg-slate-100 dark:bg-white/5 rounded-[2rem] overflow-hidden flex flex-col group border border-slate-100 dark:border-white/5 shrink-0 shadow-sm transition-all hover:translate-y-[-8px]">
                              <img src={`https://i.pravatar.cc/300?u=gallery${i}`} alt="img" className="h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                              <div className="p-4 bg-white dark:bg-[#0a1628] flex justify-between items-center shrink-0">
                                 <span className="text-[9px] font-black uppercase tracking-tighter">ID: #{i}093</span>
                                 <span className="material-symbols-outlined text-[14px] text-slate-300">download</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </section>

         </main>

         {/* --- PREMIUM BOTTOM SHEET (FIXO NO FOOTER) --- */}
         <div className="fixed bottom-32 right-8 z-50">
            <button
               onClick={() => setShowModal(true)}
               className="w-16 h-16 rounded-full bg-primary text-white shadow-2xl shadow-primary/40 flex items-center justify-center active:rotate-90 transition-all active:scale-90"
            >
               <span className="material-symbols-outlined text-[28px] font-black">settings_input_component</span>
            </button>
         </div>

         {showModal && (
            <div className="fixed inset-0 z-[200] flex flex-col justify-end">
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={() => setShowModal(false)} />
               <div className="relative z-10 bg-white dark:bg-[#0a1628] rounded-t-[4rem] p-10 pb-16 shadow-[0_-20px_100px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-20 duration-500 max-w-4xl mx-auto w-full border-t border-white/10">
                  <div className="w-20 h-2 bg-slate-200 dark:bg-white/10 rounded-full mx-auto mb-10" />
                  <h2 className="text-4xl font-black font-headline text-center uppercase tracking-tighter mb-12">Modal Master VNW</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div className="p-10 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-100 dark:border-white/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 text-center">Configurações Rápidas</p>
                        <div className="space-y-4 text-sm font-bold">
                           <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl">
                              <span>Notificações SOS</span>
                              <div className="w-12 h-6 bg-emerald-500 rounded-full p-1 flex justify-end items-center transition-all"><div className="w-4 h-4 bg-white rounded-full shadow-lg" /></div>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl opacity-40">
                              <span>Modo Offline Pro</span>
                              <div className="w-12 h-6 bg-slate-200 rounded-full p-1 flex justify-start items-center transition-all"><div className="w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col justify-center gap-6">
                        <button className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-primary/30 active:scale-95 transition-all">Sincronizar Tudo</button>
                        <button onClick={() => setShowModal(false)} className="w-full py-6 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-red-500 transition-colors">Fechar Painel</button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Nav Mockup */}
         <nav className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-[#0a1628]/90 backdrop-blur-3xl py-6 px-10 z-50 rounded-t-[3rem] shadow-[0_-20px_80px_rgba(0,0,0,0.1)] border-t border-slate-100 dark:border-white/5">
            <div className="max-w-xl mx-auto flex justify-around">
               {[
                  { i: 'home', l: 'Início' }, { i: 'explore', l: 'Busca' }, { i: 'emergency_share', l: 'SOS' }, { i: 'account_circle', l: 'Perfil' }
               ].map((btn, i) => (
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
