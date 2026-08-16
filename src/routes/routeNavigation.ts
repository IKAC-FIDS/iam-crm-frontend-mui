import { matchPath } from 'react-router-dom';
import type { AuthUser } from '@/store/authStore';
import { canAccessRoute } from './routeAccess';
import { resolvedRouteRegistry } from './routeRegistry';

const boardsMenuRouteIds = new Set([
  'boards-dashboard',
  'reports',
  'account-security',
]);

export function getVisibleMenuRoutes(user: AuthUser | null | undefined) {
  return resolvedRouteRegistry
    .filter((route) => route.menu && canAccessRoute(user, route.access))
    .filter((route) => user?.role !== 'BOARDS' || boardsMenuRouteIds.has(route.id))
    .sort((left, right) => (left.menu?.order ?? 0) - (right.menu?.order ?? 0));
}

export function isMenuRouteActive(routePath: string, pathname: string): boolean {
  return pathname === routePath || (routePath !== '/dashboard' && pathname.startsWith(`${routePath}/`));
}

export interface AppBreadcrumb {
  routeId: string;
  label: string;
  to?: string;
  current: boolean;
}

function matchingRoute(pathname: string) {
  return resolvedRouteRegistry
    .filter((route) => route.fullPath !== '*' && !route.index && matchPath({ path: route.fullPath, end: true }, pathname))
    .sort((left, right) => right.fullPath.split('/').length - left.fullPath.split('/').length)[0];
}

export function getRouteBreadcrumbs(pathname: string, user: AuthUser | null | undefined): AppBreadcrumb[] {
  const current = matchingRoute(pathname);
  if (!current || !canAccessRoute(user, current.access)) return [];

  const byId = new Map(resolvedRouteRegistry.map((route) => [route.id, route]));
  const hierarchy = [];
  let cursor: typeof current | undefined = current;
  while (cursor) {
    hierarchy.unshift(cursor);
    cursor = cursor.parentId ? byId.get(cursor.parentId) : undefined;
  }

  const entries = hierarchy
    .filter((route) => route.breadcrumb && route.breadcrumb.include !== false && canAccessRoute(user, route.access))
    .map((route) => ({ routeId: route.id, label: route.breadcrumb!.label, to: route.fullPath, current: route.id === current.id }));

  const homeRouteId = user?.role === 'BOARDS' ? 'boards-dashboard' : 'dashboard';
  const homePath = user?.role === 'BOARDS' ? '/boards/dashboard' : '/dashboard';

  if (!entries.some((entry) => entry.routeId === homeRouteId)) {
    entries.unshift({ routeId: homeRouteId, label: 'خانه', to: homePath, current: false });
  }

  return entries.map((entry, index) => ({
    ...entry,
    to: index === entries.length - 1 ? undefined : entry.to,
    current: index === entries.length - 1,
  }));
}
