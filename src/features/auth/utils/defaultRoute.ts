import type { AuthUser } from '@/store/authStore';

export const BOARDS_DASHBOARD_PATH = '/boards/dashboard';

export function getDefaultRouteForUser(user: AuthUser): string {
  return user.role === 'BOARDS' ? BOARDS_DASHBOARD_PATH : '/dashboard';
}
