export const USER_ROLES = ['ADMIN', 'MANAGER', 'REP', 'BOARDS'] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'ادمین',
  MANAGER: 'مدیر فروش',
  REP: 'کارشناس فروش',
  BOARDS: 'برد / مشاهده‌گر',
};

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  teamId?: string | null;
  team?: string | null;
  teamName?: string | null;
  teamCode?: string | null;
  isActive?: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  permissions?: string[];
}
export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  teamId?: string;
  team?: string;
}
export interface UpdateUserRolePayload {
  role: UserRole;
  teamId?: string;
  team?: string;
}
export function isUserActive(user: AdminUser): boolean { if (typeof user.isActive === 'boolean') return user.isActive; if (typeof user.active === 'boolean') return user.active; return true; }
