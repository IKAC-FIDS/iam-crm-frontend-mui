/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { QuotaSummary } from './quotaSummary';
import type { SuccessEnvelope } from './successEnvelope';

export type QuotaCurrentGet200 = SuccessEnvelope & {
  data: QuotaSummary;
};
