const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
const allowedPhonePattern = /^\+?[0-9\s()-]+$/;

export function normalizeCompanyPhone(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)))
    .replace(/[\s()-]/g, '');
}

export function isValidCompanyPhone(value?: string | null): boolean {
  const raw = value?.trim() ?? '';
  if (!raw || !allowedPhonePattern.test(raw)) return false;
  const normalized = normalizeCompanyPhone(raw);
  return /^\+?\d{5,20}$/.test(normalized);
}

export function getCompanyPhoneHref(value?: string | null): string | undefined {
  return isValidCompanyPhone(value) ? `tel:${normalizeCompanyPhone(value!.trim())}` : undefined;
}
