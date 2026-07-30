import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { useAuthStore } from '@/store/authStore';
import { renderWithProviders } from '@/test/render';
import { server } from '@/test/msw/server';
import LoginPage from './LoginPage';

const loginUrl = 'http://localhost:3000/api/auth/login';

describe('LoginPage', () => {
  it('renders accessible login controls and submits the inspected login DTO', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: '/login' });

    await user.type(screen.getByLabelText('ایمیل'), 'user@example.test');
    await user.type(screen.getByLabelText('رمز عبور'), 'password123');
    await user.click(screen.getByRole('button', { name: 'ورود' }));

    await waitFor(() => expect(localStorage.getItem('accessToken')).toBe('synthetic-access-token'));
    expect(useAuthStore.getState().user?.organizationId).toBeTruthy();
  });

  it('blocks invalid input and shows validation messages', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: '/login' });
    await user.type(screen.getByLabelText('ایمیل'), 'invalid');
    await user.type(screen.getByLabelText('رمز عبور'), '123');
    await user.click(screen.getByRole('button', { name: 'ورود' }));
    expect(await screen.findByText('ایمیل نامعتبر است')).toBeVisible();
    expect(screen.getByText('رمز عبور حداقل ۶ کاراکتر باشد')).toBeVisible();
  });

  it('renders the safe API authentication error', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: '/login' });
    await user.type(screen.getByLabelText('ایمیل'), 'wrong@example.test');
    await user.type(screen.getByLabelText('رمز عبور'), 'password123');
    await user.click(screen.getByRole('button', { name: 'ورود' }));
    expect(await screen.findByText('ایمیل یا رمز عبور نادرست است.')).toBeVisible();
  });

  it('prevents duplicate submission while login is pending', async () => {
    server.use(http.post(loginUrl, async () => {
      await delay(100);
      return HttpResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'نامعتبر' } }, { status: 401 });
    }));
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: '/login' });
    await user.type(screen.getByLabelText('ایمیل'), 'user@example.test');
    await user.type(screen.getByLabelText('رمز عبور'), 'password123');
    const submit = screen.getByRole('button', { name: 'ورود' });
    await user.click(submit);
    expect(screen.getByRole('button', { name: 'در حال ورود...' })).toBeDisabled();
  });
});
