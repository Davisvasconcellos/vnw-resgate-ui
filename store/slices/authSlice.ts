import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'master' | 'admin' | 'manager' | 'volunteer' | 'civilian' | 'shelter' | 'transport' | 'boat';

interface AuthState {
  id_code: string | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  profile: any | null;
}

const initialState: AuthState = {
  id_code: null,
  role: 'civilian', // Padrão
  token: null,
  isAuthenticated: false,
  profile: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ id_code: string; role: UserRole; token: string; profile?: any }>
    ) => {
      state.id_code = action.payload.id_code;
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.profile = action.payload.profile || null;
      state.isAuthenticated = true;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('vnw_token', action.payload.token);
        localStorage.setItem('vnw_role', action.payload.role);
        localStorage.setItem('vnw_id_code', action.payload.id_code);
      }
    },
    logout: (state) => {
      state.id_code = null;
      state.role = 'civilian';
      state.token = null;
      state.profile = null;
      state.isAuthenticated = false;
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vnw_token');
        localStorage.removeItem('vnw_role');
        localStorage.removeItem('vnw_id_code');
      }
    },
    setMockRole: (state, action: PayloadAction<UserRole>) => {
      // Usado temporariamente para Onboarding visual
      state.role = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('vnw_role', action.payload);
      }
    }
  },
});

export const { setCredentials, logout, setMockRole } = authSlice.actions;
export default authSlice.reducer;
