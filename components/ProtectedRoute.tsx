'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '@/services/api'
import { RootState } from '@/store'
import { setCredentials } from '@/store/slices/authSlice'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useDispatch()
  const profile = useSelector((state: RootState) => state.auth.profile)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('vnw_token') : null;
    
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      
      // Sincronizar perfil se estiver vazio no Redux mas houver token
      if (!profile) {
        api.get('/auth/me').then(res => {
          const userData = res.data.data.user;
          dispatch(setCredentials({
            id_code: userData.id_code,
            role: userData.role,
            token: token,
            profile: userData
          }));
        }).catch(() => {
          // Token inválido ou expirado
          localStorage.removeItem('vnw_token');
          router.push('/login');
        });
      }
    }
  }, [router, profile, dispatch]);

  // Enquanto a verificação estiver rodando, podemos mostrar nada (ou um Loader), 
  // impedindo o "flash/flickering" do conteúdo protegido da tela.
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #0a1628, #1a3a6e)' }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>
}
