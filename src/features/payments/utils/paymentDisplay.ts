import type { PaymentMethod, PaymentStatus } from '../types/payment.types';

export const paymentStatusOptions: { value: PaymentStatus; label: string }[] = [
  { value: 'PENDING', label: 'در انتظار' },
  { value: 'PARTIAL', label: 'پرداخت جزئی' },
  { value: 'PAID', label: 'پرداخت‌شده' },
  { value: 'OVERDUE', label: 'سررسید گذشته' },
  { value: 'CANCELLED', label: 'لغوشده' },
  { value: 'REFUNDED', label: 'بازپرداخت‌شده' },
];

export const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: 'BANK_TRANSFER', label: 'حواله بانکی' },
  { value: 'CASH', label: 'نقدی' },
  { value: 'CHECK', label: 'چک' },
  { value: 'CARD', label: 'کارت' },
  { value: 'OTHER', label: 'سایر' },
];

export function getPaymentStatusLabel(value?: PaymentStatus | string | null): string {
  return paymentStatusOptions.find((item) => item.value === value)?.label ?? '—';
}

export function getPaymentMethodLabel(value?: PaymentMethod | string | null): string {
  return paymentMethodOptions.find((item) => item.value === value)?.label ?? '—';
}
