import axiosInstance from '@/lib/axios';
import { unwrapApiResponse } from '@/lib/apiResponse';
import type {
  ManagedPermission,
  ManagedRole,
  PermissionPayload,
  RolePayload,
  RolePermissionDetails,
  UpdatePermissionPayload,
  UpdateRolePayload,
} from '../types/adminPermission.types';

function unwrapList<T>(payload: unknown): T[] {
  const value = unwrapApiResponse<unknown>(payload);
  if (Array.isArray(value)) return value as T[];
  return value && typeof value === 'object' && 'items' in value && Array.isArray((value as { items?: unknown }).items)
    ? (value as { items: T[] }).items
    : [];
}

export const adminPermissionsService = {
  listPermissions: async (): Promise<ManagedPermission[]> => {
    const response = await axiosInstance.get('/permissions');
    return unwrapList<ManagedPermission>(response.data);
  },
  getPermission: async (id: string): Promise<ManagedPermission> => {
    const response = await axiosInstance.get(`/permissions/${id}`);
    return unwrapApiResponse<ManagedPermission>(response.data);
  },
  createPermission: async (payload: PermissionPayload): Promise<ManagedPermission> => {
    const response = await axiosInstance.post('/permissions', payload);
    return unwrapApiResponse<ManagedPermission>(response.data);
  },
  updatePermission: async (id: string, payload: UpdatePermissionPayload): Promise<ManagedPermission> => {
    const response = await axiosInstance.patch(`/permissions/${id}`, payload);
    return unwrapApiResponse<ManagedPermission>(response.data);
  },
  deletePermission: async (id: string): Promise<void> => { await axiosInstance.delete(`/permissions/${id}`); },
  listRoles: async (): Promise<ManagedRole[]> => {
    const response = await axiosInstance.get('/roles');
    return unwrapList<ManagedRole>(response.data);
  },
  getRole: async (id: string): Promise<ManagedRole> => {
    const response = await axiosInstance.get(`/roles/${id}`);
    return unwrapApiResponse<ManagedRole>(response.data);
  },
  createRole: async (payload: RolePayload): Promise<ManagedRole> => {
    const response = await axiosInstance.post('/roles', payload);
    return unwrapApiResponse<ManagedRole>(response.data);
  },
  updateRole: async (id: string, payload: UpdateRolePayload): Promise<ManagedRole> => {
    const response = await axiosInstance.patch(`/roles/${id}`, payload);
    return unwrapApiResponse<ManagedRole>(response.data);
  },
  deleteRole: async (id: string): Promise<void> => { await axiosInstance.delete(`/roles/${id}`); },
  getRolePermissions: async (roleId: string): Promise<RolePermissionDetails> => {
    const response = await axiosInstance.get(`/roles/${roleId}/permissions`);
    return unwrapApiResponse<RolePermissionDetails>(response.data);
  },
  updateRolePermissions: async (roleId: string, permissionIds: string[]): Promise<RolePermissionDetails> => {
    const response = await axiosInstance.put(`/roles/${roleId}/permissions`, { permissionIds });
    return unwrapApiResponse<RolePermissionDetails>(response.data);
  },
};
