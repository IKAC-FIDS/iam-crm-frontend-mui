import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { testUser } from '@/test/fixtures';
import ActivitiesPage from './ActivitiesPage';

describe('ActivitiesPage permission state', () => {
  it('renders the existing forbidden state instead of redirecting an authenticated user', () => {
    renderWithProviders(<ActivitiesPage />, { route: '/activities', user: testUser({ role: 'VIEWER', permissions: [] }) });
    expect(screen.getByText('شما مجوز مشاهده فعالیت‌ها را ندارید.')).toBeVisible();
    expect(screen.queryByText('LOGIN_PAGE')).not.toBeInTheDocument();
  });
});
