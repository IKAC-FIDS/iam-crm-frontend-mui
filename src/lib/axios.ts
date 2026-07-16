// ============================================================
// مسیر: src/lib/axios.ts
// ============================================================

import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { unwrapApiResponse, type ApiWrappedResponse } from '@/lib/apiResponse';
import { useAuthStore, type AuthUser } from '@/store/authStore';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface RefreshResponse {
  accessToken: string;
  user: AuthUser;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<RefreshResponse> | null = null;

function clearSessionAndRedirect(): void {
  useAuthStore.getState().clearUser();
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

function refreshSession(): Promise<RefreshResponse> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<ApiWrappedResponse<RefreshResponse>>('/auth/refresh', undefined, {
        baseURL,
        timeout: 30000,
        withCredentials: true,
      })
      .then((response) => {
        const session = unwrapApiResponse<RefreshResponse>(response.data);
        if (!session.accessToken || !session.user) {
          throw new Error('Invalid refresh response');
        }
        localStorage.setItem('accessToken', session.accessToken);
        useAuthStore.getState().setUser(session.user);
        return session;
      })
      .catch((error: unknown) => {
        clearSessionAndRedirect();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const requestUrl = originalRequest?.url ?? '';

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    if (requestUrl.includes('/auth/refresh')) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    if (requestUrl.includes('/auth/login')) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const session = await refreshSession();
      originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
      originalRequest.headers.set('Authorization', `Bearer ${session.accessToken}`);
      return axiosInstance(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
