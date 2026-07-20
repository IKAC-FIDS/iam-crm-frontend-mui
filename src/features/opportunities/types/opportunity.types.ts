import type { Priority } from '@/features/companies/types/company.types';
import type { CommercialDocument } from '@/features/commercialDocuments/types/commercialDocument.types';
import type { OpportunityLineItem } from '@/features/opportunityLineItems/types/opportunityLineItem.types';
import type { OpportunityPayment } from '@/features/payments/types/payment.types';
import type { OwnershipScope } from '@/shared/types/ownership';

export interface OpportunityStage { id: string; code: string; label: string; sortOrder: number; color?: string | null; isTerminal?: boolean; terminalType?: string | null }
export interface Opportunity {
  id: string; companyId: string; title: string; description?: string | null;
  company?: { id: string; legalName: string; brandName?: string | null; industry?: string | null };
  ownerId?: string | null; owner?: { id: string; fullName: string; email?: string; team?: string | null } | null;
  stageId: string; stage: OpportunityStage; priority: Priority | string;
  estimatedValue?: number | string | null; expectedCloseDate?: string | null;
  source?: string | null; opportunitySource?: string | null;
  sourceOptionId?: string | null; sourceOption?: { id: string; code: string; label: string } | null;
  primaryContactId?: string | null;
  primaryContact?: { id: string; fullName: string; title?: string | null; department?: string | null; email?: string | null; phone?: string | null; isPrimaryContact?: boolean } | null;
  probability?: number | null; competitor?: string | null;
  archivedAt?: string | null; archiveReason?: string | null; createdAt: string; updatedAt: string;
  lineItems?: OpportunityLineItem[];
  commercialDocuments?: CommercialDocument[];
  payments?: OpportunityPayment[];
  tasks?: unknown[];
  _count?: {
    lineItems?: number;
    commercialDocuments?: number;
    payments?: number;
    tasks?: number;
  };
}
export interface OpportunityListParams { page: number; limit: number; search?: string; companyId?: string; ownerId?: string; team?: string; ownershipScope?: OwnershipScope; stageId?: string; priority?: Priority; source?: string; opportunitySource?: string; sourceOptionId?: string; primaryContactId?: string; includeArchived?: boolean; archivedOnly?: boolean; activeOnly?: boolean }
export interface OpportunityPayload { companyId: string; title: string; description?: string; ownerId?: string; stageId?: string; priority?: Priority; estimatedValue?: number; expectedCloseDate?: string; source?: string; sourceOptionId?: string; opportunitySource?: string; primaryContactId?: string; probability?: number; competitor?: string }
export type CompanyOpportunityPayload = Omit<OpportunityPayload, 'companyId'>;
export type UpdateOpportunityPayload = Partial<Omit<OpportunityPayload, 'companyId' | 'ownerId' | 'stageId'>>;
export interface OpportunityPage { data: Opportunity[]; meta: { total: number; page: number; limit: number; totalPages: number; hasNext?: boolean; hasPrevious?: boolean } }
