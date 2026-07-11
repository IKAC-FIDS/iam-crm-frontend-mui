export function toNumberSafe(value?: number | string | null): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value !== 'string') return 0;
  const normalized = value.trim().replace(/,/g, '');
  if (!normalized) return 0;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoney(value?: number | string | null, currency?: string | null): string {
  const amount = toNumberSafe(value);
  const formatted = new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: 2,
  }).format(amount);

  if (!currency) return formatted;
  return currency === 'IRR' ? `${formatted} ریال` : `${formatted} ${currency}`;
}

export function calculateLineTotalPreview(
  quantity?: number | string | null,
  unitPrice?: number | string | null,
  discountAmount?: number | string | null,
  taxAmount?: number | string | null,
): number {
  return Math.max(
    0,
    toNumberSafe(quantity) * toNumberSafe(unitPrice) - toNumberSafe(discountAmount) + toNumberSafe(taxAmount),
  );
}
