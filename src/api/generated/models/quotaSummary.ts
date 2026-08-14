/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { QuotaSummaryMetric } from './quotaSummaryMetric';

export interface QuotaSummary {
  generatedAt: string;
  metrics: QuotaSummaryMetric[];
  organizationId: string;
}
