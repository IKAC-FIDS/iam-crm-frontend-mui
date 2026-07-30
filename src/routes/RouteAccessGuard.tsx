import { useSyncExternalStore, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '@/store/authStore';
import { canAccessRoute, isRoutePolicyValid } from './routeAccess';
import { ForbiddenContent } from './ForbiddenContent';
import type { RouteAccessPolicy } from './routeRegistry.types';

interface RouteAccessGuardProps {
  policy: RouteAccessPolicy;
  children: ReactNode;
  hydrated?: boolean;
}

function useAuthHydration(override?: boolean) {
  const hydrated = useSyncExternalStore(
    (notify) => {
      const removeStart = useAuthStore.persist.onHydrate(notify);
      const removeFinish = useAuthStore.persist.onFinishHydration(notify);
      return () => { removeStart(); removeFinish(); };
    },
    () => useAuthStore.persist.hasHydrated(),
    () => true,
  );
  return override ?? hydrated;
}

export function RouteAccessGuard({ policy, children, hydrated: hydrationOverride }: RouteAccessGuardProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const hydrated = useAuthHydration(hydrationOverride);

  if (policy.type !== 'public' && !hydrated) {
    return (
      <Box role="status" aria-label="در حال بررسی دسترسی" sx={{ minHeight: 240, display: 'grid', placeItems: 'center' }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  if (!isRoutePolicyValid(policy)) {
    return <ForbiddenContent embedded />;
  }

  if (policy.type !== 'public' && !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!canAccessRoute(user, policy)) {
    return <ForbiddenContent embedded />;
  }

  return children;
}
