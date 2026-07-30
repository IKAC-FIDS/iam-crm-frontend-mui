import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render';
import { latestActivity } from '@/test/fixtures';
import { server } from '@/test/msw/server';
import LatestActivitiesWidget from './LatestActivitiesWidget';

const url = 'http://localhost:3000/api/dashboard/latest-activities';

describe('LatestActivitiesWidget dashboard baseline', () => {
  it('shows loading skeletons without a full-page loader', () => {
    server.use(http.get(url, async () => { await delay('infinite'); return HttpResponse.json({}); }));
    const { container } = renderWithProviders(<LatestActivitiesWidget />);
    expect(container.querySelectorAll('.MuiSkeleton-root')).toHaveLength(20);
  });

  it('renders a successful dashboard response and localizes raw activity enums', async () => {
    renderWithProviders(<LatestActivitiesWidget />);
    expect(await screen.findByText('تماس تلفنی')).toBeVisible();
    expect(screen.queryByText('CALL')).not.toBeInTheDocument();
    expect(screen.getByText(/توسط کاربر آزمایشی/)).toBeVisible();
  });

  it('renders the compact empty state', async () => {
    server.use(http.get(url, () => HttpResponse.json({ success: true, data: [] })));
    renderWithProviders(<LatestActivitiesWidget />);
    expect(await screen.findByText('هیچ فعالیتی ثبت نشده است.')).toBeVisible();
  });

  it('renders an isolated API error and retries', async () => {
    let attempts = 0;
    server.use(http.get(url, () => {
      attempts += 1;
      return attempts === 1
        ? HttpResponse.json({ success: false, error: { code: 'SERVER_ERROR', message: 'خطا' } }, { status: 500 })
        : HttpResponse.json({ success: true, data: [latestActivity] });
    }));
    const user = userEvent.setup();
    renderWithProviders(<LatestActivitiesWidget />);
    await user.click(await screen.findByRole('button', { name: 'تلاش مجدد' }));
    expect(await screen.findByText('تماس تلفنی')).toBeVisible();
  });

  it('keeps the Activity Center footer route', async () => {
    renderWithProviders(<LatestActivitiesWidget />);
    const link = await screen.findByRole('link', { name: 'مشاهده همه فعالیت‌ها' });
    expect(link).toHaveAttribute('href', '/activities');
  });
});
