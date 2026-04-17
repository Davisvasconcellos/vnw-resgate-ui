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

import { useSelector } from 'react-redux'
import { RootState } from '@/store'

// Dentro de BottomNavContent:
// ...
function BottomNavContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const role = useSelector((state: RootState) => state.auth.role)
  const moduleParam = searchParams.get('module')

  if (!mounted) return null

  // Ocultar nav bar totalmente nestas rotas (telas cheias ou limpeza visual)

  const HIDDEN_ROUTES = [
    '/', 
    '/login', 
    '/onboarding',
  ]
  if (HIDDEN_ROUTES.includes(pathname)) return null

  // Caso especial: Página de mapa (nearby) só exibe barra se houver módulo explícito
  // Isso evita que um usuário veja a barra de gestão ao acessar o mapa de forma genérica
  if (pathname === '/nearby' && !moduleParam) {
    return null
  }

  // Mapeamento direto de módulos via parâmetro (Prioridade Total)
  if (moduleParam === 'help') return <BottomNavPublic />
  if (moduleParam === 'shelter') return <BottomNavShelter />
  if (moduleParam === 'transport') return <BottomNavTransport />
  if (moduleParam === 'boat') return <BottomNavBoat />
  if (moduleParam === 'volunteer') return <BottomNavVolunteer />

  // PRIORIDADE 1: Barra de assistência exclusiva para a tela /assist 
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

  // Se for abrigo (Rotas privadas do abrigo)
  if (role === 'shelter' && pathname.startsWith('/shelter')) {
    return <BottomNavShelter />
  }

  // Se for transporte (Rotas privadas de rotas)
  if (role === 'transport' && pathname.startsWith('/routes')) {
    return <BottomNavTransport />
  }

  // Se for barco (Rotas privadas de rotas)
  if (role === 'boat' && pathname.startsWith('/routes')) {
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
