import type { PaginatedResult } from '@/features/companies/types/company.types';

export interface AuditActor { id?: string; fullName?: string; email?: string }
export interface AuditLog {
  id: string;
  createdAt?: string | null;
  timestamp?: string | null;
  actorId?: string | null;
  actor?: AuditActor | null;
  actorName?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: unknown;
}
export interface AuditLogParams {
  page: number;
  limit: 10 | 20 | 50;
  actorId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}
export type AuditLogResult = PaginatedResult<AuditLog>;
