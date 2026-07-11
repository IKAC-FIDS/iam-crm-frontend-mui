import type { PaginatedMeta } from '@/lib/apiResponse';

export type CommercialDocumentType = 'PROPOSAL' | 'PROFORMA' | 'CONTRACT';
export type CommercialDocumentStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'SIGNED' | 'CANCELLED' | 'EXPIRED';

export interface CommercialDocumentPaymentSummary {
  id: string;
  status?: string;
  amount?: number | string;
  currency?: string;
  dueDate?: string | null;
  paidAt?: string | null;
  method?: string | null;
  referenceNumber?: string | null;
}

export interface CommercialDocument {
  id: string;
  opportunityId: string;
  type: CommercialDocumentType;
  status: CommercialDocumentStatus;
  number?: string | null;
  version?: number | string | null;
  title: string;
  description?: string | null;
  amount?: number | string | null;
  currency?: string | null;
  validUntil?: string | null;
  issuedAt?: string | null;
  sentAt?: string | null;
  acceptedAt?: string | null;
  rejectedAt?: string | null;
  signedAt?: string | null;
  fileUrl?: string | null;
  externalRef?: string | null;
  notes?: string | null;
  payments?: CommercialDocumentPaymentSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface CommercialDocumentListParams {
  page?: number;
  limit?: number;
  type?: CommercialDocumentType | '';
  status?: CommercialDocumentStatus | '';
  search?: string;
}

export interface CreateCommercialDocumentPayload {
  type: CommercialDocumentType;
  status?: CommercialDocumentStatus;
  number?: string;
  version?: number;
  title: string;
  description?: string;
  amount?: number | string;
  currency?: string;
  validUntil?: string;
  issuedAt?: string;
  fileUrl?: string;
  externalRef?: string;
  notes?: string;
}

export type UpdateCommercialDocumentPayload = Partial<CreateCommercialDocumentPayload>;

export interface ChangeCommercialDocumentStatusPayload {
  status: CommercialDocumentStatus;
  notes?: string;
}

export interface CommercialDocumentPage {
  data: CommercialDocument[];
  meta: PaginatedMeta;
}
