import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { testUser } from '@/test/fixtures';
import { useAuthStore } from '@/store/authStore';
import ForbiddenPage from './ForbiddenPage';

describe('ForbiddenPage', () => {
  it('is RTL, accessible, safe, and keeps the authenticated session', async () => {
    const user = testUser();
    renderWithProviders(<Routes>
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route path="/dashboard" element={<div>DASHBOARD_PAGE</div>} />
    </Routes>, { route: '/forbidden', user });
    expect(screen.getByRole('main')).toHaveAttribute('dir', 'rtl');
    expect(screen.getByRole('heading', { name: 'دسترسی غیرمجاز' })).toBeVisible();
    expect(screen.queryByText(/permission|role|token/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'بازگشت به داشبورد' }));
    expect(screen.getByText('DASHBOARD_PAGE')).toBeVisible();
    expect(useAuthStore.getState().user).toEqual(user);
  });
});
