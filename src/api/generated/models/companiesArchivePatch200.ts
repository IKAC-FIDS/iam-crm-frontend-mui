/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompaniesArchivePatch200Data } from './companiesArchivePatch200Data';
import type { SuccessEnvelope } from './successEnvelope';

export type CompaniesArchivePatch200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: CompaniesArchivePatch200Data;
};
