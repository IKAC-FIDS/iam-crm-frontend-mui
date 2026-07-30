import { Suspense, useEffect, type ComponentType } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import RouteLoadingFallback from './RouteLoadingFallback';
import { RouteAccessGuard } from './RouteAccessGuard';
import { resolvedRouteRegistry } from './routeRegistry';
import type { ResolvedAppRoute } from './routeRegistry.types';

function RouteTitle({ title }: { title?: string }) {
  useEffect(() => {
    if (title) document.title = `${title} | IAM CRM`;
  }, [title]);
  return null;
}

export default function RegistryRouteElement({ route }: { route: ResolvedAppRoute }) {
  const LazyComponent = route.lazyComponent as ComponentType | undefined;
  const content = route.redirectTo
    ? <Navigate to={resolvedRouteRegistry.find((candidate) => candidate.id === route.redirectTo)?.fullPath ?? '/'} replace />
    : LazyComponent
      ? <LazyComponent />
      : <Outlet />;

  return (
    <RouteAccessGuard policy={route.access}>
      <RouteTitle title={route.title ?? route.breadcrumb?.label ?? route.menu?.label} />
      <Suspense fallback={<RouteLoadingFallback />}>{content}</Suspense>
    </RouteAccessGuard>
  );
}
