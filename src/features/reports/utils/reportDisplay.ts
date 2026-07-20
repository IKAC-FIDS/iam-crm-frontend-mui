import axios from 'axios';
import type { ReportPeriod } from '../types/report.types';

export function reportDateBasisText(period: ReportPeriod | undefined, fallback: string): string {
  const labels: Record<string, string> = { OPPORTUNITY_CREATED_AT: 'بر اساس تاریخ ایجاد فرصت', STAGE_TRANSITION_CHANGED_AT: 'بر اساس تاریخ تغییر مرحله', ACTIVITY_OCCURRED_AT: 'بر اساس تاریخ انجام فعالیت' };
  return period?.dateBasis ? (labels[period.dateBasis] ?? fallback) : fallback;
}

export function toSafeNumber(value?: number | string | null): number | null {
  if (value === null || value === undefined || value === '') return null;
  const result = Number(String(value).replace('%', ''));
  return Number.isFinite(result) ? result : null;
}

export function formatCount(value?: number | string | null): string {
  const number = toSafeNumber(value);
  return number === null ? '—' : number.toLocaleString('fa-IR');
}

export function formatPercent(value?: number | string | null): string {
  const number = toSafeNumber(value);
  return number === null ? '—' : `${number.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪`;
}

export function formatDurationDays(value?: number | string | null): string {
  const number = toSafeNumber(value);
  return number === null ? '—' : `${number.toLocaleString('fa-IR', { maximumFractionDigits: 1 })} روز`;
}

export function isForbiddenError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 403;
}

export function defaultActivityDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const format = (date: Date) => date.toISOString().slice(0, 10);
  return { startDate: format(start), endDate: format(end) };
}
