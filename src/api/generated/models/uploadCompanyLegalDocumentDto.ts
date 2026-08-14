/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { UploadCompanyLegalDocumentDtoType } from './uploadCompanyLegalDocumentDtoType';

export interface UploadCompanyLegalDocumentDto {
  /** @maxLength 2000 */
  description?: string;
  documentDate?: string;
  /** @maxLength 200 */
  title: string;
  type: UploadCompanyLegalDocumentDtoType;
}
