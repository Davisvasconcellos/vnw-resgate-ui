'use client'

import { LocalRequest, markAsRead } from '@/services/fingerprint'
import Link from 'next/link'

type Props = {
  isOpen: boolean
  onClose: () => void
  notifications: LocalRequest[]
}

export default function NotificationDrawer({ isOpen, onClose, notifications }: Props) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[350px] bg-white dark:bg-[#0a1628] z-[70] shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-100 dark:border-white/10">
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black font-headline uppercase tracking-tighter dark:text-white">Notificações</h2>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center">
               <span className="material-symbols-outlined dark:text-white">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <span className="material-symbols-outlined text-[48px] mb-2 dark:text-white">notifications_off</span>
                <p className="text-[10px] font-black uppercase tracking-widest dark:text-white">Nenhuma novidade</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <Link 
                  key={notif.id_code} 
                  href="/help/my-requests"
                  onClick={() => {
                    if (notif.id_code) markAsRead(notif.id_code)
                    onClose()
                  }}
                  className="block p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                       <span className="material-symbols-outlined text-blue-600">emergency</span>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-600 mb-1">Status Atualizado</h4>
                      <p className="text-xs font-bold dark:text-white leading-tight mb-2">
                        Seu pedido de {notif.type} está em atendimento!
                      </p>
                      <span className="text-[9px] font-medium text-slate-400">
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/10">
             <Link 
               href="/help/my-requests" 
               onClick={onClose}
               className="w-full py-4 bg-slate-100 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center block dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
             >
               Ver histórico completo
             </Link>
          </div>
        </div>
      </div>
    </>
  )
}
