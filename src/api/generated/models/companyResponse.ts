/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompanyResponseActivityStatus } from './companyResponseActivityStatus';
import type { CompanyResponseOwnership } from './companyResponseOwnership';
import type { CompanyResponsePriority } from './companyResponsePriority';
import type { CompanyResponseResearchCompletion } from './companyResponseResearchCompletion';
import type { CompanyResponseStage } from './companyResponseStage';
import type { CompanyScalar } from './companyScalar';
import type { IndustrySummary } from './industrySummary';
import type { LeadSourceSummary } from './leadSourceSummary';
import type { RelatedEntity } from './relatedEntity';
import type { UserSummary } from './userSummary';

export interface CompanyResponse {
  activities?: RelatedEntity[];
  /** @nullable */
  activityGroup: string | null;
  activityStatus: CompanyResponseActivityStatus;
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
  branches?: RelatedEntity[];
  /** @nullable */
  brandName: string | null;
  /** @nullable */
  callCard?: RelatedEntity | null;
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
  legalDocuments?: RelatedEntity[];
  legalName: string;
  /** @nullable */
  marketSize: string | null;
  /** @nullable */
  nationalId: string | null;
  /** @nullable */
  nextActionDate: string | null;
  opportunities?: RelatedEntity[];
  organizationId: string;
  /** @nullable */
  owner: UserSummary | null;
  /** @nullable */
  ownerId: string | null;
  /** @nullable */
  ownership: CompanyResponseOwnership;
  parentCompanies: CompanyScalar[];
  /** @nullable */
  parentCompanyId: string | null;
  parentRelations?: RelatedEntity[];
  people?: RelatedEntity[];
  /** @nullable */
  postalCode: string | null;
  priority: CompanyResponsePriority;
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
  researchCompletion: CompanyResponseResearchCompletion;
  socialChannels?: RelatedEntity[];
  /** @nullable */
  source: string | null;
  /** @nullable */
  sourceId: string | null;
  /** @nullable */
  sourceRef: LeadSourceSummary | null;
  stage: CompanyResponseStage;
  stageHistory?: RelatedEntity[];
  subsidiaryCompanies: CompanyScalar[];
  subsidiaryRelations?: RelatedEntity[];
  updatedAt: string;
  /** @nullable */
  website: string | null;
}
