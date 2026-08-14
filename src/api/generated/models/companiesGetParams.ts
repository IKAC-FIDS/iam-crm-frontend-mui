/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CompaniesGetOwnershipScope } from './companiesGetOwnershipScope';

export type CompaniesGetParams = {
ownershipScope?: CompaniesGetOwnershipScope;
industryId?: string;
/**
 * Deprecated compatibility filter.
 * Prefer industryId.
 */
industry?: string;
sourceId?: string;
/**
 * Deprecated compatibility filter.
 * Prefer sourceId.
 */
source?: string;
withoutOwner?: string;
search?: string;
ownerId?: string;
includeArchived?: string;
archivedOnly?: string;
/**
 * @minimum 1
 */
page?: number;
/**
 * @minimum 1
 * @maximum 100
 */
limit?: number;
};
