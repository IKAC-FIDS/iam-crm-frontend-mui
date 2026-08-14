/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompaniesBulkOwnerPatch200Data } from './companiesBulkOwnerPatch200Data';
import type { SuccessEnvelope } from './successEnvelope';

export type CompaniesBulkOwnerPatch200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: CompaniesBulkOwnerPatch200Data;
};
