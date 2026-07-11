import axiosInstance from '@/lib/axios';
import { unwrapApiResponse } from '@/lib/apiResponse';
import type { AdminUser, CreateUserPayload, UpdateUserRolePayload } from '../types/adminUser.types';
function list(payload: unknown): AdminUser[] { const data = unwrapApiResponse<unknown>(payload); return Array.isArray(data) ? data as AdminUser[] : data && typeof data === 'object' && 'items' in data && Array.isArray((data as { items?: unknown }).items) ? (data as { items: AdminUser[] }).items : []; }
export const adminUsersService = {
  getUsers: async () => { const response = await axiosInstance.get<AdminUser[] | { data?: AdminUser[]; items?: AdminUser[] }>('/users'); return list(response.data).map((user) => ({ ...user, permissions: user.permissions ?? [] })); },
  getOwnerOptions: async () => { const response = await axiosInstance.get<AdminUser[] | { data?: AdminUser[]; items?: AdminUser[] }>('/users/owner-options'); return list(response.data); },
  getUserById: async (id: string) => { const response = await axiosInstance.get<AdminUser | { data: AdminUser }>(`/users/${id}`); return unwrapApiResponse<AdminUser>(response.data); },
  createUser: async (payload: CreateUserPayload) => { const response = await axiosInstance.post<AdminUser | { data: AdminUser }>('/users', payload); return unwrapApiResponse<AdminUser>(response.data); },
  updateUserRole: async (id: string, payload: UpdateUserRolePayload) => { const response = await axiosInstance.patch<AdminUser | { data: AdminUser }>(`/users/${id}/role`, payload); return unwrapApiResponse<AdminUser>(response.data); },
  activateUser: async (id: string) => { const response = await axiosInstance.patch<AdminUser | { data: AdminUser }>(`/users/${id}/activate`); return unwrapApiResponse<AdminUser>(response.data); },
  deactivateUser: async (id: string) => { const response = await axiosInstance.patch<AdminUser | { data: AdminUser }>(`/users/${id}/deactivate`); return unwrapApiResponse<AdminUser>(response.data); },
};
