import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminUsersService } from '../services/adminUsers.service';
import type { CreateUserPayload, UpdateUserRolePayload } from '../types/adminUser.types';
export const adminUserQueryKeys = { all: ['admin', 'users'] as const };
export function useAdminUsers(enabled = true) { return useQuery({ queryKey: adminUserQueryKeys.all, queryFn: adminUsersService.getUsers, enabled }); }
function useInvalidateUsers() { const client = useQueryClient(); return () => Promise.all([client.invalidateQueries({ queryKey: adminUserQueryKeys.all }), client.invalidateQueries({ queryKey: ['users'] }), client.invalidateQueries({ queryKey: ['company-owner-options'] })]); }
export function useCreateUser() { const invalidate = useInvalidateUsers(); return useMutation({ mutationFn: (payload: CreateUserPayload) => adminUsersService.createUser(payload), onSuccess: invalidate }); }
export function useUpdateUserRole(id: string) { const invalidate = useInvalidateUsers(); return useMutation({ mutationFn: (payload: UpdateUserRolePayload) => adminUsersService.updateUserRole(id, payload), onSuccess: invalidate }); }
export function useActivateUser() { const invalidate = useInvalidateUsers(); return useMutation({ mutationFn: adminUsersService.activateUser, onSuccess: invalidate }); }
export function useDeactivateUser() { const invalidate = useInvalidateUsers(); return useMutation({ mutationFn: adminUsersService.deactivateUser, onSuccess: invalidate }); }
