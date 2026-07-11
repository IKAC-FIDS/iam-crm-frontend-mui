import type { CommercialDocumentStatus, CommercialDocumentType } from '../types/commercialDocument.types';

export const commercialDocumentTypeOptions: { value: CommercialDocumentType; label: string }[] = [
  { value: 'PROPOSAL', label: 'پیشنهاد' },
  { value: 'PROFORMA', label: 'پیش‌فاکتور' },
  { value: 'CONTRACT', label: 'قرارداد' },
];

export const commercialDocumentStatusOptions: { value: CommercialDocumentStatus; label: string }[] = [
  { value: 'DRAFT', label: 'پیش‌نویس' },
  { value: 'SENT', label: 'ارسال‌شده' },
  { value: 'ACCEPTED', label: 'پذیرفته‌شده' },
  { value: 'REJECTED', label: 'ردشده' },
  { value: 'SIGNED', label: 'امضاشده' },
  { value: 'CANCELLED', label: 'لغوشده' },
  { value: 'EXPIRED', label: 'منقضی' },
];

export function getCommercialDocumentTypeLabel(value?: CommercialDocumentType | string | null): string {
  return commercialDocumentTypeOptions.find((item) => item.value === value)?.label ?? '—';
}

export function getCommercialDocumentStatusLabel(value?: CommercialDocumentStatus | string | null): string {
  return commercialDocumentStatusOptions.find((item) => item.value === value)?.label ?? '—';
}

export function safeExternalUrl(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}
