import { beforeEach, describe, expect, it, vi } from 'vitest';
import { queryClient } from '@/lib/queryClient';
import { testUser, tenantA, tenantB } from '@/test/fixtures';
import { useAuthStore } from '@/store/authStore';
import { applyAuthenticatedSession } from './authSession';

describe('authenticated tenant cache safety', () => {
  beforeEach(() => {
    queryClient.clear();
    useAuthStore.setState({ user: null });
    localStorage.clear();
  });

  it('clears tenant-scoped cache when effective organization changes', () => {
    useAuthStore.setState({ user: testUser({ organizationId: tenantA.id }) });
    queryClient.setQueryData(['companies'], ['tenant-a-company']);
    applyAuthenticatedSession({ accessToken: 'new-token', user: testUser({ organizationId: tenantB.id }) });
    expect(queryClient.getQueryData(['companies'])).toBeUndefined();
    expect(localStorage.getItem('accessToken')).toBe('new-token');
  });

  it('does not clear cache during same-tenant token refresh', () => {
    useAuthStore.setState({ user: testUser({ organizationId: tenantA.id }) });
    queryClient.setQueryData(['companies'], ['tenant-a-company']);
    const clear = vi.spyOn(queryClient, 'clear');
    applyAuthenticatedSession({ accessToken: 'rotated-token', user: testUser({ organizationId: tenantA.id }) });
    expect(clear).not.toHaveBeenCalled();
    expect(queryClient.getQueryData(['companies'])).toEqual(['tenant-a-company']);
  });
});
