'use client'

import { useState } from 'react'
import AppHeader from '@/components/headers/AppHeader'
import { useI18n } from '@/components/i18n/I18nProvider'
import BottomNavVolunteer from '@/components/BottomNavVolunteer'

export default function VolunteerTasksPage() {
  const { t } = useI18n()
  // Sample data for accepted tasks
  const [tasks, setTasks] = useState([
    {
      id: 'v-1',
      title: 'Triagem de Alimentos e Roupas',
      location: 'Ginásio da Trindade',
      category: 'Triagem',
      status: 'in_progress' as 'in_progress' | 'completed',
      acceptedAt: 'Há 2 horas'
    },
    {
      id: 'v-2',
      title: 'Limpeza de Áreas Residenciais',
      location: 'Saco Grande / João Paulo',
      category: 'Limpeza',
      status: 'in_progress' as 'in_progress' | 'completed',
      acceptedAt: 'Há 5 horas'
    }
  ])

  const handleComplete = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'completed' } : t
    ))
  }

  return (
    <main className="min-h-screen bg-surface dark:bg-[#0a1628] flex flex-col pb-32 pt-16">
      <AppHeader />

      <div className="px-5 pt-8 shrink-0 max-w-2xl mx-auto w-full">
        <section className="mb-8 px-1">
          <h1 className="text-4xl font-extrabold font-headline text-on-surface dark:text-white tracking-tight leading-tight">
            Minhas Tarefas
          </h1>
          <p className="mt-2 text-on-surface-variant dark:text-slate-400 font-body text-base">
            Acompanhe as missões que você aceitou ajudar.
          </p>
        </section>

        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-white/5 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10">
              <span className="material-symbols-outlined text-slate-300 dark:text-white/10 text-6xl mb-4">task_alt</span>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Você ainda não aceitou nenhuma tarefa.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id}
                className={`bg-white dark:bg-white/5 rounded-[1.8rem] p-5 border transition-all shadow-sm ${
                  task.status === 'completed' 
                    ? 'border-emerald-100 dark:border-emerald-500/20 opacity-75' 
                    : 'border-slate-100 dark:border-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      task.status === 'completed' 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-green-50 dark:bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#66BB6A]'
                    }`}>
                      <span className="material-symbols-outlined text-[22px]">
                        {task.status === 'completed' ? 'check_circle' : 'work'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-base leading-tight">{task.title}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#2E7D32] dark:text-[#66BB6A] mt-0.5">{task.category}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                    task.status === 'completed' 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' 
                      : 'bg-green-50 dark:bg-[#2E7D32]/10 text-[#2E7D32] dark:text-[#66BB6A] border-green-100 dark:border-green-500/20 animate-pulse'
                  }`}>
                    {task.status === 'completed' ? 'Concluída' : 'Em Andamento'}
                  </span>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {task.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    Aceita {task.acceptedAt}
                  </div>
                </div>

                {task.status === 'in_progress' && (
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="w-full py-3 rounded-2xl bg-[#2E7D32] text-white font-bold text-sm shadow-[0_8px_20px_-6px_rgba(46,125,50,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">done_all</span>
                    Marcar como Concluída
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
