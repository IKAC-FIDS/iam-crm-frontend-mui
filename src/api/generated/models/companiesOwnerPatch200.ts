/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompaniesOwnerPatch200Data } from './companiesOwnerPatch200Data';
import type { SuccessEnvelope } from './successEnvelope';

export type CompaniesOwnerPatch200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: CompaniesOwnerPatch200Data;
};
