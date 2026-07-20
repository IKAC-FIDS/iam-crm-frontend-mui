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

export function formatIrrPrice(value?: number | string | null): string {
  const raw = typeof value === 'string' ? value.trim().replace(/,/g, '') : String(value ?? '0');
  const integer = raw.split('.')[0] || '0';
  try {
    return `${new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 0 }).format(BigInt(integer))} ریال`;
  } catch {
    return '۰ ریال';
  }
}

export function calculateUsdPricePreview(input: string, rate: string, profitPercent: string): string | null {
  const parseScaled = (value: string, scale: number) => {
    const normalized = value.trim().replace(/,/g, '');
    if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
    const [whole, fraction = ''] = normalized.split('.');
    return BigInt(whole) * 10n ** BigInt(scale) + BigInt((fraction + '0'.repeat(scale)).slice(0, scale));
  };
  const inputScaled = parseScaled(input, 6), rateScaled = parseScaled(rate, 6), profitScaled = parseScaled(profitPercent, 3);
  if (inputScaled === null || rateScaled === null || profitScaled === null) return null;
  const numerator = inputScaled * rateScaled * (100000n + profitScaled);
  const divisor = 1000000n * 1000000n * 100000n;
  return ((numerator + divisor / 2n) / divisor).toString();
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
