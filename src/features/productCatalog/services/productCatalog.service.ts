import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, unwrapPaginatedApiResponse } from '@/lib/apiResponse';
import type {
  CreateProductCatalogItemPayload,
  ProductCatalogItem,
  ProductCatalogListParams,
  ProductCatalogPage,
  UpdateProductCatalogItemPayload,
} from '../types/productCatalog.types';

const cleanParams = (value: ProductCatalogListParams) =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));

function cleanPayload<T extends CreateProductCatalogItemPayload | UpdateProductCatalogItemPayload>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== ''),
  ) as T;
}

export const productCatalogService = {
  list: async (query: ProductCatalogListParams = {}): Promise<ProductCatalogPage> =>
    unwrapPaginatedApiResponse<ProductCatalogItem>(
      (await axiosInstance.get<unknown>('/product-catalog', { params: cleanParams(query) })).data,
    ),
  get: async (id: string): Promise<ProductCatalogItem> =>
    unwrapApiResponse<ProductCatalogItem>((await axiosInstance.get<unknown>(`/product-catalog/${id}`)).data),
  create: async (payload: CreateProductCatalogItemPayload): Promise<ProductCatalogItem> =>
    unwrapApiResponse<ProductCatalogItem>(
      (await axiosInstance.post<unknown>('/product-catalog', cleanPayload(payload))).data,
    ),
  update: async (id: string, payload: UpdateProductCatalogItemPayload): Promise<ProductCatalogItem> =>
    unwrapApiResponse<ProductCatalogItem>(
      (await axiosInstance.patch<unknown>(`/product-catalog/${id}`, cleanPayload(payload))).data,
    ),
  activate: async (id: string): Promise<ProductCatalogItem> =>
    unwrapApiResponse<ProductCatalogItem>((await axiosInstance.patch<unknown>(`/product-catalog/${id}/activate`)).data),
  deactivate: async (id: string): Promise<ProductCatalogItem> =>
    unwrapApiResponse<ProductCatalogItem>((await axiosInstance.patch<unknown>(`/product-catalog/${id}/deactivate`)).data),
};
