/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompaniesBranchesPatch200Data } from './companiesBranchesPatch200Data';
import type { SuccessEnvelope } from './successEnvelope';

export type CompaniesBranchesPatch200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: CompaniesBranchesPatch200Data;
};
