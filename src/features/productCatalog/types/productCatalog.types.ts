import type { PaginatedMeta } from '@/lib/apiResponse';

export interface ProductCatalogItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  category?: string | null;
  unit?: string | null;
  defaultUnitPrice: number | string;
  currency: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCatalogListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  active?: boolean | string;
}

export interface CreateProductCatalogItemPayload {
  code: string;
  name: string;
  description?: string;
  category?: string;
  unit?: string;
  defaultUnitPrice?: number | string;
  currency?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateProductCatalogItemPayload = Partial<CreateProductCatalogItemPayload>;

export interface ProductCatalogPage {
  data: ProductCatalogItem[];
  meta: PaginatedMeta;
}
