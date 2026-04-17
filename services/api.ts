import axios from 'axios';

// Instância principal para chamadas de API
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  timeout: 10000, // 10s default timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injeção de Token
api.interceptors.request.use((config) => {
  // Como estamos no Next.js App Router (client side), acessamos o localStorage com cautela
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('vnw_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de Resposta para logout automático em caso de 401
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vnw_token');
      // window.location.href = '/login'; // Opcional, dependendo da UX desejada
    }
  }
  
  // Customização para log de erro falho/timeout
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    console.error('API Indisponível ou Timeout:', error.message);
  }
  
  return Promise.reject(error);
});
