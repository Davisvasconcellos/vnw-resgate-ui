'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import BottomNavRescue from '@/components/BottomNavRescue'
import BottomNavShelter from '@/components/BottomNavShelter'
import BottomNavTransport from '@/components/BottomNavTransport'
import BottomNavVolunteer from '@/components/BottomNavVolunteer'
import BottomNavPublic from '@/components/BottomNavPublic'
import BottomNavAssist from '@/components/BottomNavAssist'
import BottomNavBoat from '@/components/BottomNavBoat'


type Role = 'civilian' | 'shelter' | 'transport' | 'boat' | 'volunteer' | null

export default function BottomNavWrapper() {
  const pathname = usePathname()
  const [role, setRole] = useState<Role>(null)

  // Atualiza o state toda vez que muda de tela, caso o usuário tenha logado/trocado de perfil
  useEffect(() => {
    const savedRole = localStorage.getItem('vnw_role') as Role
    if (savedRole) {
      setRole(savedRole)
    } else {
      setRole('civilian')
    }
  }, [pathname])

  // Ocultar nav bar totalmente nestas rotas (telas cheias ou limpeza visual)
  const HIDDEN_ROUTES = [
    '/', 
    '/login', 
    '/onboarding', 
    '/missing', 
    '/shelter/manage', 
    '/nearby'
  ]
  if (HIDDEN_ROUTES.includes(pathname)) return null

  // PRIORIDADE 1: Barra de assistência exclusiva para a tela /assist 
  // Deve vir antes de qualquer lógica de Role para não 'vazar' a barra anterior
  if (pathname === '/assist') {
    return <BottomNavAssist />
  }

  // Rotas Públicas (Ajuda, Desaparecidos, etc)
  const PUBLIC_ROUTES = ['/help', '/help/shelters', '/help/phones', '/request']
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <BottomNavPublic />
  }

  // Se for abrigo
  if (role === 'shelter' && pathname.startsWith('/shelter')) {
    return <BottomNavShelter />
  }

  // Se for transporte
  if (role === 'transport' && pathname.startsWith('/routes')) {
    return <BottomNavTransport />
  }

  // Se for barco
  if (role === 'boat' && pathname.startsWith('/routes')) {
    return <BottomNavBoat />
  }

  // Fallback seguro: Nenhuma barra genérica aparecendo do nada
  return null
}
