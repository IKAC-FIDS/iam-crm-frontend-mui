import type { AuthUser } from '@/store/authStore';
import { canAll, canAny } from '@/features/auth/utils/permissions';
import type { RouteAccessPolicy } from './routeRegistry.types';

export function isRoutePolicyValid(policy: unknown): policy is RouteAccessPolicy {
  if (!policy || typeof policy !== 'object' || !('type' in policy)) return false;
  if (policy.type === 'public' || policy.type === 'authenticated') return true;

  if (policy.type === 'roles') {
    return (
      'roles' in policy &&
      Array.isArray(policy.roles) &&
      policy.roles.length > 0 &&
      policy.roles.every((role) => typeof role === 'string' && role.trim().length > 0)
    );
  }

  if (policy.type !== 'permissions' || !('mode' in policy) || !('permissions' in policy)) return false;
  return (
    (policy.mode === 'any' || policy.mode === 'all') &&
    Array.isArray(policy.permissions) &&
    policy.permissions.length > 0 &&
    policy.permissions.every((permission) => typeof permission === 'string' && permission.trim().length > 0)
  );
}

export function canAccessRoute(user: AuthUser | null | undefined, policy: RouteAccessPolicy): boolean {
  if (!isRoutePolicyValid(policy)) return false;
  if (policy.type === 'public') return true;
  if (!user) return false;
  if (policy.type === 'authenticated') return true;
  if (policy.type === 'roles') return policy.roles.includes(user.role);

  return policy.mode === 'all'
    ? canAll(user, policy.permissions)
    : canAny(user, policy.permissions);
}
