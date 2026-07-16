import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminPermissionsService } from '../services/adminPermissions.service';
import type { PermissionPayload, RolePayload, UpdatePermissionPayload, UpdateRolePayload } from '../types/adminPermission.types';

export const adminPermissionQueryKeys = {
  all: ['admin', 'rbac'] as const,
  permissions: () => [...adminPermissionQueryKeys.all, 'permissions'] as const,
  roles: () => [...adminPermissionQueryKeys.all, 'roles'] as const,
  rolePermissions: (roleId: string) => [...adminPermissionQueryKeys.roles(), roleId, 'permissions'] as const,
};

export function usePermissions(enabled = true) { return useQuery({ queryKey: adminPermissionQueryKeys.permissions(), queryFn: adminPermissionsService.listPermissions, enabled }); }
export function useRoles(enabled = true) { return useQuery({ queryKey: adminPermissionQueryKeys.roles(), queryFn: adminPermissionsService.listRoles, enabled }); }
export function useRolePermissions(roleId: string, enabled = true) { return useQuery({ queryKey: adminPermissionQueryKeys.rolePermissions(roleId), queryFn: () => adminPermissionsService.getRolePermissions(roleId), enabled: enabled && Boolean(roleId) }); }

function useInvalidateRbac() { const client = useQueryClient(); return () => client.invalidateQueries({ queryKey: adminPermissionQueryKeys.all }); }
export function useCreatePermission() { const invalidate = useInvalidateRbac(); return useMutation({ mutationFn: (payload: PermissionPayload) => adminPermissionsService.createPermission(payload), onSuccess: invalidate }); }
export function useUpdatePermission(id: string) { const invalidate = useInvalidateRbac(); return useMutation({ mutationFn: (payload: UpdatePermissionPayload) => adminPermissionsService.updatePermission(id, payload), onSuccess: invalidate }); }
export function useDeletePermission() { const invalidate = useInvalidateRbac(); return useMutation({ mutationFn: adminPermissionsService.deletePermission, onSuccess: invalidate }); }
export function useCreateRole() { const invalidate = useInvalidateRbac(); return useMutation({ mutationFn: (payload: RolePayload) => adminPermissionsService.createRole(payload), onSuccess: invalidate }); }
export function useUpdateRole(id: string) { const invalidate = useInvalidateRbac(); return useMutation({ mutationFn: (payload: UpdateRolePayload) => adminPermissionsService.updateRole(id, payload), onSuccess: invalidate }); }
export function useDeleteRole() { const invalidate = useInvalidateRbac(); return useMutation({ mutationFn: adminPermissionsService.deleteRole, onSuccess: invalidate }); }
export function useUpdateRolePermissions(roleId: string) { const invalidate = useInvalidateRbac(); return useMutation({ mutationFn: (permissionIds: string[]) => adminPermissionsService.updateRolePermissions(roleId, permissionIds), onSuccess: invalidate }); }
