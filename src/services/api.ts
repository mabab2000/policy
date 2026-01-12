import axios from 'axios';
import { API_CONFIG } from '@/constants';
import { Policy, PaginatedResponse, ApiResponse } from '@/types';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const policyApi = {
  getAll: async (params?: Record<string, unknown>): Promise<PaginatedResponse<Policy>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Policy>>>('/policies', { params });
    return response.data.data!;
  },

  getById: async (id: string): Promise<Policy> => {
    const response = await api.get<ApiResponse<Policy>>(`/policies/${id}`);
    return response.data.data!;
  },

  create: async (data: Partial<Policy>): Promise<Policy> => {
    const response = await api.post<ApiResponse<Policy>>('/policies', data);
    return response.data.data!;
  },

  update: async (id: string, data: Partial<Policy>): Promise<Policy> => {
    const response = await api.put<ApiResponse<Policy>>(`/policies/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/policies/${id}`);
  },

  updateStatus: async (id: string, status: string): Promise<Policy> => {
    const response = await api.patch<ApiResponse<Policy>>(`/policies/${id}/status`, { status });
    return response.data.data!;
  },
};

export default api;
