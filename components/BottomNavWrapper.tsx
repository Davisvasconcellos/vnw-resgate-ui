'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import BottomNavRescue from '@/components/BottomNavRescue'
import BottomNavShelter from '@/components/BottomNavShelter'
import BottomNavTransport from '@/components/BottomNavTransport'
import BottomNavVolunteer from '@/components/BottomNavVolunteer'
import BottomNavPublic from '@/components/BottomNavPublic'
import BottomNavAssist from '@/components/BottomNavAssist'


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

  // Ocultar nav bar totalmente nestas rotas (telas cheias)
  const HIDDEN_ROUTES = ['/', '/login', '/onboarding', '/missing', '/shelter/manage', '/nearby']
  if (HIDDEN_ROUTES.includes(pathname)) return null

  // Barra de assistência (KPIs + Opções)
  if (pathname === '/assist') {
    return <BottomNavAssist />
  }

  // Rotas Públicas (Ajuda, Desaparecidos, etc) — Usam a nova barra pública
  const PUBLIC_ROUTES = ['/help', '/missing', '/help/shelters', '/help/phones', '/request']
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <BottomNavPublic />
  }

  // Se for civil (nenhum localStorage ou apagado), usa a barra laranja SOS civil
  if (role === 'civilian' || !role) {
    return <BottomNavRescue />
  }


  // Se for abrigo
  if (role === 'shelter') {
    return <BottomNavShelter />
  }

  // Se for transporte ou barco
  if (role === 'transport' || role === 'boat') {
    return <BottomNavTransport />
  }

  // Se for voluntário geral
  if (role === 'volunteer') {
    return <BottomNavVolunteer />
  }

  // Fallback seguro
  return <BottomNavRescue />
}
