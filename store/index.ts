import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import requestsReducer from './slices/requestsSlice';
import sheltersReducer from './slices/sheltersSlice';
import missingReducer from './slices/missingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
    shelters: sheltersReducer,
    missing: missingReducer
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
