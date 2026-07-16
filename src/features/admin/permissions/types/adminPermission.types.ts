import type { UserRole } from '../../users/types/adminUser.types';

export const KNOWN_PERMISSION_ACTIONS = ['company:view','company:create','company:update','company:change-stage','company:assign-owner','person:view','person:manage','activity:view','activity:create','activity:update','follow-up:view','follow-up:complete','follow-up:reschedule','call-card:view','call-card:manage','branch:manage','social-channel:manage','pipeline:view','report:view','user:view','user:manage','permission:view','permission:manage','role:view','role:manage','library:university:view','library:university:manage','import:sam','analytics:view'] as const;

export interface ManagedPermission {
  id: string;
  action: string;
  name?: string | null;
  group?: string | null;
  description?: string | null;
  isSystem: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  assigned?: boolean;
}

export interface PermissionPayload {
  action: string;
  name?: string;
  group?: string;
  description?: string;
  isActive?: boolean;
}

export type UpdatePermissionPayload = Partial<PermissionPayload>;

export interface ManagedRole {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  baseRole: UserRole;
  isSystem: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: { users?: number; permissions?: number };
}

export interface RolePayload {
  code: string;
  name: string;
  description?: string;
  baseRole?: UserRole;
  isActive?: boolean;
}

export type UpdateRolePayload = Omit<Partial<RolePayload>, 'code'>;

export interface RolePermissionDetails {
  role: Pick<ManagedRole, 'id' | 'code' | 'name'>;
  assignedPermissionIds: string[];
  assignedActions: string[];
  permissions: ManagedPermission[];
}
