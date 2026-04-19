
export interface LocalRequest {
  id_code?: string;
  local_id: string; // ID temporário para controle local
  type: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed' | 'canceled' | 'pending';
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
