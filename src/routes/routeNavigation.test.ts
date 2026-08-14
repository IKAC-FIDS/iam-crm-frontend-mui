import { describe, expect, it } from 'vitest';
import { testUser } from '@/test/fixtures';
import { getRouteBreadcrumbs, getVisibleMenuRoutes, isMenuRouteActive } from './routeNavigation';

describe('registry navigation derivation', () => {
  it('keeps menu ordering and hides unauthorized and detail routes', () => {
    const routes = getVisibleMenuRoutes(testUser({ role: 'VIEWER', permissions: ['activity:view'] }));
    expect(routes.map((route) => route.id)).toContain('activities');
    expect(routes.map((route) => route.id)).not.toContain('admin-users');
    expect(routes.map((route) => route.id)).not.toContain('company-details');
    expect(routes.map((route) => route.menu!.order)).toEqual([...routes].map((route) => route.menu!.order).sort((a, b) => a - b));
  });

  it('derives static, nested and dynamic breadcrumbs from registry parents', () => {
    const user = testUser({ role: 'VIEWER', permissions: ['opportunity:view'] });
    expect(getRouteBreadcrumbs('/opportunities/abc', user).map((item) => item.label)).toEqual(['خانه', 'فرصت‌ها', 'جزئیات فرصت']);
    expect(getRouteBreadcrumbs('/admin/users', testUser({ permissions: ['user:view'] })).map((item) => item.label)).toEqual(['خانه', 'مدیریت', 'کاربران']);
    expect(getRouteBreadcrumbs('/activities', testUser({ role: 'VIEWER', permissions: [] }))).toEqual([]);
  });

  it('does not expose tenant or platform administration from role names alone', () => {
    const routes = getVisibleMenuRoutes(testUser({ role: 'ADMIN', permissions: [] }));
    expect(routes.map((route) => route.id)).not.toContain('admin-users');
    expect(routes.map((route) => route.id)).not.toContain('admin-organizations');
    expect(routes.map((route) => route.id)).not.toContain('admin-sso-providers');
  });

  it('marks list routes active for detail URLs without selecting dashboard broadly', () => {
    expect(isMenuRouteActive('/companies', '/companies/abc')).toBe(true);
    expect(isMenuRouteActive('/dashboard', '/dashboard/extra')).toBe(false);
  });
});
