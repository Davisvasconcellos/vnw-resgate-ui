import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface MissingState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MissingState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchMissingPersons = createAsyncThunk(
  'missing/fetch',
  async (params?: { name?: string; status?: string }) => {
    try {
      const response = await api.get('/missing', { params });
      return response.data.data;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.response?.status === 404) {
        console.warn('API OFFLINE: Retornando lista vazia de desaparecidos.');
        return [];
      }
      throw error;
    }
  }
);

export const missingSlice = createSlice({
  name: 'missing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissingPersons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMissingPersons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMissingPersons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falhou';
      });
  },
});

export default missingSlice.reducer;
