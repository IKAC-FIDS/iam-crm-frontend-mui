import type { AuthUser } from '@/store/authStore';

export function can(
  user: AuthUser | null | undefined,
  permission: string,
  _legacyFallbackRoles: readonly string[] = [],
): boolean {
  void _legacyFallbackRoles;
  if (!user) return false;
  return Array.isArray(user.permissions) && user.permissions.includes(permission);
}

export function canAny(
  user: AuthUser | null | undefined,
  permissions: readonly string[],
  legacyFallbackRoles: readonly string[] = [],
): boolean {
  return permissions.some((permission) => can(user, permission, legacyFallbackRoles));
}

export function canAll(
  user: AuthUser | null | undefined,
  permissions: readonly string[],
  legacyFallbackRoles: readonly string[] = [],
): boolean {
  return permissions.every((permission) => can(user, permission, legacyFallbackRoles));
}
