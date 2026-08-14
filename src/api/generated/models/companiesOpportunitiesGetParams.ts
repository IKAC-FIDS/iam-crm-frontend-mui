/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompaniesOpportunitiesGetOwnershipScope } from './companiesOpportunitiesGetOwnershipScope';

export type CompaniesOpportunitiesGetParams = {
/**
 * @minimum 1
 */
page?: number;
/**
 * @minimum 1
 * @maximum 100
 */
limit?: number;
ownershipScope?: CompaniesOpportunitiesGetOwnershipScope;
search?: string;
companyId?: string;
ownerId?: string;
teamId?: string;
team?: string;
stage?: string;
stageId?: string;
source?: string;
sourceOptionId?: string;
opportunitySource?: string;
primaryContactId?: string;
expectedCloseFrom?: string;
expectedCloseTo?: string;
includeArchived?: string;
archivedOnly?: string;
activeOnly?: string;
};
