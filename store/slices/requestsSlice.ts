import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { HelpRequest } from '@/app/mock-data'; // Usaremos as tipagens antigas temporariamente se compatível

interface RequestsState {
  items: HelpRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: RequestsState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunk para buscar pedidos com Haversine logic
export const fetchRequests = createAsyncThunk(
  'requests/fetchNearby',
  async (params: { lat?: number; lng?: number; radiusKm?: number; status?: string; type?: string }) => {
    // Usando try/catch para mock fallback se backend der erro
    try {
      const response = await api.get('/requests', { params });
      return response.data.data; // Supondo resposta no padrão JSON de APIs
    } catch (error: any) {
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        console.warn('API OFFLINE: Usando mocks por enquanto para requests.');
        // Para manter o front não quebrando 100% de inicio, simularemos o retorno mock se API falhar
        const { HELP_REQUESTS } = await import('@/app/mock-data');
        return HELP_REQUESTS;
      }
      throw error;
    }
  }
);

// Assumir resgate
export const assumeRescue = createAsyncThunk(
  'requests/assume',
  async (id_code: string) => {
    const response = await api.put(`/requests/${id_code}/status`, { status: 'attending' });
    return response.data;
  }
);

export const requestsSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // Carregue via backend (ou fallback mock)
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falha ao buscar requisições';
      })
      .addCase(assumeRescue.fulfilled, (state, action) => {
         // Opcional: Atualizar status otimista baseado na resposta do PUT
         const updatedStr = action.meta.arg;
         const item = state.items.find((i: any) => i.id_code === updatedStr || i.id === updatedStr);
         if (item) {
           item.status = 'attending';
         }
      })
  },
});

export default requestsSlice.reducer;
