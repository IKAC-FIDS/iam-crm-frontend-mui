import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import { tenantA, tenantB, testUser } from '@/test/fixtures';
import { useAuthStore } from '@/store/authStore';
import { organizationQueryKeys } from './useCurrentOrganization';

describe('organization-aware cache contract', () => {
  it('partitions the current-organization query key by authoritative session organization', () => {
    const keyA = organizationQueryKeys.current(testUser({ organizationId: tenantA.id }).organizationId);
    const keyB = organizationQueryKeys.current(testUser({ organizationId: tenantB.id }).organizationId);
    expect(keyA).not.toEqual(keyB);
    expect(keyA).toContain(tenantA.id);
    expect(keyB).toContain(tenantB.id);
  });

  it('does not render tenant A cache under tenant B key', () => {
    const client = new QueryClient();
    client.setQueryData(organizationQueryKeys.current(tenantA.id), tenantA);
    useAuthStore.getState().setUser(testUser({ organizationId: tenantB.id }));
    expect(client.getQueryData(organizationQueryKeys.current(tenantB.id))).toBeUndefined();
    expect(client.getQueryData(organizationQueryKeys.current(tenantA.id))).toEqual(tenantA);
  });
});
