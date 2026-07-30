import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatRelativeJalaliDateTime } from './jalaliDate';

describe('deterministic relative Jalali timestamps', () => {
  afterEach(() => vi.useRealTimers());

  it('uses today and yesterday in the configured timezone', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-30T12:00:00.000Z'));
    const options = { organizationTimeZone: 'Asia/Tehran' };
    expect(formatRelativeJalaliDateTime('2026-07-30T08:30:00.000Z', options)).toContain('امروز');
    expect(formatRelativeJalaliDateTime('2026-07-29T08:30:00.000Z', options)).toContain('دیروز');
  });

  it('uses a Persian Jalali month for older dates and omits invalid dates', () => {
    const now = new Date('2026-07-30T12:00:00.000Z');
    expect(formatRelativeJalaliDateTime('2026-03-21T08:30:00.000Z', { organizationTimeZone: 'Asia/Tehran' }, now)).toContain('فروردین');
    expect(formatRelativeJalaliDateTime('not-a-date')).toBeUndefined();
    expect(formatRelativeJalaliDateTime(null)).toBeUndefined();
  });
});
