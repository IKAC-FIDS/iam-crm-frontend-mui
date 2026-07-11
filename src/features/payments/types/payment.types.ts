import type { PaginatedMeta } from '@/lib/apiResponse';
import type { CommercialDocumentStatus, CommercialDocumentType } from '@/features/commercialDocuments/types/commercialDocument.types';

export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'BANK_TRANSFER' | 'CASH' | 'CHECK' | 'CARD' | 'OTHER';

export interface OpportunityPayment {
  id: string;
  opportunityId: string;
  commercialDocumentId?: string | null;
  commercialDocument?: {
    id: string;
    type?: CommercialDocumentType;
    status?: CommercialDocumentStatus;
    number?: string | null;
    title?: string | null;
  } | null;
  status: PaymentStatus;
  amount: number | string;
  currency: string;
  dueDate?: string | null;
  paidAt?: string | null;
  method?: PaymentMethod | null;
  referenceNumber?: string | null;
  description?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentListParams {
  page?: number;
  limit?: number;
  status?: PaymentStatus | '';
  commercialDocumentId?: string;
  dueFrom?: string;
  dueTo?: string;
}

export interface CreateOpportunityPaymentPayload {
  commercialDocumentId?: string;
  amount: number | string;
  currency?: string;
  dueDate?: string;
  method?: PaymentMethod;
  referenceNumber?: string;
  description?: string;
  notes?: string;
}

export interface UpdateOpportunityPaymentPayload {
  commercialDocumentId?: string;
  amount?: number | string;
  currency?: string;
  dueDate?: string;
  method?: PaymentMethod;
  referenceNumber?: string;
  description?: string;
  notes?: string;
  status?: PaymentStatus;
}

export interface MarkPaymentPaidPayload {
  paidAt?: string;
  method?: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
}

export type CancelPaymentPayload = Record<string, never>;

export interface PaymentPage {
  data: OpportunityPayment[];
  meta: PaginatedMeta;
}
