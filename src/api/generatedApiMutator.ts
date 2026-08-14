import type { AxiosRequestConfig } from 'axios';
import axiosInstance from '@/lib/axios';

/**
 * Runtime boundary for generated endpoints.
 * Authentication, refresh, credentials, base URL, and correlation behavior
 * remain owned by the existing shared Axios instance.
 */
export async function generatedApiMutator<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  const generatedUrl = options?.url ?? config.url;
  const url = generatedUrl?.replace(/^\/api(?=\/|$)/, '') || generatedUrl;
  const response = await axiosInstance.request<T>({ ...config, ...options, url });
  return response.data;
}
