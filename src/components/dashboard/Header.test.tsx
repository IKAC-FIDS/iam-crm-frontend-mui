import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { testUser } from '@/test/fixtures';
import Header from './Header';

describe('registry breadcrumbs', () => {
  it('renders an accessible dynamic hierarchy and current item', () => {
    renderWithProviders(<Header />, { route: '/opportunities/example-id', user: testUser({ permissions: ['opportunity:view'] }) });
    expect(screen.getByRole('navigation', { name: 'مسیر صفحه' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'خانه' })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: 'فرصت‌ها' })).toHaveAttribute('href', '/opportunities');
    expect(screen.getByRole('navigation', { name: 'مسیر صفحه' }).querySelector('[aria-current="page"]')).toHaveTextContent('جزئیات فرصت');
  });
});
