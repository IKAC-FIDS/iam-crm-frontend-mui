/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { UpdateCompanyLegalDocumentDtoType } from './updateCompanyLegalDocumentDtoType';

export interface UpdateCompanyLegalDocumentDto {
  /** @maxLength 2000 */
  description?: string;
  documentDate?: string;
  /** @maxLength 200 */
  title?: string;
  type?: UpdateCompanyLegalDocumentDtoType;
}
