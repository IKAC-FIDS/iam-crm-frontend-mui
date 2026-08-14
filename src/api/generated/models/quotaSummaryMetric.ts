/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { DecimalIntegerString } from './decimalIntegerString';
import type { QuotaConfigurationState } from './quotaConfigurationState';
import type { QuotaMetric } from './quotaMetric';
import type { QuotaResetPeriod } from './quotaResetPeriod';
import type { QuotaSummaryMetricThreshold } from './quotaSummaryMetricThreshold';

export interface QuotaSummaryMetric {
  current: DecimalIntegerString;
  /**
     * @nullable
     * @pattern ^[0-9]+$
     */
  hardLimit: string | null;
  metric: QuotaMetric;
  /** @nullable */
  resetAt: string | null;
  resetPeriod: QuotaResetPeriod;
  /**
     * @nullable
     * @pattern ^[0-9]+$
     */
  softLimit: string | null;
  state: QuotaConfigurationState;
  /** @nullable */
  threshold: QuotaSummaryMetricThreshold;
}
