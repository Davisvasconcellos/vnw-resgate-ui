import { useState, useEffect, useRef } from 'react'
import { api } from '@/services/api'
import { getLocalRequests, getUnreadCount, LocalRequest, syncPendingRequests } from '@/services/fingerprint'
import toast from 'react-hot-toast'

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<LocalRequest[]>([])
  const [loading, setLoading] = useState(false)
  const prevCountRef = useRef(0)

  const checkNotifications = async () => {
    if (typeof window === 'undefined') return
    
    const storedUser = localStorage.getItem('vnw_user')
    if (!storedUser) return

    try {
      await syncPendingRequests()
      const res = await api.get('/requests/my')
      const apiRequests: LocalRequest[] = res.data.data || []
      
      const read = localStorage.getItem('vnw_read_messages')
      const readList: string[] = read ? JSON.parse(read) : []

      const unreadItems = apiRequests.filter(r => 
        r.id_code && 
        r.status === 'attending' && 
        !readList.includes(r.id_code)
      )

      const newCount = unreadItems.length

      // Se houver mais não lidas do que antes, avisa o usuário
      if (newCount > prevCountRef.current) {
        toast.success(`🚨 Nova atualização no seu pedido de socorro!`, {
          duration: 6000,
          position: 'top-right',
          style: {
            background: '#0a1628',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            borderRadius: '1rem',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        })
      }

      prevCountRef.current = newCount
      setUnreadCount(newCount)
      setNotifications(unreadItems)
    } catch (e) {
      console.error('[Notifications] Erro ao sincronizar notificações', e)
    }
  }

  useEffect(() => {
    checkNotifications()
    const interval = setInterval(checkNotifications, 45000)
    return () => clearInterval(interval)
  }, [])

  return { unreadCount, notifications, refresh: checkNotifications }
}
