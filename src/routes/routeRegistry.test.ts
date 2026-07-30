import { describe, expect, it } from 'vitest';
import { routeRegistry, resolvedRouteRegistry, validateRouteRegistry } from './routeRegistry';

describe('route registry', () => {
  it('has unique valid identities, parents, policies, menu references and paths', () => {
    expect(validateRouteRegistry()).toEqual([]);
    expect(new Set(routeRegistry.map((route) => route.id)).size).toBe(routeRegistry.length);
  });

  it('preserves public, authenticated, protected, hidden-detail, dynamic and fallback routes', () => {
    expect(resolvedRouteRegistry.find((route) => route.id === 'login')?.access.type).toBe('public');
    expect(resolvedRouteRegistry.find((route) => route.id === 'dashboard')?.access.type).toBe('authenticated');
    expect(resolvedRouteRegistry.find((route) => route.id === 'activities')?.access.type).toBe('permissions');
    const companyDetails = resolvedRouteRegistry.find((route) => route.id === 'company-details');
    expect(companyDetails?.fullPath).toBe('/companies/:companyId');
    expect(companyDetails?.menu).toBeUndefined();
    expect(resolvedRouteRegistry.find((route) => route.id === 'not-found')?.fullPath).toBe('*');
  });

  it('reports malformed definitions without granting access', () => {
    const invalid = [
      { id: 'duplicate', path: '/', access: { type: 'public' as const } },
      { id: 'duplicate', parentId: 'missing', path: 'private', access: { type: 'permissions' as const, mode: 'any' as const, permissions: [] } },
    ];
    expect(validateRouteRegistry(invalid)).toEqual(expect.arrayContaining([
      'Duplicate route id: duplicate',
      'Unknown parent: duplicate -> missing',
      'Invalid access policy: duplicate',
    ]));
  });

  it('rejects empty identities and self-parent relationships', () => {
    const invalid = [
      { id: '', path: '/empty', access: { type: 'public' as const } },
      { id: 'self', parentId: 'self', path: 'self', access: { type: 'authenticated' as const } },
    ];
    expect(validateRouteRegistry(invalid)).toEqual(expect.arrayContaining([
      'Route id must not be empty',
      'Route cannot be its own parent: self',
    ]));
  });
});
