import type { PaginatedMeta } from '@/lib/apiResponse';
import type { Priority } from '@/features/companies/types/company.types';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type TaskPriority = Priority | 'LOW' | 'MEDIUM' | 'HIGH' | 'STRATEGIC';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority | string;
  dueAt?: string | null;
  reminderAt?: string | null;
  companyId?: string | null;
  company?: { id: string; legalName?: string | null; brandName?: string | null } | null;
  personId?: string | null;
  person?: { id: string; fullName?: string | null; title?: string | null } | null;
  opportunityId?: string | null;
  opportunity?: { id: string; title?: string | null; companyId?: string | null } | null;
  commercialDocumentId?: string | null;
  commercialDocument?: { id: string; type?: string; status?: string; number?: string | null; title?: string | null } | null;
  paymentId?: string | null;
  payment?: { id: string; status?: string; amount?: number | string; currency?: string | null } | null;
  assignedToId?: string | null;
  assignedTo?: { id: string; fullName?: string | null; email?: string | null; role?: string | null; team?: string | null } | null;
  createdById?: string | null;
  createdBy?: { id: string; fullName?: string | null; email?: string | null } | null;
  completedAt?: string | null;
  completedById?: string | null;
  completedBy?: { id: string; fullName?: string | null; email?: string | null } | null;
  completionNote?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FindTasksParams {
  page?: number;
  limit?: number;
  status?: TaskStatus | '';
  priority?: TaskPriority | string;
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
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueAt?: string;
  reminderAt?: string;
  companyId?: string;
  personId?: string;
  opportunityId?: string;
  commercialDocumentId?: string;
  paymentId?: string;
  assignedToId?: string;
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;
export interface ChangeTaskStatusPayload { status: TaskStatus; note?: string }
export interface AssignTaskPayload { assignedToId: string }
export interface CompleteTaskPayload { completionNote?: string }
export interface RescheduleTaskPayload { dueAt: string; reminderAt?: string }
export interface TaskPage { data: Task[]; meta: PaginatedMeta }
