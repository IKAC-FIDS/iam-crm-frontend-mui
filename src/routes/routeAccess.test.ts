import { describe, expect, it } from 'vitest';
import { testUser } from '@/test/fixtures';
import { canAccessRoute, isRoutePolicyValid } from './routeAccess';

describe('route access policy', () => {
  it('supports public, authenticated, any and all policies', () => {
    const user = testUser({ role: 'VIEWER', permissions: ['activity:view', 'task:view'] });
    expect(canAccessRoute(null, { type: 'public' })).toBe(true);
    expect(canAccessRoute(user, { type: 'authenticated' })).toBe(true);
    expect(canAccessRoute(user, { type: 'permissions', mode: 'any', permissions: ['missing', 'activity:view'] })).toBe(true);
    expect(canAccessRoute(user, { type: 'permissions', mode: 'all', permissions: ['activity:view', 'task:view'] })).toBe(true);
    expect(canAccessRoute(user, { type: 'permissions', mode: 'all', permissions: ['activity:view', 'meeting:view'] })).toBe(false);
  });

  it('keeps documented role compatibility centralized and denies unknown roles', () => {
    const policy = { type: 'permissions', mode: 'any', permissions: ['activity:view'], fallbackRoles: ['MANAGER'] } as const;
    expect(canAccessRoute(testUser({ role: 'MANAGER', permissions: [] }), policy)).toBe(true);
    expect(canAccessRoute(testUser({ role: 'UNKNOWN', permissions: [] }), policy)).toBe(false);
  });

  it('fails closed for absent or empty user permissions unless an explicit compatibility role applies', () => {
    const protectedPolicy = { type: 'permissions', mode: 'any', permissions: ['activity:view'] } as const;
    const legacyViewer = { ...testUser({ role: 'VIEWER' }), permissions: undefined } as unknown as ReturnType<typeof testUser>;
    expect(canAccessRoute(legacyViewer, protectedPolicy)).toBe(false);
    expect(canAccessRoute(testUser({ role: 'VIEWER', permissions: [] }), protectedPolicy)).toBe(false);

    const compatibilityPolicy = { ...protectedPolicy, fallbackRoles: ['MANAGER'] } as const;
    const legacyManager = { ...testUser({ role: 'MANAGER' }), permissions: undefined } as unknown as ReturnType<typeof testUser>;
    expect(canAccessRoute(legacyManager, compatibilityPolicy)).toBe(true);
  });

  it('fails closed for missing, empty, or malformed permission policies', () => {
    expect(isRoutePolicyValid({ type: 'permissions', mode: 'any', permissions: [] })).toBe(false);
    expect(isRoutePolicyValid({ type: 'permissions', mode: 'unknown', permissions: ['activity:view'] })).toBe(false);
    expect(isRoutePolicyValid(undefined)).toBe(false);
  });
});
