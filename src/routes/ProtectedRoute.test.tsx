import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { testUser } from '@/test/fixtures';
import { ProtectedRoute } from './ProtectedRoute';

function RoutesUnderTest() {
  return <Routes>
    <Route path="/login" element={<div>LOGIN_PAGE</div>} />
    <Route element={<ProtectedRoute />}>
      <Route path="/private" element={<div>PRIVATE_PAGE</div>} />
    </Route>
  </Routes>;
}

describe('ProtectedRoute', () => {
  it('redirects an unauthenticated session to login', () => {
    renderWithProviders(<RoutesUnderTest />, { route: '/private' });
    expect(screen.getByText('LOGIN_PAGE')).toBeVisible();
  });

  it('allows an authenticated session', () => {
    renderWithProviders(<RoutesUnderTest />, { route: '/private', user: testUser() });
    expect(screen.getByText('PRIVATE_PAGE')).toBeVisible();
  });

  it('does not trust a token without an authenticated user', () => {
    localStorage.setItem('accessToken', 'client-controlled-token');
    renderWithProviders(<RoutesUnderTest />, { route: '/private' });
    expect(screen.getByText('LOGIN_PAGE')).toBeVisible();
  });
});
