import type { NumericValue } from '@/features/reports/types/report.types';
import type { BoardsMetric } from '../types/boardsDashboard.types';

export function toNumber(value: NumericValue | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function toBillions(value: NumericValue | null | undefined): number {
  return toNumber(value) / 1_000_000_000;
}

export function formatIrr(value: NumericValue | null | undefined): string {
  const numeric = toNumber(value);
  const absolute = Math.abs(numeric);

  if (absolute >= 1_000_000_000) {
    return `${(numeric / 1_000_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} میلیارد ریال`;
  }
  if (absolute >= 1_000_000) {
    return `${(numeric / 1_000_000).toLocaleString('fa-IR', { maximumFractionDigits: 1 })} میلیون ریال`;
  }

  return `${numeric.toLocaleString('fa-IR', { maximumFractionDigits: 0 })} ریال`;
}

export function formatPercent(value: NumericValue | null | undefined): string {
  return `${toNumber(value).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪`;
}

export function formatCount(value: NumericValue | null | undefined): string {
  return toNumber(value).toLocaleString('fa-IR', { maximumFractionDigits: 0 });
}

export function formatMetric(metric: BoardsMetric): string {
  if (metric.unit === 'IRR') return formatIrr(metric.value);
  if (metric.unit === 'PERCENT') return formatPercent(metric.value);
  return formatCount(metric.value);
}

export function formatChange(changePercent: number | null): string | null {
  if (changePercent === null || !Number.isFinite(changePercent)) return null;
  const sign = changePercent > 0 ? '+' : '';
  return `${sign}${changePercent.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪`;
}

export function formatPersianMonth(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate.slice(0, 7);

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    month: 'short',
    year: '2-digit',
  }).format(date);
}

export function formatPersianDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function sourceLabel(source: string): string {
  return source === 'UNKNOWN' ? 'نامشخص' : source;
}

export function industryLabel(industry: string): string {
  return industry === 'UNKNOWN' ? 'نامشخص' : industry;
}

export function salesChannelLabel(channel: string): string {
  const labels: Record<string, string> = {
    IN_PERSON: 'فروش مستقیم',
    DIGIKALA: 'دیجی‌کالا',
    OTHER: 'سایر',
    LEGACY_UNKNOWN: 'نامشخص',
  };

  return labels[channel] ?? channel;
}

export function agingLabel(key: string): string {
  const labels: Record<string, string> = {
    NOT_DUE: 'سررسید نشده',
    OVERDUE_1_30: '۱ تا ۳۰ روز',
    OVERDUE_31_60: '۳۱ تا ۶۰ روز',
    OVERDUE_61_90: '۶۱ تا ۹۰ روز',
    OVERDUE_90_PLUS: 'بیش از ۹۰ روز',
  };

  return labels[key] ?? key;
}
