import type { ChipProps } from '@mui/material';
import type { SalesChannel } from '../types/opportunityLineItem.types';

const labels: Record<SalesChannel, string> = {
  LEGACY_UNKNOWN: 'نامشخص — داده قدیمی',
  IN_PERSON: 'مشتریان حضوری',
  DIGIKALA: 'دیجی‌کالا',
  OTHER: 'سایر / قیمت توافقی',
};
const colors: Record<SalesChannel, ChipProps['color']> = { LEGACY_UNKNOWN: 'warning', IN_PERSON: 'primary', DIGIKALA: 'info', OTHER: 'default' };
export const selectableSalesChannels: Array<{ value: Exclude<SalesChannel, 'LEGACY_UNKNOWN'>; label: string }> = (['IN_PERSON', 'DIGIKALA', 'OTHER'] as const).map((value) => ({ value, label: labels[value] }));
export function salesChannelLabel(value?: SalesChannel | string | null) { return value && value in labels ? labels[value as SalesChannel] : 'نامشخص'; }
export function salesChannelChipColor(value?: SalesChannel | null): ChipProps['color'] { return value ? colors[value] : 'default'; }
