import type { Priority } from '@/features/companies/types/company.types';

export interface OpportunityStage { id: string; code: string; label: string; sortOrder: number; color?: string | null; isTerminal?: boolean; terminalType?: string | null }
export interface Opportunity {
  id: string; companyId: string; title: string; description?: string | null;
  company?: { id: string; legalName: string; brandName?: string | null; industry?: string | null };
  ownerId?: string | null; owner?: { id: string; fullName: string; email?: string; team?: string | null } | null;
  stageId: string; stage: OpportunityStage; priority: Priority | string;
  estimatedValue?: number | string | null; expectedCloseDate?: string | null; source?: string | null;
  archivedAt?: string | null; archiveReason?: string | null; createdAt: string; updatedAt: string;
  lineItems?: unknown[];
  commercialDocuments?: unknown[];
  payments?: unknown[];
  tasks?: unknown[];
  _count?: {
    lineItems?: number;
    commercialDocuments?: number;
    payments?: number;
    tasks?: number;
  };
}
export interface OpportunityListParams { page: number; limit: number; search?: string; companyId?: string; ownerId?: string; team?: string; stageId?: string; priority?: Priority; source?: string; includeArchived?: boolean; archivedOnly?: boolean }
export interface OpportunityPayload { companyId: string; title: string; description?: string; ownerId?: string; stageId?: string; priority?: Priority; estimatedValue?: number; expectedCloseDate?: string; source?: string }
export type CompanyOpportunityPayload = Omit<OpportunityPayload, 'companyId'>;
export type UpdateOpportunityPayload = Partial<Omit<OpportunityPayload, 'companyId' | 'ownerId' | 'stageId'>>;
export interface OpportunityPage { data: Opportunity[]; meta: { total: number; page: number; limit: number; totalPages: number; hasNext?: boolean; hasPrevious?: boolean } }
