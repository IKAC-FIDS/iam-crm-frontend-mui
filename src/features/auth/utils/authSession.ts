import { queryClient } from '@/lib/queryClient';
import { useAuthStore, type AuthUser } from '@/store/authStore';

export interface AuthenticatedSession {
  accessToken: string;
  user: AuthUser;
}

function effectiveTenantKey(user: AuthUser | null): string | null {
  return user ? `${user.id}:${user.organizationId ?? 'platform-only'}` : null;
}

export function applyAuthenticatedSession(session: AuthenticatedSession): void {
  const previousUser = useAuthStore.getState().user;
  if (effectiveTenantKey(previousUser) !== effectiveTenantKey(session.user)) {
    queryClient.clear();
  }
  localStorage.setItem('accessToken', session.accessToken);
  useAuthStore.getState().setUser(session.user);
}
