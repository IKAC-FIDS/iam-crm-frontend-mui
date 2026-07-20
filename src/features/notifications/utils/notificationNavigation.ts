import type { NavigateFunction } from 'react-router-dom';

const exactInternalRoutes = [
  '/dashboard',
  '/companies',
  '/people',
  '/opportunities',
  '/tasks',
  '/meetings',
  '/pipeline',
  '/follow-ups',
  '/reports',
  '/notifications',
  '/account/security',
  '/admin/users',
  '/admin/permissions',
  '/admin/libraries',
  '/admin/pipeline',
  '/admin/audit-logs',
];

const detailRoutePrefixes = ['/companies/', '/opportunities/', '/meetings/'];

function isKnownInternalRoute(path: string): boolean {
  return (
    exactInternalRoutes.includes(path) ||
    detailRoutePrefixes.some((prefix) => path.startsWith(prefix) && path.length > prefix.length)
  );
}

export function getSafeNotificationTarget(actionUrl?: string | null): string | null {
  if (!actionUrl?.trim()) return null;
  const trimmed = actionUrl.trim();

  if (trimmed.startsWith('/')) {
    return isKnownInternalRoute(trimmed) ? trimmed : '/notifications';
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.origin !== window.location.origin) return null;
    const target = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    return getSafeNotificationTarget(target);
  } catch {
    return null;
  }
}

export function navigateToNotificationTarget(
  navigate: NavigateFunction,
  actionUrl?: string | null,
): boolean {
  const target = getSafeNotificationTarget(actionUrl);
  if (!target) return false;
  navigate(target);
  return true;
}
