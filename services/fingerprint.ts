
export const getDeviceId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let deviceId = localStorage.getItem('vnw_device_id');
  
  if (!deviceId) {
    // Fingerprint simples usando UserAgent + Resolução + Timezone
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
    
    // Hash básico
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    deviceId = `dv-${Math.abs(hash).toString(16)}-${Date.now().toString(16)}`;
    localStorage.setItem('vnw_device_id', deviceId);
  }
  
  return deviceId;
};

export const saveMyRequest = (idCode: string) => {
  if (typeof window === 'undefined') return;
  const current = localStorage.getItem('vnw_my_requests');
  const list = current ? JSON.parse(current) : [];
  if (!list.includes(idCode)) {
    list.push(idCode);
    localStorage.setItem('vnw_my_requests', JSON.stringify(list));
  }
};

export const getMyRequests = (): string[] => {
  if (typeof window === 'undefined') return [];
  const current = localStorage.getItem('vnw_my_requests');
  return current ? JSON.parse(current) : [];
};
