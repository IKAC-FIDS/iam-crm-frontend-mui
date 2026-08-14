/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompaniesBranchesGet200Data } from './companiesBranchesGet200Data';
import type { SuccessEnvelope } from './successEnvelope';

export type CompaniesBranchesGet200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: CompaniesBranchesGet200Data;
};
