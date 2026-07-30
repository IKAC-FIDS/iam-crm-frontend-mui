import { expect, test, type Page } from '@playwright/test';

const api = 'http://127.0.0.1:43110/api';
let consoleErrors: string[] = [];
let expectedHttpError = false;

async function routePublicProviders(page: Page) {
  await page.route(`${api}/auth/sso/providers`, (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true, data: [], requestId: 'e2e-sso-request' }),
  }));
}

test.beforeEach(async ({ page }) => {
  consoleErrors = [];
  expectedHttpError = false;
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await routePublicProviders(page);
});

test.afterEach(() => {
  const unexpectedErrors = expectedHttpError
    ? consoleErrors.filter((message) => !message.includes('status of 403 (Forbidden)'))
    : consoleErrors;
  expect(unexpectedErrors, 'severe browser console errors').toEqual([]);
});

test('login renders locally with Persian RTL and keyboard-accessible controls', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { name: 'ورود' })).toBeVisible();
  await page.getByLabel('ایمیل').focus();
  await expect(page.getByLabel('ایمیل')).toBeFocused();
  await expect(page.getByRole('button', { name: 'ورود', exact: true })).toBeVisible();
});

test('unauthenticated protected navigation redirects locally to login', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'ورود' })).toBeVisible();
});

test('authenticated synthetic session renders the permitted dashboard route', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'synthetic-e2e-token');
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user: {
      id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', fullName: 'کاربر آزمایشی', email: 'user@example.test',
      role: 'REP', team: null, permissions: ['activity:view'], organizationId: '11111111-1111-4111-8111-111111111111',
    } }, version: 0 }));
  });
  await page.route(`${api}/dashboard/latest-activities`, (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true, data: [], requestId: 'e2e-activities-request' }),
  }));
  await page.goto('/dashboard');
  await expect(page.getByText('آخرین فعالیت‌ها', { exact: true })).toBeVisible();
  await expect(page.getByText('هیچ فعالیتی ثبت نشده است.')).toBeVisible();
});

test('standard 403 and feature-disabled envelopes remain safe login errors', async ({ page }) => {
  expectedHttpError = true;
  await page.route(`${api}/auth/login`, (route) => route.fulfill({
    status: 403,
    contentType: 'application/json',
    body: JSON.stringify({ success: false, error: { code: 'FEATURE_DISABLED', message: 'این قابلیت برای سازمان فعال نیست.' }, requestId: 'e2e-feature-disabled' }),
  }));
  await page.goto('/login');
  await page.getByLabel('ایمیل').fill('user@example.test');
  await page.getByRole('textbox', { name: 'رمز عبور' }).fill('password123');
  await page.getByRole('button', { name: 'ورود', exact: true }).click();
  await expect(page.getByRole('paragraph').filter({ hasText: 'این قابلیت برای سازمان فعال نیست.' })).toBeVisible();
  await expect(page.getByText(/stack|token|database/i)).toHaveCount(0);
});
