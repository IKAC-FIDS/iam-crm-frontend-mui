import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { testUser } from '@/test/fixtures';
import MainGrid from './MainGrid';

describe('dashboard baseline', () => {
  it('renders the permitted dashboard widget from its isolated API query', async () => {
    renderWithProviders(<MainGrid />, { route: '/dashboard', user: testUser({ permissions: ['activity:view'] }) });
    expect(await screen.findByText('آخرین فعالیت‌ها')).toBeVisible();
    expect(await screen.findByText('تماس تلفنی')).toBeVisible();
  });

  it('does not render the widget without activity:view', () => {
    renderWithProviders(<MainGrid />, { route: '/dashboard', user: testUser({ role: 'VIEWER', permissions: [] }) });
    expect(screen.queryByText('آخرین فعالیت‌ها')).not.toBeInTheDocument();
  });
});
