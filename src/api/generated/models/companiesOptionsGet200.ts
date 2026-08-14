/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompaniesOptionsGet200Data } from './companiesOptionsGet200Data';
import type { SuccessEnvelope } from './successEnvelope';

export type CompaniesOptionsGet200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: CompaniesOptionsGet200Data;
};
