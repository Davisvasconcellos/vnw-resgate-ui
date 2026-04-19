
export interface LocalRequest {
  id_code?: string;
  local_id: string; // ID temporário para controle local
  type: string;
  description: string;
  status: 'pending' | 'viewed' | 'attending' | 'resolved' | 'canceled';
  urgency: string;
  created_at: string;
  sync_status: 'synced' | 'pending';
  address: string;
}

export const getDeviceId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let deviceId = localStorage.getItem('vnw_device_id');
  
  if (!deviceId) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fingerprint = [
      navigator.userAgent,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      navigator.language,
      ctx?.font || ''
    ].join('|');
    
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    deviceId = `dv-${Math.abs(hash).toString(16)}-${Date.now().toString(16)}`;
    localStorage.setItem('vnw_device_id', deviceId);
  }
  
  return deviceId;
};

// Nova lógica de salvamento completa
export const saveHelpRequest = (request: Partial<LocalRequest>) => {
  if (typeof window === 'undefined') return;
  
  const current = localStorage.getItem('vnw_local_requests');
  const list: LocalRequest[] = current ? JSON.parse(current) : [];
  
  // Se for uma atualização de um existente (pelo id_code ou local_id)
  const index = list.findIndex(r => 
    (request.id_code && r.id_code === request.id_code) || 
    (request.local_id && r.local_id === request.local_id)
  );

  const newRequest: LocalRequest = {
    local_id: request.local_id || `loc-${Date.now()}`,
    type: request.type || 'rescue',
    description: request.description || '',
    status: (request.status as any) || 'pending',
    urgency: request.urgency || 'medium',
    created_at: request.created_at || new Date().toISOString(),
    sync_status: request.sync_status || 'pending',
    address: request.address || '',
    id_code: request.id_code
  };

  if (index >= 0) {
    list[index] = { ...list[index], ...newRequest };
  } else {
    list.unshift(newRequest);
  }

  localStorage.setItem('vnw_local_requests', JSON.stringify(list));
};

export const getLocalRequests = (): LocalRequest[] => {
  if (typeof window === 'undefined') return [];
  const current = localStorage.getItem('vnw_local_requests');
  return current ? JSON.parse(current) : [];
};

// Mantendo compatibilidade legada
export const saveMyRequest = (idCode: string) => {
  saveHelpRequest({ id_code: idCode, sync_status: 'synced' });
};

export const getMyRequests = (): string[] => {
  const list = getLocalRequests();
  return list.map(r => r.id_code).filter(Boolean) as string[];
};

// Nova função para subir pedidos pendentes (Push)
import { api } from '@/services/api'
export const syncPendingRequests = async () => {
  if (typeof window === 'undefined') return;
  
  const storedUser = localStorage.getItem('vnw_user');
  if (!storedUser) return; // Só sincroniza se estiver logado
  
  const localRequests = getLocalRequests();
  const pending = localRequests.filter(r => r.sync_status === 'pending');
  
  if (pending.length === 0) return;

  console.log(`[Sync] Sincronizando ${pending.length} pedidos pendentes...`);

  for (const req of pending) {
    try {
      const payload = {
        type: req.type,
        description: req.description,
        urgency: req.urgency,
        address: req.address,
        is_verified: true
      };

      const res = await api.post('/requests', payload);
      if (res.data.success && res.data.data?.id_code) {
        saveHelpRequest({
          local_id: req.local_id,
          id_code: res.data.data.id_code,
          status: res.data.data.status || 'open',
          sync_status: 'synced'
        });
      }
    } catch (e) {
      console.error('[Sync] Erro ao sincronizar pedido:', req.local_id, e);
    }
  }
};

// Funções para o sistema de notificações (Lido/Não Lido)
export const markAsRead = (idCode: string) => {
  if (typeof window === 'undefined') return;
  const read = localStorage.getItem('vnw_read_messages');
  const list: string[] = read ? JSON.parse(read) : [];
  if (!list.includes(idCode)) {
    list.push(idCode);
    localStorage.setItem('vnw_read_messages', JSON.stringify(list));
  }
};

export const getUnreadCount = (requests: LocalRequest[]): number => {
  if (typeof window === 'undefined') return 0;
  const read = localStorage.getItem('vnw_read_messages');
  const readList: string[] = read ? JSON.parse(read) : [];
  
  // Notificação = Tem mensagem do salvador OU status mudou AND não está na lista de lidos
  return requests.filter(r => 
    r.id_code && 
    r.status === 'attending' && 
    !readList.includes(r.id_code)
  ).length;
};
