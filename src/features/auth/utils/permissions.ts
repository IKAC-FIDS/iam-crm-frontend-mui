import type { AuthUser } from '@/store/authStore';

export function can(
  user: AuthUser | null | undefined,
  permission: string,
  fallbackRoles: readonly string[] = [],
): boolean {
  if (!user) return false;

  if (user.role === 'ADMIN') return true;

  return (
    user.permissions?.includes(permission) ||
    fallbackRoles.includes(user.role)
  );
}

export function canAny(
  user: AuthUser | null | undefined,
  permissions: readonly string[],
  fallbackRoles: readonly string[] = [],
): boolean {
  return permissions.some((permission) => can(user, permission, fallbackRoles));
}

export function canAll(
  user: AuthUser | null | undefined,
  permissions: readonly string[],
  fallbackRoles: readonly string[] = [],
): boolean {
  return permissions.every((permission) => can(user, permission, fallbackRoles));
}
