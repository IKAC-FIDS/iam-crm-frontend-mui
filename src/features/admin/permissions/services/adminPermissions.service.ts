import axiosInstance from '@/lib/axios';
import type { BulkRolePermissionPayload, CreatePermissionPayload, RolePermissionPayload } from '../types/adminPermission.types';
export const adminPermissionsService = {
  assignPermission: async (payload: RolePermissionPayload) => { await axiosInstance.post('/admin/permissions/assign', payload); },
  revokePermission: async (payload: RolePermissionPayload) => { await axiosInstance.delete('/admin/permissions/revoke', { data: payload }); },
  bulkAssignPermissions: async (payload: BulkRolePermissionPayload) => { await axiosInstance.post('/admin/permissions/bulk-assign', payload); },
  bulkRevokePermissions: async (payload: BulkRolePermissionPayload) => { await axiosInstance.delete('/admin/permissions/bulk-revoke', { data: payload }); },
  createPermission: async (payload: CreatePermissionPayload) => { await axiosInstance.post('/admin/permissions/create', payload); },
};
