import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { testUser, tenantA } from '@/test/fixtures';
import { server } from '@/test/msw/server';
import { renderWithProviders } from '@/test/render';
import CurrentQuotaPage from './CurrentQuotaPage';

const url = 'http://localhost:3000/api/quota/current';

describe('CurrentQuotaPage terminology and numeric safety', () => {
  it('renders legacy compatibility as unlimited and preserves a large decimal integer', async () => {
    const current = '900719925474099312345';
    server.use(http.get(url, () => HttpResponse.json({
      data: {
        organizationId: tenantA.id,
        generatedAt: '2026-08-14T08:30:00.000Z',
        metrics: [{
          metric: 'STORAGE_BYTES',
          current,
          softLimit: null,
          hardLimit: null,
          resetPeriod: 'NONE',
          resetAt: null,
          threshold: null,
          state: 'LEGACY_COMPATIBILITY',
        }],
      },
    })));

    renderWithProviders(<CurrentQuotaPage />, { user: testUser() });

    expect(await screen.findByText('فضای ذخیره‌سازی (بایت)')).toBeVisible();
    expect(screen.getByText(new Intl.NumberFormat('fa-IR').format(BigInt(current)))).toBeVisible();
    expect(screen.getAllByText('بدون محدودیت')).toHaveLength(2);
    expect(screen.queryByText('سازگاری قدیمی')).not.toBeInTheDocument();
  });
});
