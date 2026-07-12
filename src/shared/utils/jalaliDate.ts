import { isValidJalaaliDate, toGregorian, toJalaali } from 'jalaali-js';

export const EMPTY_DATE_LABEL = '—';

const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
const arabicDigits = '٠١٢٣٤٥٦٧٨٩';

export function normalizeDateDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (char) => {
    const persianIndex = persianDigits.indexOf(char);
    if (persianIndex >= 0) return String(persianIndex);
    const arabicIndex = arabicDigits.indexOf(char);
    return arabicIndex >= 0 ? String(arabicIndex) : char;
  });
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function toDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatJalaliDate(value?: string | null): string {
  const date = toDate(value);
  if (!date) return EMPTY_DATE_LABEL;
  const { jy, jm, jd } = toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${jy}/${pad(jm)}/${pad(jd)}`;
}

export function formatJalaliDateTime(value?: string | null): string {
  const date = toDate(value);
  if (!date) return EMPTY_DATE_LABEL;
  return `${formatJalaliDate(value)} - ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toJalaliInputValue(value?: string | null, includeTime = false): string {
  const date = toDate(value);
  if (!date) return '';
  const jalaliDate = formatJalaliDate(value);
  if (!includeTime) return jalaliDate;
  return `${jalaliDate} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseJalaliInputToIso(value: string, includeTime = false): string | undefined {
  const normalized = normalizeDateDigits(value).trim();
  if (!normalized) return undefined;

  const match = normalized.match(
    /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})(?:\s+(\d{1,2})(?::(\d{1,2}))?)?$/,
  );
  if (!match) return undefined;

  const jy = Number(match[1]);
  const jm = Number(match[2]);
  const jd = Number(match[3]);
  const hour = includeTime ? Number(match[4] ?? 0) : 0;
  const minute = includeTime ? Number(match[5] ?? 0) : 0;

  if (!isValidJalaaliDate(jy, jm, jd) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return undefined;
  }

  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  return new Date(gy, gm - 1, gd, hour, minute, 0, 0).toISOString();
}

export function toEndOfDayIso(value?: string): string | undefined {
  const date = toDate(value);
  if (!date) return undefined;
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
}

export function isoToLocalDateTimeInput(value?: string | null): string {
  const date = toDate(value);
  if (!date) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function isoToLocalDateInput(value?: string | null): string {
  const date = toDate(value);
  if (!date) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
