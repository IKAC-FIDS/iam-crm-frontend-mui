/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompanyListItem } from './companyListItem';
import type { PaginationMeta } from './paginationMeta';
import type { SuccessEnvelope } from './successEnvelope';

export type CompaniesGet200 = SuccessEnvelope & {
  data: CompanyListItem[];
  meta: PaginationMeta;
};
