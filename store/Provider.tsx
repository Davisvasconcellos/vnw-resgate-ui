'use client'

import { Provider } from 'react-redux';
import { store } from './index';
import { useEffect } from 'react';
import { setCredentials } from './slices/authSlice';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hidratação inicial caso o user atualize a página F5
    const token = localStorage.getItem('vnw_token');
    const role = localStorage.getItem('vnw_role') as any;
    const id_code = localStorage.getItem('vnw_id_code');
    
    if (role && !token) {
      // Estado de mock onboarding
      store.dispatch(setCredentials({ id_code: id_code || 'mock-id', role, token: '' }));
    } else if (token && role && id_code) {
      // Real authed state
      store.dispatch(setCredentials({ id_code, role, token }));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
