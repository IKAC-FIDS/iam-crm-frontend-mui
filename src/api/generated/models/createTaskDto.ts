/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { CreateTaskDtoPriority } from './createTaskDtoPriority';
import type { CreateTaskDtoStatus } from './createTaskDtoStatus';

export interface CreateTaskDto {
  assignedToId?: string;
  commercialDocumentId?: string;
  companyId?: string;
  description?: string;
  dueAt?: string;
  opportunityId?: string;
  paymentId?: string;
  personId?: string;
  priority?: CreateTaskDtoPriority;
  reminderAt?: string;
  status?: CreateTaskDtoStatus;
  /** @maxLength 200 */
  title: string;
}
