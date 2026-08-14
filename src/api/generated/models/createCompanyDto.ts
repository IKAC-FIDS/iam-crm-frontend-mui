/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CreateCompanyDtoActivityStatus } from './createCompanyDtoActivityStatus';
import type { CreateCompanyDtoOwnership } from './createCompanyDtoOwnership';
import type { CreateCompanyDtoPriority } from './createCompanyDtoPriority';

export interface CreateCompanyDto {
  activityStatus?: CreateCompanyDtoActivityStatus;
  brandName?: string;
  /**
     * @nullable
     * @pattern COMPANY_PHONE_PATTERN
     */
  centralPhone?: string | null;
  /** @maxLength 50 */
  economicCode?: string;
  /** @minimum 0 */
  employeeCount?: number;
  establishmentDate?: string;
  headOfficeCity?: string;
  /**
     * Deprecated compatibility input.
     * Prefer industryId.
     * If sent, it must match an existing Industry.name.
     */
  industry?: string;
  industryId?: string;
  legalName: string;
  /** @maxLength 50 */
  nationalId?: string;
  ownerId?: string;
  ownership?: CreateCompanyDtoOwnership;
  parentCompanyIds?: string[];
  priority?: CreateCompanyDtoPriority;
  /**
     * @maxLength 27
     * @pattern /^\d+(\.\d{1,2})?$/
     */
  registeredCapital?: string;
  /** @maxLength 50 */
  registrationNumber?: string;
  /**
     * Deprecated compatibility input.
     * Prefer sourceId.
     * If sent, it must match an existing LeadSource.code or LeadSource.name.
     */
  source?: string;
  sourceId?: string;
  subsidiaryCompanyIds?: string[];
  website?: string;
}
