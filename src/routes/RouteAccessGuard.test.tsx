import { screen } from '@testing-library/react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { testUser } from '@/test/fixtures';
import { useAuthStore } from '@/store/authStore';
import ForbiddenPage from './ForbiddenPage';
import NotFoundPage from './NotFoundPage';
import { RouteAccessGuard } from './RouteAccessGuard';
import type { RouteAccessPolicy } from './routeRegistry.types';

function Secret({ onRender }: { onRender: () => void }) {
  onRender();
  return <div>PROTECTED_CONTENT</div>;
}

function LocationProbe() {
  return <output aria-label="current-path">{useLocation().pathname}</output>;
}

function GuardedRoutes({ policy, hydrated = true, onRender = () => undefined }: { policy: RouteAccessPolicy; hydrated?: boolean; onRender?: () => void }) {
  return <><LocationProbe /><Routes>
    <Route path="/login" element={<div>LOGIN_PAGE</div>} />
    <Route path="/forbidden" element={<ForbiddenPage />} />
    <Route path="/dashboard" element={<div>DASHBOARD_PAGE</div>} />
    <Route path="/private" element={<RouteAccessGuard policy={policy} hydrated={hydrated}><Secret onRender={onRender} /></RouteAccessGuard>} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></>;
}

describe('RouteAccessGuard', () => {
  const policy = { type: 'permissions', mode: 'any', permissions: ['activity:view'] } as const;

  it('shows a hydration state and never mounts protected content early', () => {
    const onRender = vi.fn();
    renderWithProviders(<GuardedRoutes policy={policy} hydrated={false} onRender={onRender} />, { route: '/private', user: testUser({ permissions: ['activity:view'] }) });
    expect(screen.getByRole('status', { name: 'در حال بررسی دسترسی' })).toBeVisible();
    expect(onRender).not.toHaveBeenCalled();
  });

  it('redirects unauthenticated users to login', () => {
    renderWithProviders(<GuardedRoutes policy={policy} />, { route: '/private' });
    expect(screen.getByText('LOGIN_PAGE')).toBeVisible();
  });

  it('renders an authorized route after permission approval', () => {
    renderWithProviders(<GuardedRoutes policy={policy} />, { route: '/private', user: testUser({ permissions: ['activity:view'] }) });
    expect(screen.getByText('PROTECTED_CONTENT')).toBeVisible();
  });

  it('renders standard 403 without mounting content or logging out', () => {
    const user = testUser({ role: 'VIEWER', permissions: [] });
    const onRender = vi.fn();
    renderWithProviders(<GuardedRoutes policy={policy} onRender={onRender} />, { route: '/private', user });
    expect(screen.getByRole('heading', { name: 'دسترسی غیرمجاز' })).toBeVisible();
    expect(screen.queryByText('activity:view')).not.toBeInTheDocument();
    expect(onRender).not.toHaveBeenCalled();
    expect(useAuthStore.getState().user).toEqual(user);
    expect(screen.getByLabelText('current-path')).toHaveTextContent('/private');
  });

  it('fails closed for invalid policy and keeps 404 distinct from 403', () => {
    const malformed = { type: 'permissions', mode: 'any', permissions: [] } as unknown as RouteAccessPolicy;
    const { unmount } = renderWithProviders(<GuardedRoutes policy={malformed} />, { route: '/private', user: testUser() });
    expect(screen.getByRole('heading', { name: 'دسترسی غیرمجاز' })).toBeVisible();
    expect(screen.getByLabelText('current-path')).toHaveTextContent('/private');
    unmount();
    renderWithProviders(<GuardedRoutes policy={policy} />, { route: '/missing', user: testUser() });
    expect(screen.getByRole('heading', { name: 'صفحه پیدا نشد' })).toBeVisible();
  });
});
