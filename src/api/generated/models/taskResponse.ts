/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { TaskCommercialDocumentSummary } from './taskCommercialDocumentSummary';
import type { TaskCompanySummary } from './taskCompanySummary';
import type { TaskOpportunitySummary } from './taskOpportunitySummary';
import type { TaskPaymentSummary } from './taskPaymentSummary';
import type { TaskPersonSummary } from './taskPersonSummary';
import type { TaskResponsePriority } from './taskResponsePriority';
import type { TaskResponseStatus } from './taskResponseStatus';
import type { UserSummary } from './userSummary';

export interface TaskResponse {
  /** @nullable */
  assignedTo: UserSummary | null;
  /** @nullable */
  assignedToId: string | null;
  /** @nullable */
  cancelledAt: string | null;
  /** @nullable */
  cancelReason: string | null;
  /** @nullable */
  commercialDocument: TaskCommercialDocumentSummary | null;
  /** @nullable */
  commercialDocumentId: string | null;
  /** @nullable */
  company: TaskCompanySummary | null;
  /** @nullable */
  companyId: string | null;
  /** @nullable */
  completedAt: string | null;
  /** @nullable */
  completedBy: UserSummary | null;
  /** @nullable */
  completedById: string | null;
  /** @nullable */
  completionNote: string | null;
  createdAt: string;
  /** @nullable */
  createdBy: UserSummary | null;
  /** @nullable */
  createdById: string | null;
  /** @nullable */
  description: string | null;
  /** @nullable */
  dueAt: string | null;
  id: string;
  /** @nullable */
  opportunity: TaskOpportunitySummary | null;
  /** @nullable */
  opportunityId: string | null;
  organizationId: string;
  /** @nullable */
  payment: TaskPaymentSummary | null;
  /** @nullable */
  paymentId: string | null;
  /** @nullable */
  person: TaskPersonSummary | null;
  /** @nullable */
  personId: string | null;
  priority: TaskResponsePriority;
  /** @nullable */
  reminderAt: string | null;
  status: TaskResponseStatus;
  title: string;
  updatedAt: string;
}
