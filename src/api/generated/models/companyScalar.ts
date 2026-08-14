/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompanyScalarActivityStatus } from './companyScalarActivityStatus';
import type { CompanyScalarOwnership } from './companyScalarOwnership';
import type { CompanyScalarPriority } from './companyScalarPriority';
import type { CompanyScalarResearchCompletion } from './companyScalarResearchCompletion';
import type { CompanyScalarStage } from './companyScalarStage';

export interface CompanyScalar {
  /** @nullable */
  activityGroup: string | null;
  activityStatus: CompanyScalarActivityStatus;
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
  ownerId: string | null;
  /** @nullable */
  ownership: CompanyScalarOwnership;
  /** @nullable */
  parentCompanyId: string | null;
  /** @nullable */
  postalCode: string | null;
  priority: CompanyScalarPriority;
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
  researchCompletion: CompanyScalarResearchCompletion;
  /** @nullable */
  source: string | null;
  /** @nullable */
  sourceId: string | null;
  stage: CompanyScalarStage;
  updatedAt: string;
  /** @nullable */
  website: string | null;
}
