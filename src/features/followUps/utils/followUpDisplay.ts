import type { FollowUpDueStatus } from '../types/followUp.types';

export const FOLLOW_UP_STATUS_PRESENTATION: Record<
  FollowUpDueStatus,
  { label: string; color: 'error' | 'warning' | 'info' | 'default' }
> = {
  overdue: { label: 'عقب‌افتاده', color: 'error' },
  today: { label: 'امروز', color: 'warning' },
  upcoming: { label: 'در انتظار', color: 'info' },
  unknown: { label: 'نامشخص', color: 'default' },
};

export function getFollowUpDueStatus(value?: string | null): FollowUpDueStatus {
  if (!value) return 'unknown';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'unknown';
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  if (date.getTime() < startToday) return 'overdue';
  if (date.getTime() < startTomorrow) return 'today';
  return 'upcoming';
}
