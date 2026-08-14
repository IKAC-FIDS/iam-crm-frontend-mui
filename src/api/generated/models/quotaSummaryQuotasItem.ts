/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { DecimalIntegerString } from './decimalIntegerString';
import type { QuotaMetric } from './quotaMetric';
import type { QuotaSummaryQuotasItemState } from './quotaSummaryQuotasItemState';

export type QuotaSummaryQuotasItem = {
  current?: DecimalIntegerString;
  /**
     * Nullable decimal BigInt string.
     * @nullable
     * @pattern ^-?[0-9]+$
     */
  hardLimit?: string | null;
  metric?: QuotaMetric;
  /**
     * Nullable decimal BigInt string.
     * @nullable
     * @pattern ^-?[0-9]+$
     */
  softLimit?: string | null;
  state?: QuotaSummaryQuotasItemState;
};
