import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface Shelter {
  id_code: string;
  name: string;
  address: string;
  distanceKm?: number;
  capacity: number;
  occupied: number;
  phone: string;
  reference?: string;
  lat?: number;
  lng?: number;
}

interface SheltersState {
  items: Shelter[];
  entries: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SheltersState = {
  items: [],
  entries: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchShelters = createAsyncThunk(
  'shelters/fetchNearby',
  async (params: { lat?: number; lng?: number; radiusKm?: number }) => {
    try {
      const response = await api.get('/shelters', { params });
      return response.data.data;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.response?.status === 404) {
        console.warn('API OFFLINE: Usando mocks para shelters.');
        const { SHELTERS } = await import('@/app/mock-data');
        return SHELTERS.map(s => ({ ...s, id_code: s.id })); 
      }
      throw error;
    }
  }
);

export const fetchShelterEntries = createAsyncThunk(
  'shelters/fetchEntries',
  async (id_code: string) => {
    const response = await api.get(`/shelters/${id_code}/entries`);
    return response.data;
  }
);

export const processEntryStatus = createAsyncThunk(
  'shelters/processEntry',
  async ({ id_code, entry_id, status }: { id_code: string; entry_id: string; status: string }) => {
    const response = await api.put(`/shelters/${id_code}/entries/${entry_id}`, { status });
    return { entry_id, status };
  }
);

export const sheltersSlice = createSlice({
  name: 'shelters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShelters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShelters.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchShelters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falhou';
      })
      .addCase(fetchShelterEntries.fulfilled, (state, action) => {
        state.entries = action.payload.data || action.payload;
      })
      .addCase(processEntryStatus.fulfilled, (state, action) => {
        // Atualiza optimistic o status do entry 
        const e = state.entries.find(ex => ex.id_code === action.payload.entry_id || ex.id === action.payload.entry_id);
        if (e) {
            e.status = action.payload.status;
        }
      });
  },
});

export default sheltersSlice.reducer;
