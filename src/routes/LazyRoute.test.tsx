import { lazy, Suspense } from 'react';
import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { testUser } from '@/test/fixtures';
import RouteLoadingFallback from './RouteLoadingFallback';
import { RouteAccessGuard } from './RouteAccessGuard';

describe('lazy protected routes', () => {
  it('shows the shared fallback and renders after authorization and loading', async () => {
    let release: (() => void) | undefined;
    const loaded = new Promise<void>((resolve) => { release = resolve; });
    const renderPage = vi.fn();
    const LazyPage = lazy(async () => {
      await loaded;
      return { default: () => { renderPage(); return <div>LAZY_PAGE</div>; } };
    });

    renderWithProviders(
      <RouteAccessGuard policy={{ type: 'permissions', mode: 'any', permissions: ['activity:view'] }} hydrated>
        <Suspense fallback={<RouteLoadingFallback />}><LazyPage /></Suspense>
      </RouteAccessGuard>,
      { user: testUser({ permissions: ['activity:view'] }) },
    );
    expect(screen.getByRole('status', { name: 'در حال بارگذاری صفحه' })).toBeVisible();
    release?.();
    expect(await screen.findByText('LAZY_PAGE')).toBeVisible();
    expect(renderPage).toHaveBeenCalledOnce();
  });

  it('does not invoke a protected lazy loader for a forbidden user', () => {
    const loader = vi.fn(async () => ({ default: () => <div>SHOULD_NOT_RENDER</div> }));
    const LazyPage = lazy(loader);
    renderWithProviders(
      <Routes>
        <Route path="/private" element={
          <RouteAccessGuard policy={{ type: 'permissions', mode: 'any', permissions: ['activity:view'] }} hydrated>
            <Suspense fallback={<RouteLoadingFallback />}><LazyPage /></Suspense>
          </RouteAccessGuard>
        } />
        <Route path="/forbidden" element={<div>FORBIDDEN_PAGE</div>} />
      </Routes>,
      { user: testUser({ role: 'VIEWER', permissions: [] }), route: '/private' },
    );
    expect(loader).not.toHaveBeenCalled();
    expect(screen.queryByText('SHOULD_NOT_RENDER')).not.toBeInTheDocument();
  });
});
