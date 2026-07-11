import axiosInstance from '@/lib/axios';
import { unwrapApiResponse } from '@/lib/apiResponse';
import { USER_ROLES } from '../../users/types/adminUser.types';
import type { UserRole } from '../../users/types/adminUser.types';
import type { BulkRolePermissionPayload, CreatePermissionPayload, PermissionMatrixRow, RolePermissionPayload } from '../types/adminPermission.types';

const emptyAssignments = (): Record<UserRole, boolean> => ({ ADMIN: false, MANAGER: false, REP: false, BOARDS: false });
const actionFrom = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  const action = item.action ?? item.name ?? item.key;
  return typeof action === 'string' ? action : null;
};

function normalizeMatrix(response: unknown): PermissionMatrixRow[] {
  const root = unwrapApiResponse<unknown>(response);
  const source = root && typeof root === 'object' && 'matrix' in root ? (root as { matrix: unknown }).matrix : root;
  const rows = new Map<string, PermissionMatrixRow>();
  const ensure = (action: string, description?: string | null) => {
    if (!rows.has(action)) rows.set(action, { action, description, assignments: emptyAssignments() });
    return rows.get(action)!;
  };
  const addRow = (raw: unknown) => {
    const action = actionFrom(raw); if (!action) return;
    const item = typeof raw === 'object' && raw ? raw as Record<string, unknown> : {};
    const row = ensure(action, typeof item.description === 'string' ? item.description : null);
    const roles = item.roles ?? item.assignedRoles ?? item.assignments;
    USER_ROLES.forEach((role) => {
      if (Array.isArray(roles)) row.assignments[role] = roles.includes(role);
      else if (roles && typeof roles === 'object') row.assignments[role] = Boolean((roles as Record<string, unknown>)[role]);
      else if (role in item) row.assignments[role] = Boolean(item[role]);
    });
  };

  if (Array.isArray(source)) {
    source.forEach(addRow);
  } else if (source && typeof source === 'object') {
    const object = source as Record<string, unknown>;
    const roleSource = object.roles && typeof object.roles === 'object' ? object.roles as Record<string, unknown> : object;
    USER_ROLES.forEach((role) => {
      const permissions = roleSource[role];
      if (!Array.isArray(permissions)) return;
      permissions.forEach((permission) => { const action = actionFrom(permission); if (action) ensure(action).assignments[role] = true; });
    });
    if (Array.isArray(object.permissions)) object.permissions.forEach(addRow);
  }
  return [...rows.values()].sort((a, b) => a.action.localeCompare(b.action));
}

export const adminPermissionsService = {
  getPermissionMatrix: async (): Promise<PermissionMatrixRow[]> => { const response = await axiosInstance.get('/admin/permissions/matrix'); return normalizeMatrix(response.data); },
  assignPermission: async (payload: RolePermissionPayload) => { await axiosInstance.post('/admin/permissions/assign', payload); },
  revokePermission: async (payload: RolePermissionPayload) => { await axiosInstance.delete('/admin/permissions/revoke', { data: payload }); },
  bulkAssignPermissions: async (payload: BulkRolePermissionPayload) => { await axiosInstance.post('/admin/permissions/bulk-assign', payload); },
  bulkRevokePermissions: async (payload: BulkRolePermissionPayload) => { await axiosInstance.post('/admin/permissions/bulk-revoke', payload); },
  createPermission: async (payload: CreatePermissionPayload) => { await axiosInstance.post('/admin/permissions/create', payload); },
};
