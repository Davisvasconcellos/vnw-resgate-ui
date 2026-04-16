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
import BottomNavMissing from '@/components/BottomNavMissing'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'


type Role = 'civilian' | 'shelter' | 'transport' | 'boat' | 'volunteer' | null

export default function BottomNavWrapper() {
  return (
    <Suspense fallback={null}>
      <BottomNavContent />
    </Suspense>
  )
}

function BottomNavContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [role, setRole] = useState<Role>(null)
  const moduleParam = searchParams.get('module')

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
  ]
  if (HIDDEN_ROUTES.includes(pathname)) return null

  // Prioridade para o módulo de Ajuda via parâmetro (Persistência da navegação pública)
  if (moduleParam === 'help') {
    return <BottomNavPublic />
  }

  // PRIORIDADE 1: Barra de assistência exclusiva para a tela /assist 
  // Deve vir antes de qualquer lógica de Role para não 'vazar' a barra anterior
  if (pathname === '/assist') {
    return <BottomNavAssist />
  }

  // Rotas de Resgate / Solicitação URGENTE
  if (pathname === '/request') {
    return <BottomNavRescue />
  }

  // Rotas Públicas Standard (Ajuda, Abrigos, etc)
  const PUBLIC_ROUTES = ['/help', '/help/shelters', '/help/phones']
  if (PUBLIC_ROUTES.includes(pathname)) {
    return <BottomNavPublic />
  }

  // Se for abrigo
  if (role === 'shelter' && (pathname.startsWith('/shelter') || pathname === '/nearby')) {
    return <BottomNavShelter />
  }

  // Se for transporte
  if (role === 'transport' && (pathname.startsWith('/routes') || pathname === '/nearby')) {
    return <BottomNavTransport />
  }

  // Se for barco
  if (role === 'boat' && (pathname.startsWith('/routes') || pathname === '/nearby')) {
    return <BottomNavBoat />
  }

  // Se for voluntário
  if (role === 'volunteer' && pathname.startsWith('/volunteer')) {
    return <BottomNavVolunteer />
  }

  // Caso especial: Desaparecidos (sempre tem sua barra ou a pública)
  if (pathname === '/missing') {
    return <BottomNavMissing onAddClick={() => window.dispatchEvent(new CustomEvent('open-add-missing'))} />
  }

  // Fallback seguro: Nenhuma barra genérica aparecendo do nada
  return null
}
