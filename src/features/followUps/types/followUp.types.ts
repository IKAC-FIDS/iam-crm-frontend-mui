import type { ActivityType } from '@/features/activities/types/activity.types';

export interface FollowUpCompany {
  id: string;
  legalName: string;
  brandName?: string | null;
  stage?: string | null;
  priority?: string | null;
  headOfficeCity?: string | null;
}

export interface FollowUpPerson {
  id: string;
  fullName: string;
  title?: string | null;
  department?: string | null;
}

export interface FollowUpUser {
  id: string;
  fullName: string;
  email?: string | null;
  role?: string | null;
  team?: string | null;
}

export interface FollowUpActivity {
  id: string;
  companyId: string;
  personId?: string | null;
  userId?: string | null;
  type: ActivityType;
  notes?: string | null;
  outcome?: string | null;
  occurredAt?: string | null;
  nextActionDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  company?: FollowUpCompany | null;
  person?: FollowUpPerson | null;
  user?: FollowUpUser | null;
}

export interface GetDueFollowUpsParams {
  page: number;
  limit: 5 | 10 | 20 | 50;
}

export type FollowUpDueStatus = 'overdue' | 'today' | 'upcoming' | 'unknown';
export type FollowUpFilter = 'ALL' | 'OVERDUE' | 'TODAY' | 'UPCOMING';

export interface CompleteFollowUpPayload {
  outcome?: string;
  note?: string;
}

export interface RescheduleFollowUpPayload {
  nextActionDate: string;
  note?: string;
}
