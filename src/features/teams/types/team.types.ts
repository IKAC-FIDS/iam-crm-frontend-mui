import type { AdminUser, UserRole } from '@/features/admin/users/types/adminUser.types';

export type TeamStatus = 'ACTIVE' | 'INACTIVE';

export interface Team {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  managerId?: string | null;
  managerName?: string | null;
  manager?: Pick<AdminUser, 'id' | 'fullName' | 'email' | 'role'> | null;
  memberCount?: number | null;
  isActive?: boolean;
  active?: boolean;
  status?: TeamStatus | string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  id: string;
  userId?: string;
  fullName: string;
  email?: string | null;
  role?: UserRole | string | null;
  teamId?: string | null;
  isActive?: boolean;
  active?: boolean;
}

export interface FindTeamsParams {
  search?: string;
  includeInactive?: boolean;
}

export interface CreateTeamPayload {
  name: string;
  code?: string;
  managerId?: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateTeamPayload = Partial<CreateTeamPayload>;

export function isTeamActive(team: Team): boolean {
  if (typeof team.isActive === 'boolean') return team.isActive;
  if (typeof team.active === 'boolean') return team.active;
  if (typeof team.status === 'string') return team.status.toUpperCase() !== 'INACTIVE';
  return true;
}

export function getTeamManagerName(team: Team): string {
  return team.manager?.fullName ?? team.managerName ?? '—';
}

export function getTeamDisplayName(team: Pick<Team, 'name' | 'code'>): string {
  return team.code ? `${team.name} — ${team.code}` : team.name;
}
