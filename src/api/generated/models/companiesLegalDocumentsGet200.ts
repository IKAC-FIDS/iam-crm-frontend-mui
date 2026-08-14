/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompaniesLegalDocumentsGet200Data } from './companiesLegalDocumentsGet200Data';
import type { SuccessEnvelope } from './successEnvelope';

export type CompaniesLegalDocumentsGet200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: CompaniesLegalDocumentsGet200Data;
};
