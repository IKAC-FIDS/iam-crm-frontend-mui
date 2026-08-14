/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */

export type TasksGetParams = {
/**
 * @minimum 1
 */
page?: number;
/**
 * @minimum 1
 * @maximum 100
 */
limit?: number;
assignedToId?: string;
createdById?: string;
companyId?: string;
personId?: string;
opportunityId?: string;
commercialDocumentId?: string;
paymentId?: string;
dueFrom?: string;
dueTo?: string;
search?: string;
overdueOnly?: string;
};
