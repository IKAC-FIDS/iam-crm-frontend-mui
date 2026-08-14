/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { DeletedTaskResponsePriority } from './deletedTaskResponsePriority';
import type { DeletedTaskResponseStatus } from './deletedTaskResponseStatus';

export interface DeletedTaskResponse {
  /** @nullable */
  assignedToId: string | null;
  /** @nullable */
  cancelledAt: string | null;
  /** @nullable */
  cancelReason: string | null;
  /** @nullable */
  commercialDocumentId: string | null;
  /** @nullable */
  companyId: string | null;
  /** @nullable */
  completedAt: string | null;
  /** @nullable */
  completedById: string | null;
  /** @nullable */
  completionNote: string | null;
  createdAt: string;
  /** @nullable */
  createdById: string | null;
  /** @nullable */
  description: string | null;
  /** @nullable */
  dueAt: string | null;
  id: string;
  /** @nullable */
  opportunityId: string | null;
  organizationId: string;
  /** @nullable */
  paymentId: string | null;
  /** @nullable */
  personId: string | null;
  priority: DeletedTaskResponsePriority;
  /** @nullable */
  reminderAt: string | null;
  status: DeletedTaskResponseStatus;
  title: string;
  updatedAt: string;
}
