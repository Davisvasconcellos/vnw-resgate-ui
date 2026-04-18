// ─── Mock de dados para simulação ────────────────────────────────────────────

export type HelpStatus = 'pending' | 'viewed' | 'attending' | 'resolved'
export type HelpType = 'rescue' | 'shelter' | 'medical' | 'food' | 'transport' | 'boat'

export interface Shelter {
  id: string
  id_code?: string
  name: string
  address: string
  distanceKm: number
  capacity: number
  occupied: number
  phone: string
  reference: string
  lat?: number
  lng?: number
}

export interface HelpRequest {
  id: string
  id_code?: string
  type: HelpType
  status: HelpStatus
  people: number
  people_count?: number
  address: string
  distanceKm: number
  photoUrl?: string
  photo_url?: string
  createdAt: string
  created_at?: string
  urgency: 'high' | 'medium' | 'low'
  lat?: number
  lng?: number
  is_verified?: boolean
  description?: string
  reporter_name?: string
  reporter_phone?: string
  phone?: string
}

export interface UsefulPhone {
  id: string
  label: string
  number: string
  description: string
  icon: string
}

// ─── Abrigos ─────────────────────────────────────────────────────────────────
export const SHELTERS: Shelter[] = [
  {
    id: 'sh-1',
    name: 'Ginásio Municipal Lauro Linhares',
    address: 'R. Lauro Linhares, 1289 – Trindade',
    distanceKm: 1.2,
    capacity: 300,
    occupied: 241,
    phone: '(48) 3251-9000',
    reference: 'Próximo ao Shopping Iguatemi',
    lat: -27.4300,
    lng: -48.4600,
  },
  {
    id: 'sh-2',
    name: 'Escola Estadual José Arício Faraco',
    address: 'Av. Mauro Ramos, 1620 – Centro',
    distanceKm: 2.8,
    capacity: 150,
    occupied: 60,
    phone: '(48) 3251-4400',
    reference: 'Em frente ao Parque da Luz',
    lat: -27.4200,
    lng: -48.4500,
  },
  {
    id: 'sh-3',
    name: 'Centro Comunitário Saco Grande',
    address: 'R. Altino Flores, 3690 – Saco Grande',
    distanceKm: 4.1,
    capacity: 200,
    occupied: 198,
    phone: '(48) 3251-5500',
    reference: 'Ao lado da Igreja São José',
    lat: -27.4000,
    lng: -48.4600,
  },
  {
    id: 'sh-4',
    name: 'Associação Moradores Pantanal',
    address: 'R. Sargento João Pessoa, 480 – Pantanal',
    distanceKm: 5.9,
    capacity: 80,
    occupied: 12,
    phone: '(48) 3251-7700',
    reference: 'Próximo à UFSC',
    lat: -27.3800,
    lng: -48.4500,
  },
]

// ─── Pedidos de ajuda ─────────────────────────────────────────────────────────
export const HELP_REQUESTS: HelpRequest[] = [
  {
    id: 'req-1',
    type: 'rescue',
    status: 'pending',
    people: 4,
    address: 'R. das Gaivotas, 320 – Canasvieiras',
    distanceKm: 0.5,
    photoUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&q=70',
    createdAt: '2026-04-15T19:45:00',
    urgency: 'high',
    lat: -27.4350,
    lng: -48.4550,
  },
  {
    id: 'req-2',
    type: 'shelter',
    status: 'viewed',
    people: 2,
    address: 'Av. Beira-Mar Norte, 1100 – Centro',
    distanceKm: 1.3,
    photoUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400&q=70',
    createdAt: '2026-04-15T20:10:00',
    urgency: 'medium',
    lat: -27.4400,
    lng: -48.4450,
  },
  {
    id: 'req-3',
    type: 'medical',
    status: 'attending',
    people: 1,
    address: 'R. João Pio Duarte, 88 – Córrego Grande',
    distanceKm: 2.1,
    createdAt: '2026-04-15T20:30:00',
    urgency: 'high',
    lat: -27.4500,
    lng: -48.4550,
  },
  {
    id: 'req-4',
    type: 'food',
    status: 'resolved',
    people: 6,
    address: 'Travessa Ratones, 45 – Ratones',
    distanceKm: 3.7,
    createdAt: '2026-04-15T18:00:00',
    urgency: 'low',
    lat: -27.4600,
    lng: -48.4450,
  },
]

// ─── Telefones úteis ──────────────────────────────────────────────────────────
export const USEFUL_PHONES: UsefulPhone[] = [
  { id: 'p-1', label: 'Defesa Civil', number: '199', description: 'Emergências de desastres naturais', icon: 'shield' },
  { id: 'p-2', label: 'SAMU', number: '192', description: 'Serviço de Atendimento Móvel de Urgência', icon: 'emergency' },
  { id: 'p-3', label: 'Bombeiros', number: '193', description: 'Resgate e incêndio', icon: 'local_fire_department' },
  { id: 'p-4', label: 'Polícia Militar', number: '190', description: 'Segurança pública', icon: 'local_police' },
  { id: 'p-5', label: 'Prefeitura Municipal', number: '156', description: 'Serviços municipais de emergência', icon: 'apartment' },
  { id: 'p-6', label: 'Cruz Vermelha', number: '(48) 3225-0000', description: 'Apoio humanitário', icon: 'favorite' },
]

// ─── Label helpers ────────────────────────────────────────────────────────────
export const HELP_TYPE_LABELS: Record<HelpType, { label: string; icon: string }> = {
  rescue: { label: 'Resgate', icon: 'sos' },
  shelter: { label: 'Abrigo', icon: 'house' },
  medical: { label: 'Médico', icon: 'medical_services' },
  food: { label: 'Alimento', icon: 'restaurant' },
  transport: { label: 'Transporte', icon: 'directions_car' },
  boat: { label: 'Barco', icon: 'directions_boat' },
}
