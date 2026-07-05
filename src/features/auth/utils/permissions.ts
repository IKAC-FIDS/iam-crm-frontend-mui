import type { AuthUser } from '@/store/authStore';

export function can(
  user: AuthUser | null | undefined,
  permission: string,
  fallbackRoles: readonly string[] = [],
): boolean {
  if (!user) return false;

  return (
    user.permissions?.includes(permission) ||
    fallbackRoles.includes(user.role)
  );
}
