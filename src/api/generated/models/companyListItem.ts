/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompanyListItemActivityStatus } from './companyListItemActivityStatus';
import type { CompanyListItemOwnership } from './companyListItemOwnership';
import type { CompanyListItemPriority } from './companyListItemPriority';
import type { CompanyListItemResearchCompletion } from './companyListItemResearchCompletion';
import type { CompanyListItemStage } from './companyListItemStage';
import type { IndustrySummary } from './industrySummary';
import type { LeadSourceSummary } from './leadSourceSummary';
import type { UserSummary } from './userSummary';

export interface CompanyListItem {
  /** @nullable */
  activityGroup: string | null;
  activityStatus: CompanyListItemActivityStatus;
  /**
     * BigInt serialized as a decimal string.
     * @nullable
     * @pattern ^[0-9]+$
     */
  annualRevenue: string | null;
  /** @nullable */
  archivedAt: string | null;
  /** @nullable */
  archivedById: string | null;
  /** @nullable */
  archiveReason: string | null;
  /** @nullable */
  brandName: string | null;
  /** @nullable */
  centralPhone: string | null;
  /** @nullable */
  companyType: string | null;
  createdAt: string;
  /** @nullable */
  economicCode: string | null;
  /** @nullable */
  employeeCount: number | null;
  /** @nullable */
  establishmentDate: string | null;
  /** @nullable */
  foundedYear: number | null;
  /** @nullable */
  headOfficeAddress: string | null;
  /** @nullable */
  headOfficeCity: string | null;
  /** @nullable */
  headOfficeProvince: string | null;
  id: string;
  /** @nullable */
  industry: string | null;
  /** @nullable */
  industryId: string | null;
  /** @nullable */
  industryRef: IndustrySummary | null;
  leadCode: string;
  legalName: string;
  /** @nullable */
  marketSize: string | null;
  /** @nullable */
  nationalId: string | null;
  /** @nullable */
  nextActionDate: string | null;
  organizationId: string;
  /** @nullable */
  owner: UserSummary | null;
  /** @nullable */
  ownerId: string | null;
  /** @nullable */
  ownership: CompanyListItemOwnership;
  /** @nullable */
  parentCompanyId: string | null;
  /** @nullable */
  postalCode: string | null;
  priority: CompanyListItemPriority;
  /** @nullable */
  publicEmail: string | null;
  /**
     * Prisma Decimal serialized as a decimal string.
     * @nullable
     */
  registeredCapital: string | null;
  /** @nullable */
  registrationNo: string | null;
  /** @nullable */
  registrationNumber: string | null;
  /** @nullable */
  researchCompletion: CompanyListItemResearchCompletion;
  /** @nullable */
  source: string | null;
  /** @nullable */
  sourceId: string | null;
  /** @nullable */
  sourceRef: LeadSourceSummary | null;
  stage: CompanyListItemStage;
  updatedAt: string;
  /** @nullable */
  website: string | null;
}
