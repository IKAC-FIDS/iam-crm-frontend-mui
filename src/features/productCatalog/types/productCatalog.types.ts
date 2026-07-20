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
  pricingCurrency: PricingCurrency;
  inPersonInputPrice: number | string;
  digikalaInputPrice: number | string;
  inPersonProfitPercent?: number | string | null;
  digikalaProfitPercent?: number | string | null;
  inPersonPriceIrr: number | string;
  digikalaPriceIrr: number | string;
  calculatedExchangeRateId?: string | null;
  calculatedExchangeRate?: { id: string; rate: number | string; validFrom: string; validTo?: string | null } | null;
  priceCalculatedAt?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type PricingCurrency = 'IRR' | 'USD';

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
  pricingCurrency: PricingCurrency;
  inPersonInputPrice: string;
  digikalaInputPrice: string;
  inPersonProfitPercent?: string;
  digikalaProfitPercent?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateProductCatalogItemPayload = Partial<CreateProductCatalogItemPayload>;

export interface ProductCatalogPage {
  data: ProductCatalogItem[];
  meta: PaginatedMeta;
}
