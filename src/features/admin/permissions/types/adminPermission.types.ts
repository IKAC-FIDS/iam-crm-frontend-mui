import type { UserRole } from '../../users/types/adminUser.types';
export const KNOWN_PERMISSION_ACTIONS = ['company:view','company:create','company:update','company:change-stage','company:assign-owner','person:view','person:manage','activity:view','activity:create','activity:update','follow-up:view','follow-up:complete','follow-up:reschedule','call-card:view','call-card:manage','branch:manage','social-channel:manage','pipeline:view','report:view','user:view','user:manage','permission:view','permission:manage','import:sam','analytics:view'] as const;
export interface RolePermissionPayload { role: UserRole; action: string }
export interface BulkRolePermissionPayload { role: UserRole; actions: string[] }
export interface CreatePermissionPayload { action: string; description?: string }
export interface PermissionMatrixRow {
  action: string;
  description?: string | null;
  assignments: Record<UserRole, boolean>;
}
