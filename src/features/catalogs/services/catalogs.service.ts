import axiosInstance from '@/lib/axios';
import { CATALOG_DEFINITIONS } from '../types/catalog.types';
import type { CatalogItem, CatalogKind, CatalogPayload } from '../types/catalog.types';

function unwrap<T>(payload: T | { data: T }): T {
  return typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data : payload;
}

function list(payload: CatalogItem[] | { data?: CatalogItem[]; items?: CatalogItem[] }): CatalogItem[] {
  return Array.isArray(payload) ? payload : payload.data ?? payload.items ?? [];
}

function endpoint(kind: CatalogKind): string { return CATALOG_DEFINITIONS[kind].endpoint; }

export const catalogsService = {
  getItems: async (kind: CatalogKind): Promise<CatalogItem[]> => {
    const response = await axiosInstance.get<CatalogItem[] | { data?: CatalogItem[]; items?: CatalogItem[] }>(endpoint(kind));
    return list(response.data);
  },
  createItem: async (kind: CatalogKind, payload: CatalogPayload): Promise<CatalogItem> => {
    const response = await axiosInstance.post<CatalogItem | { data: CatalogItem }>(endpoint(kind), payload);
    return unwrap(response.data);
  },
  updateItem: async (kind: CatalogKind, id: string, payload: CatalogPayload): Promise<CatalogItem> => {
    const response = await axiosInstance.patch<CatalogItem | { data: CatalogItem }>(`${endpoint(kind)}/${id}`, payload);
    return unwrap(response.data);
  },
  deleteItem: async (kind: CatalogKind, id: string): Promise<void> => {
    await axiosInstance.delete(`${endpoint(kind)}/${id}`);
  },
};
