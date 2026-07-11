import type { ProductCatalogItem } from '@/features/productCatalog/types/productCatalog.types';

export interface OpportunityLineItem {
  id: string;
  opportunityId: string;
  productId?: string | null;
  product?: ProductCatalogItem | null;
  productCodeSnapshot?: string | null;
  productNameSnapshot?: string | null;
  description?: string | null;
  quantity: number | string;
  unitPrice: number | string;
  discountAmount: number | string;
  taxAmount: number | string;
  lineTotal: number | string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpportunityLineItemPayload {
  productId?: string;
  description?: string;
  quantity: number | string;
  unitPrice?: number | string;
  discountAmount?: number | string;
  taxAmount?: number | string;
  sortOrder?: number;
}

export interface UpdateOpportunityLineItemPayload {
  description?: string;
  quantity?: number | string;
  unitPrice?: number | string;
  discountAmount?: number | string;
  taxAmount?: number | string;
  sortOrder?: number;
}
