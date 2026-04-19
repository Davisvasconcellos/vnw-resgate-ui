'use client'

import { useState } from 'react'
import Image from 'next/image'
import AppHeader from '@/components/headers/AppHeader'

/**
 * PAGE: /template3
 * DUMP INTEGRAL E ABSOLUTO (T1 + T2)
 * Sem filtros, sem resumos, sem remoção de duplicidade.
 */
export default function Template3Page() {
   // --- ESTADOS BLOCO 1 (ORIGINAL T1) ---
   const [showM1, setShowM1] = useState(false)
   const [tgl1, setTgl1] = useState('one')
   const [pop1, setPop1] = useState(false)
   const [not1, setNot1] = useState(false)
   const [tab1, setTab1] = useState('tab1')

   // --- ESTADOS BLOCO 2 (ORIGINAL T2) ---
   const [showM2, setShowM2] = useState(false)
   const [tgl2, setTgl2] = useState('one')
   const [pop2, setPop2] = useState(false)
   const [not2, setNot2] = useState(false)
   const [tab2, setTab2] = useState('tab1')
   const [flt2, setFlt2] = useState('active')

   const tableData = [
      { id: '#RE-001', name: 'Alimentos', status: 'entregue', priority: 'baixa', date: '10/05/2026' },
      { id: '#RE-002', name: 'Resgate Barco', status: 'em_rota', priority: 'alta', date: '12/05/2026' },
      { id: '#RE-003', name: 'Kit Médico', status: 'pendente', priority: 'crítica', date: '14/05/2026' },
   ]

   return (
      <div className="bg-surface dark:bg-[#0a1628] text-on-surface dark:text-white min-h-screen pb-96 transition-colors font-sans antialiased">
         <AppHeader />

         {/* ==========================================================================
             ZONA 1: CONTEÚDO INTEGRAL DO TEMPLATE 1 (MASTER)
             ========================================================================== */}
         <main className="pt-24 px-6 max-w-6xl mx-auto space-y-24 border-b-[20px] border-primary/10 pb-40 mb-40">
            <div className="bg-primary text-white py-6 px-12 rounded-full font-black uppercase tracking-[0.4em] text-center mb-24 shadow-2xl">
               Início: Bloco Template 1 (Master Premium)
            </div>

            {/* Cabeçalho T1 */}
            <section className="bg-primary/5 rounded-[3rem] p-10 border border-primary/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10"><span className="material-symbols-outlined text-[120px]">architecture</span></div>
               <h1 className="text-5xl font-black font-headline tracking-tighter text-slate-900 dark:text-white uppercase mb-4">Component <span className="text-primary italic">Vault</span></h1>
               <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">Consolidação completa de todos os elementos visuais criados para o ecossistema.</p>
            </section>

            {/* 01. Dashboard T1 */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">01. Dashboard & Analíticos</h2>
               <div className="bg-white dark:bg-[#0d2247] rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 border border-slate-100 dark:border-white/5">
                  <div className="flex flex-col gap-2 w-full md:w-1/2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ganhos Semanais</span>
                     <div className="flex items-baseline gap-2"><span className="text-6xl font-black text-primary tracking-tighter">R$ 1.284</span></div>
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
                  <div className="bg-primary/10 text-primary rounded-[2rem] p-6 flex flex-col justify-between h-40 shadow-sm"><span className="material-symbols-outlined text-4xl">task_alt</span><div><div className="text-3xl font-black tracking-tighter">18</div><div className="text-[9px] font-black uppercase tracking-widest opacity-70">Missões Concluídas</div></div></div>
                  <div className="bg-blue-500/10 text-blue-500 rounded-[2rem] p-6 flex flex-col justify-between h-40 shadow-sm"><span className="material-symbols-outlined text-4xl">schedule</span><div><div className="text-3xl font-black tracking-tighter">34h</div><div className="text-[9px] font-black uppercase tracking-widest opacity-70">Tempo em Campo</div></div></div>
                  <div className="bg-slate-100 dark:bg-white/5 rounded-[2rem] p-6 h-40 flex flex-col justify-between shadow-sm"><span className="material-symbols-outlined text-4xl text-slate-300">group</span><div><div className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">124</div><div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Apoios Recebidos</div></div></div>
                  <div className="bg-emerald-500/10 text-emerald-600 rounded-[2rem] p-6 h-40 flex flex-col justify-between shadow-sm"><span className="material-symbols-outlined text-4xl">verified_user</span><div><div className="text-3xl font-black tracking-tighter">VNW</div><div className="text-[9px] font-black uppercase tracking-widest opacity-70">Selos Ativos</div></div></div>
               </div>
            </section>

            {/* 02. Busca T1 */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">02. Busca & Match</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-white shadow-2xl shadow-primary/20 group col-span-1 md:col-span-2 text-center">
                     <h2 className="text-4xl font-black font-headline uppercase leading-tight mb-4 tracking-tighter">Conectando Recursos IA...</h2>
                     <button className="bg-white text-primary px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Ativar Agora</button>
                  </div>
                  {/* Mariana Silva T1 */}
                  <div className="bg-white dark:bg-white/5 rounded-[2rem] p-6 flex items-center gap-6 border border-slate-100 dark:border-white/5 hover:shadow-lg transition-all cursor-pointer group">
                     <div className="relative">
                        <div className="w-20 h-20 rounded-3xl overflow-hidden ring-4 ring-slate-50 dark:ring-white/5 bg-slate-100"><img src="https://i.pravatar.cc/150?u=cleaner" alt="Avatar" className="w-full h-full object-cover" /></div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md border-4 border-white dark:border-[#0a1628]">ONLINE</div>
                     </div>
                     <div className="flex-1">
                        <h4 className="font-black text-slate-900 dark:text-white text-lg">Mariana Silva</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Logística de Alimentos</p>
                        <div className="mt-4 flex justify-between items-center"><span className="text-primary font-black">VNW PRO</span><span className="text-slate-300 font-bold uppercase text-[10px]">1.2km</span></div>
                     </div>
                  </div>
               </div>
            </section>

            {/* 03. Parâmetros T1 */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">03. Parâmetros & Inputs</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Controles de Tarifa (Legacy)</h3>
                     <div className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-3xl">bed</span></div><p className="font-black text-sm">Dormitório</p></div>
                        <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-xl px-3 py-2"><span className="text-primary font-black mr-1">$</span><input className="w-8 bg-transparent border-none p-0 font-black text-sm outline-none" type="number" defaultValue={15} /></div>
                     </div>
                     <div className="space-y-4 pt-4 border-t border-slate-50">
                        <div className="flex justify-between items-end"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slider de Tempo</span><span className="text-xl font-black text-secondary">40 min</span></div>
                        <input className="w-full h-2.5 bg-slate-100 dark:bg-white/10 rounded-full appearance-none accent-secondary" type="range" defaultValue={40} min={15} max={120} />
                     </div>
                  </div>
                  <div className="space-y-8">
                     <div className="relative group"><div className="relative flex items-center"><span className="absolute left-6 font-black text-primary text-2xl">R$</span><input className="w-full pl-16 pr-8 py-6 bg-white dark:bg-white/5 border border-slate-100 rounded-[2.5rem] font-black text-2xl outline-none shadow-sm" type="number" defaultValue={500} /></div></div>
                     <div className="bg-white dark:bg-white/5 rounded-[2rem] p-6 border border-slate-100 flex items-center justify-between shadow-sm">
                        <span className="font-black text-sm uppercase ml-2">Pessoas</span>
                        <div className="flex items-center gap-4 bg-slate-100 p-1.5 rounded-full"><button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300">-</button><span className="font-black text-lg w-6 text-center">4</span><button className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">+</button></div>
                     </div>
                  </div>
               </div>
            </section>

            {/* 04. Identidade T1 (MISSING BEFORE) */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">04. Identidade & Badge Mix</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avatar Ecosystem</h3>
                     <div className="flex items-center gap-8">
                        <div className="relative"><div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-xl ring-4 ring-white"><img src="https://i.pravatar.cc/150?u=single" alt="User" /></div><div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white" /></div>
                        <div className="flex -space-x-4">
                           {[1, 2, 3].map(i => (<div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-slate-200"><img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" /></div>))}
                           <div className="w-12 h-12 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-[10px] font-black">+12</div>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                     <span className="px-3 py-1 bg-red-500 text-white rounded text-[9px] font-black uppercase tracking-widest">Priority</span>
                     <span className="px-4 py-1.5 border-2 border-primary/20 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">Verified User</span>
                     <span className="px-4 py-1.5 bg-orange-500/10 text-orange-600 rounded-full text-[9px] font-black uppercase tracking-widest">In Draft Mode</span>
                  </div>
               </div>
            </section>

            {/* 05. Tabelas T1 */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">05. Tabelas & Feeds</h2>
               <div className="bg-white dark:bg-white/5 rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50"><tr><th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">ID/Missão</th><th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">Status</th><th className="px-8 py-6"></th></tr></thead>
                     <tbody className="divide-y divide-slate-50">{tableData.map(row => (<tr key={row.id} className="hover:bg-slate-50 transition-colors"><td className="px-8 py-5 text-[10px] font-black text-slate-500">{row.id}</td><td className="px-8 py-5"><span className="text-[8px] font-black uppercase bg-slate-100 px-3 py-1 rounded">{row.status}</span></td><td className="px-8 py-5 text-right"><span className="material-symbols-outlined text-slate-300">open_in_new</span></td></tr>))}</tbody>
                  </table>
               </div>
               <div className="bg-white dark:bg-white/5 rounded-[3rem] p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Atividade Recente</h3>
                  <div className="space-y-6">
                     {[1, 2].map(i => (<div key={i} className="flex gap-4 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0"><span className="material-symbols-outlined text-primary bg-primary/5 p-2 rounded-xl">emergency</span><div className="flex-1"><p className="text-[11px] font-black uppercase">Missão #{i}04-D</p><p className="text-xs text-slate-500 italic mt-1">Solicitação submetida em tempo real.</p></div></div>))}
                  </div>
               </div>
            </section>

            {/* 06. Feedback T1 (MISSING BEFORE) */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">06. Feedback & Progresso</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <div className="p-5 rounded-3xl bg-red-500/10 border-2 border-red-500/20 flex gap-4 text-red-600"><span className="material-symbols-outlined font-black">report</span><div><h4 className="text-[10px] font-black uppercase tracking-widest">Alerta Crítico</h4><p className="text-[11px] mt-1 font-medium italic">Zona de risco detectada!</p></div></div>
                     <div className="p-5 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 flex gap-4 text-emerald-600"><span className="material-symbols-outlined font-black">check_circle</span><div><h4 className="text-[10px] font-black uppercase tracking-widest">Operação OK</h4><p className="text-[11px] mt-1 font-medium">Sincronizado.</p></div></div>
                  </div>
                  <div className="space-y-8 flex items-center justify-around">
                     <div className="relative w-20 h-20 flex items-center justify-center"><svg className="w-full h-full transform -rotate-90"><circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" /><circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="213.6" strokeDashoffset="53.4" strokeLinecap="round" className="text-primary" /></svg><span className="absolute text-[10px] font-black">75%</span></div>
                     <div className="w-20 h-4 bg-slate-100 border rounded-sm relative"><div className="w-3/4 h-full bg-emerald-500" /></div>
                  </div>
               </div>
            </section>

            {/* 07. Form Elements T1 (MISSING BEFORE) */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">07. Form Elements Premium</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                     <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase text-slate-400">Switch Premium</span><div className="w-12 h-6 bg-primary rounded-full p-1 flex justify-end"><div className="w-4 h-4 bg-white rounded-full shadow-lg" /></div></div>
                     <div className="flex items-center gap-3"><div className="w-6 h-6 border-2 border-primary rounded-lg flex items-center justify-center text-primary"><span className="material-symbols-outlined text-sm">check</span></div><span className="text-xs font-bold uppercase">Aceito Termos</span></div>
                  </div>
                  <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                     <div className="grid grid-cols-7 gap-1 text-[9px] text-slate-300 font-black text-center mb-4"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div>
                     <div className="grid grid-cols-7 gap-1 text-center font-bold">{[...Array(14)].map((_, i) => (<button key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] ${i===8?'bg-primary text-white':'hover:bg-slate-50'}`}>{i+1}</button>))}</div>
                  </div>
                  <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                     <button className="bg-white py-4 px-6 text-left text-[10px] font-black uppercase text-slate-900 border-b">Opção Topo</button>
                     <button className="bg-slate-50 py-4 px-6 text-left text-[10px] font-black uppercase text-slate-400">Opção Base</button>
                  </div>
               </div>
            </section>

            {/* 09. Abas T1 (MISSING BEFORE) */}
            <section className="space-y-10 pb-40">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">09. Abas & Galerias</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
                     <div className="flex gap-8 border-b border-slate-50">{['Geral', 'Segurança'].map(t => (<button key={t} onClick={() => setTab1(t)} className={`pb-4 text-[11px] font-black uppercase tracking-widest relative ${tab1 === t ? 'text-primary border-b-4 border-primary' : 'text-slate-400'}`}>{t}</button>))}</div>
                     <div className="flex gap-2">{['Semana', 'Mês'].map(t => (<button key={t} className={`px-5 py-2 rounded-full text-[10px] font-black uppercase ${t==='Semana'?'bg-primary text-white':'bg-slate-100'}`}>{t}</button>))}</div>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                     {[1, 2, 3].map(i => (<div key={i} className="min-w-[150px] h-[200px] bg-slate-100 rounded-[2rem] overflow-hidden flex flex-col group border border-slate-100 shrink-0"><img src={`https://i.pravatar.cc/300?u=gal${i}`} alt="img" className="h-full object-cover grayscale transition-all duration-700" /><div className="p-3 bg-white flex justify-between"><span className="text-[8px] font-black uppercase">ID: #{i}093</span></div></div>))}
                  </div>
               </div>
            </section>
         </main>


         {/* ==========================================================================
             ZONA 2: CONTEÚDO INTEGRAL DO TEMPLATE 2 (HARVEST + APP)
             ========================================================================== */}
         <main className="px-6 max-w-6xl mx-auto space-y-24 pb-96">
            <div className="bg-red-600 text-white py-6 px-12 rounded-full font-black uppercase tracking-[0.4em] text-center mb-24 shadow-2xl">
               Início: Bloco Template 2 (App Resgate V1)
            </div>

            {/* 00. Status T2 (RESTORED) */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-red-600 uppercase tracking-[0.3em] border-l-4 border-red-600 pl-4">00. Status & Filtros Rápidos (Restaurado T2)</h2>
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="bg-slate-100 dark:bg-white/5 p-1 rounded-2xl flex w-full max-w-[320px] shadow-sm">
                     <button onClick={() => setFlt2('active')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${flt2 === 'active' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}>Ativos (12)</button>
                     <button onClick={() => setFlt2('history')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${flt2 === 'history' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}>Concluídos (45)</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                     <div className="bg-white dark:bg-white/5 border-l-8 border-red-600 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all hover:bg-red-50/30">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center"><span className="material-symbols-outlined text-3xl font-black">emergency</span></div>
                           <div><p className="font-black text-sm uppercase tracking-tighter dark:text-white leading-tight">Chamado SOS (T2)</p><p className="text-[10px] font-bold text-slate-400 uppercase">Prioridade Máxima</p></div>
                        </div>
                        <span className="material-symbols-outlined text-red-600 animate-pulse">priority_high</span>
                     </div>
                     <div className="bg-white dark:bg-white/5 border-l-8 border-blue-500 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-all hover:bg-blue-50/30">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center"><span className="material-symbols-outlined text-3xl">local_shipping</span></div>
                           <div><p className="font-black text-sm uppercase tracking-tighter dark:text-white leading-tight">Logística (T2)</p><p className="text-[10px] font-bold text-slate-400 uppercase">Transporte de Carga</p></div>
                        </div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Em Rota</span>
                     </div>
                  </div>
               </div>
            </section>

            {/* 01. Dashboard T2 */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">01. Dashboard & Analíticos (T2)</h2>
               <div className="bg-white dark:bg-[#0d2247] rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 border border-slate-100">
                  <div className="flex flex-col gap-2 w-full md:w-12/12">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Ganhos Semanais (Legacy T2)</span>
                     <div className="flex items-baseline gap-2 justify-center"><span className="text-6xl font-black text-primary tracking-tighter">R$ 1.284</span><span className="text-emerald-500 font-black text-[10px] bg-emerald-500/10 px-3 py-1 rounded-full uppercase italic">trending T2</span></div>
                  </div>
               </div>
            </section>

            {/* 02. Busca Integral T2 (MISSING BEFORE) */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">02. Busca & Match (Legacy T2)</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 text-white shadow-2xl group col-span-1 md:col-span-2 text-center">
                     <h2 className="text-4xl font-black font-headline uppercase leading-tight mb-4 tracking-tighter">Conectando Recursos IA (T2)...</h2>
                     <button className="bg-white text-primary px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Ativar Agora T2</button>
                  </div>
                  {/* Card Mariana Horizontal T2 */}
                  <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-6 flex items-center gap-6 border border-slate-100 shadow-sm group">
                     <div className="w-20 h-20 rounded-3xl overflow-hidden bg-slate-100 shadow-md ring-4 ring-slate-50"><img src="https://i.pravatar.cc/150?u=mari" alt="Avatar" className="w-full h-full object-cover" /></div>
                     <div className="flex-1 text-left"><h4 className="font-black text-slate-900 text-lg leading-none">Mariana Silva (T2)</h4><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 italic">Logística de Alimentos</p><div className="mt-4 flex justify-between items-center text-[10px] font-black"><span className="text-primary uppercase tracking-tighter">VNW PRO</span><span className="text-slate-300 font-bold uppercase tracking-widest">1.2km de Sincronia</span></div></div>
                  </div>
               </div>
            </section>

            {/* 03. Depoimentos T2 (MISSING BEFORE) */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">03. Depoimentos & Conteúdo (T2)</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-100 relative shadow-sm">
                     <div className="absolute -top-4 -left-4 w-10 h-10 bg-tertiary text-white rounded-full flex items-center justify-center font-black">"</div>
                     <p className="text-sm text-slate-500 italic leading-relaxed">"O atendimento foi funcional (T2) e as orientações claras." (Roberto V1)</p>
                  </div>
                  {/* Missing Card T2 */}
                  <div className="bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm group relative">
                     <img src="https://i.pravatar.cc/300?u=lucas" alt="m" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute top-4 left-4"><span className="px-3 py-1 rounded-lg bg-red-600/90 text-white text-[8px] font-black uppercase tracking-widest">Desaparecido T2</span></div>
                     <div className="p-6 bg-slate-900 text-center"><h4 className="text-white font-black text-xl font-headline uppercase leading-none">Lucas Fernandes</h4><p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1 italic">Visto pela última vez em Canasvieiras</p></div>
                  </div>
                  {/* Slim Mission T2 */}
                  <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-6 border border-slate-100 group active:scale-95 transition-all cursor-pointer">
                     <div className="flex justify-between items-start mb-4"><div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-[28px]">emergency</span></div><span className="material-symbols-outlined text-red-500 font-black">priority_high</span></div>
                     <h4 className="font-black text-sm uppercase tracking-tighter mb-2 italic">Resgate Crítico T2</h4>
                     <p className="text-[11px] text-slate-500 italic leading-relaxed line-clamp-2">"Setor D-4: Bloqueio logístico detectado em zona vermelha."</p>
                  </div>
               </div>
            </section>

            {/* 04. Formulários T2 (MISSING BEFORE) */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">04. Formulários & Parâmetros (T2)</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Controle Financeiro T2</h3>
                     <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl"><span className="material-symbols-outlined text-primary">attach_money</span><p className="font-black text-sm uppercase">Custo Operacional</p></div>
                     <input className="w-full h-2.5 bg-slate-100 rounded-full appearance-none accent-secondary" type="range" defaultValue={60} min={15} max={120} />
                  </div>
                  <div className="space-y-8 flex flex-col justify-center">
                     <div className="relative group"><div className="relative flex items-center"><span className="absolute left-6 font-black text-primary text-2xl">R$</span><input className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-[2.5rem] font-black text-2xl text-slate-900 shadow-inner" type="number" defaultValue={750} /></div></div>
                     <div className="bg-white p-1.5 rounded-[2rem] flex border shadow-sm">{['Português', 'English'].map((l, i) => (<button key={l} onClick={() => setTgl2(i===0?'one':'two')} className={`flex-1 py-3 px-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${((i===0&&tgl2==='one')||(i===1&&tgl2==='two')) ? 'bg-primary text-white shadow-xl' : 'text-slate-400'}`}>{l}</button>))}</div>
                  </div>
               </div>
            </section>

            {/* 05. Timeline T2 (MISSING BEFORE) */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">05. Tabelas & Feeds (T2 Feed)</h2>
               <div className="bg-white dark:bg-white/5 rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-4">Activity Timeline T2</h3>
                  <div className="space-y-8">
                     {[1, 2].map(i => (<div key={i} className="flex gap-6 items-start border-b border-slate-50 last:border-0 pb-6"><div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">#{i}</div><div className="flex-1"><p className="text-[11px] font-black uppercase tracking-tighter">Sincronização Master T2</p><p className="text-xs text-slate-500 mt-1 italic leading-relaxed">Registro local consolidado no servidor central com sucesso em zona assistida.</p></div></div>))}
                  </div>
               </div>
            </section>

            {/* 06. Alerts T2 (MISSING BEFORE) */}
            <section className="space-y-10">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">06. Feedbacks (T2 Critical)</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-6 rounded-[2rem] bg-red-500/10 border-2 border-red-500/20 flex gap-4 text-red-600"><span className="material-symbols-outlined font-black">report_problem</span><div><h4 className="text-[10px] font-black uppercase tracking-widest">Evacuação T2</h4><p className="text-[11px] font-medium leading-relaxed italic">Zona de conflito detectada!</p></div></div>
                  <div className="space-y-3">
                     <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest"><span>Upload T2</span><span className="text-primary font-black animate-pulse">85%</span></div>
                     <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1"><div className="w-[85%] h-full bg-primary rounded-full shadow-lg" /></div>
                  </div>
               </div>
            </section>

            {/* 08. Overlays T2 (MISSING BEFORE - Popovers/Image) */}
            <section className="space-y-10 pb-60">
               <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] border-l-4 border-primary pl-4">08. Overlays & Notificações (T2 Premium)</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="flex items-center gap-10">
                     <button onMouseEnter={() => setPop2(true)} onMouseLeave={() => setPop2(false)} className="w-16 h-16 rounded-full bg-slate-800 text-white shadow-2xl flex items-center justify-center font-black italic">H? (T2)</button>
                     {pop2 && (<div className="absolute translate-y-[-80px] translate-x-12 p-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-medium shadow-2xl animate-in zoom-in z-50"><p>Popover Master T2: Ajuda Estrutural.</p></div>)}
                  </div>
                  <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-100 border border-slate-200 h-48 flex items-center justify-center">
                     <img src="https://i.pravatar.cc/600?u=slider8" alt="s" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
                     <div className="absolute inset-0 flex items-center justify-center"><p className="bg-black/80 px-6 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em]">Galeria T2</p></div>
                  </div>
               </div>
            </section>
         </main>


         {/* ==========================================================================
             ZONA 3: CORE OVERLAYS (AMBOS OS MUNDOS)
             ========================================================================== */}
         
         {/* Gatilho 1 & 2 */}
         <div className="fixed bottom-32 right-10 flex flex-col gap-6 z-50">
            <button onClick={() => setShowM1(true)} className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 font-black text-[8px] uppercase">Modal T1</button>
            <button onClick={() => setShowM2(true)} className="w-20 h-20 bg-slate-900 border-4 border-red-600 text-white rounded-[2.5rem] shadow-2xl flex items-center justify-center active:scale-90 font-black text-[10px] uppercase">Modal T2</button>
         </div>

         {/* Modal T1 master */}
         {showM1 && (
            <div className="fixed inset-0 z-[300] flex flex-col justify-end">
               <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowM1(false)} />
               <div className="relative z-10 bg-white dark:bg-[#0a1628] rounded-t-[4rem] p-12 shadow-2xl animate-in slide-in-from-bottom duration-500 max-w-4xl mx-auto w-full">
                  <h2 className="text-4xl font-black font-headline text-center uppercase tracking-tighter mb-12">Modal Master T1</h2>
                  <div className="flex flex-col gap-6"><button className="w-full py-6 bg-primary text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl">Sincronizar T1</button><button onClick={() => setShowM1(false)} className="w-full py-6 text-slate-400 font-black uppercase text-[10px] tracking-widest">Fechar</button></div>
               </div>
            </div>
         )}

         {/* Modal T2 Master */}
         {showM2 && (
            <div className="fixed inset-0 z-[310] flex flex-col justify-end">
               <div className="absolute inset-0 bg-red-900/40 backdrop-blur-md" onClick={() => setShowM2(false)} />
               <div className="relative z-10 bg-white dark:bg-white/5 rounded-t-[4rem] p-12 pb-20 shadow-[0_-20px_100px_rgba(0,0,0,0.4)] animate-in slide-in-from-bottom-40 duration-500 max-w-4xl mx-auto w-full border-t border-red-600/30">
                  <h2 className="text-4xl font-black font-headline text-center uppercase tracking-tighter mb-12 text-red-600 italic underline decoration-8 underline-offset-8">Modal Confirmação T2</h2>
                  <div className="flex gap-4"><button className="flex-1 py-6 bg-red-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.3em]">Protocolo SOS</button><button onClick={() => setShowM2(false)} className="px-10 text-slate-400 font-black uppercase text-[10px]">Cancelar</button></div>
               </div>
            </div>
         )}

         {/* Nav Mockup Final */}
         <nav className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-[#0a1628]/95 backdrop-blur-3xl py-10 px-10 z-[500] rounded-t-[4rem] shadow-[0_-20px_100px_rgba(0,0,0,0.5)] border-t border-slate-100 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-primary/20 rounded-full" />
            <div className="max-w-xl mx-auto flex justify-around">
               {[{ i: 'home', l: 'Início' }, { i: 'explore', l: 'Geral' }, { i: 'emergency_share', l: 'SOS T2' }, { i: 'account_circle', l: 'Perfil' }].map((btn, i) => (
                  <div key={btn.i} className={`flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-all ${i === 2 ? 'text-primary' : 'text-slate-300'}`}>
                     <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: i === 2 ? "'FILL' 1" : "" }}>{btn.i}</span>
                     <span className="text-[10px] font-black uppercase tracking-tighter">{btn.l}</span>
                  </div>
               ))}
            </div>
         </nav>
      </div>
   )
}
