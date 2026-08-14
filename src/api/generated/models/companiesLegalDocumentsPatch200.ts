/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompaniesLegalDocumentsPatch200Data } from './companiesLegalDocumentsPatch200Data';
import type { SuccessEnvelope } from './successEnvelope';

export type CompaniesLegalDocumentsPatch200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: CompaniesLegalDocumentsPatch200Data;
};
