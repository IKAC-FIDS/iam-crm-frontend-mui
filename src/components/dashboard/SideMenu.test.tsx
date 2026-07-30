import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { testUser } from '@/test/fixtures';
import SideMenu from './SideMenu';

describe('SideMenu permission visibility', () => {
  it('shows permission-backed navigation to an allowed user', () => {
    renderWithProviders(<SideMenu mobileOpen onClose={() => undefined} />, { user: testUser({ permissions: ['activity:view'] }) });
    expect(screen.getAllByText('فعالیت‌ها').length).toBeGreaterThan(0);
  });

  it('hides permission-backed navigation from a disallowed user', () => {
    renderWithProviders(<SideMenu mobileOpen onClose={() => undefined} />, { user: testUser({ role: 'VIEWER', permissions: [] }) });
    expect(screen.queryByText('فعالیت‌ها')).not.toBeInTheDocument();
  });
});
