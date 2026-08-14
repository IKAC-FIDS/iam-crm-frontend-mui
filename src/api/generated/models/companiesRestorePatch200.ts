/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompaniesRestorePatch200Data } from './companiesRestorePatch200Data';
import type { SuccessEnvelope } from './successEnvelope';

export type CompaniesRestorePatch200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: CompaniesRestorePatch200Data;
};
