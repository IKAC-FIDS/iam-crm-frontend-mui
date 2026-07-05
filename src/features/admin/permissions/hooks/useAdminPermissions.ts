import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminPermissionsService } from '../services/adminPermissions.service';
export const adminPermissionQueryKeys = { all: ['admin', 'permissions'] as const };
function mutation<T>(fn: (payload: T) => Promise<void>) { return function usePermissionMutation() { const client = useQueryClient(); return useMutation({ mutationFn: fn, onSuccess: () => client.invalidateQueries({ queryKey: adminPermissionQueryKeys.all }) }); }; }
export const useAssignPermission = mutation(adminPermissionsService.assignPermission);
export const useRevokePermission = mutation(adminPermissionsService.revokePermission);
export const useBulkAssignPermissions = mutation(adminPermissionsService.bulkAssignPermissions);
export const useBulkRevokePermissions = mutation(adminPermissionsService.bulkRevokePermissions);
export const useCreatePermission = mutation(adminPermissionsService.createPermission);
