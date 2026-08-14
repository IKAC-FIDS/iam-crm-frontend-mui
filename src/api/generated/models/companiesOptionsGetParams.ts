/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */

export type CompaniesOptionsGetParams = {
search?: string;
/**
 * @minimum 1
 */
page?: number;
/**
 * @minimum 1
 * @maximum 50
 */
limit?: number;
excludeId?: string;
selectedId?: string;
includeArchived?: boolean;
};
