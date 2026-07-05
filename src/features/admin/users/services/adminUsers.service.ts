import axiosInstance from '@/lib/axios';
import type { AdminUser, CreateUserPayload, UpdateUserRolePayload } from '../types/adminUser.types';
function unwrap<T>(payload: T | { data: T }): T { return typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data : payload; }
function list(payload: AdminUser[] | { data?: AdminUser[]; items?: AdminUser[] }): AdminUser[] { return Array.isArray(payload) ? payload : payload.data ?? payload.items ?? []; }
export const adminUsersService = {
  getUsers: async () => { const response = await axiosInstance.get<AdminUser[] | { data?: AdminUser[]; items?: AdminUser[] }>('/users'); return list(response.data).map((user) => ({ ...user, permissions: user.permissions ?? [] })); },
  getUserById: async (id: string) => { const response = await axiosInstance.get<AdminUser | { data: AdminUser }>(`/users/${id}`); return unwrap(response.data); },
  createUser: async (payload: CreateUserPayload) => { const response = await axiosInstance.post<AdminUser | { data: AdminUser }>('/users', payload); return unwrap(response.data); },
  updateUserRole: async (id: string, payload: UpdateUserRolePayload) => { const response = await axiosInstance.patch<AdminUser | { data: AdminUser }>(`/users/${id}/role`, payload); return unwrap(response.data); },
  activateUser: async (id: string) => { const response = await axiosInstance.patch<AdminUser | { data: AdminUser }>(`/users/${id}/activate`); return unwrap(response.data); },
  deactivateUser: async (id: string) => { const response = await axiosInstance.patch<AdminUser | { data: AdminUser }>(`/users/${id}/deactivate`); return unwrap(response.data); },
};
