import axiosInstance from '@/lib/axios';
import { unwrapApiResponse } from '@/lib/apiResponse';
import { CATALOG_DEFINITIONS } from '../types/catalog.types';
import type { CatalogItem, CatalogKind, CatalogPayload, CatalogQueryOptions, LookupGroup } from '../types/catalog.types';

function list(payload: unknown): unknown[] { const data = unwrapApiResponse<unknown>(payload); if (Array.isArray(data)) return data; return data && typeof data === 'object' && 'items' in data && Array.isArray((data as { items: unknown }).items) ? (data as { items: unknown[] }).items : []; }
function raw(item: unknown): Record<string, unknown> { return item as Record<string, unknown>; }
function normalize(item: unknown): CatalogItem {
  const value = raw(item);
  const label = value.name ?? value.title ?? value.titlePattern ?? value.label ?? value.code;
  const optionValue = value.code ?? value.name ?? value.title ?? value.titlePattern ?? value.label;
  return {
    id: String(value.id), label: String(label ?? ''), value: String(optionValue ?? ''), description: value.description == null ? value.notes == null ? null : String(value.notes) : String(value.description),
    isActive: typeof value.isActive === 'boolean' ? value.isActive : true, code: value.code == null ? null : String(value.code), category: value.category == null ? null : String(value.category),
    sortOrder: value.sortOrder == null ? null : Number(value.sortOrder), createdAt: value.createdAt == null ? undefined : String(value.createdAt), updatedAt: value.updatedAt == null ? undefined : String(value.updatedAt),
    name: value.name == null ? null : String(value.name), title: value.title == null ? null : String(value.title), titlePattern: value.titlePattern == null ? null : String(value.titlePattern),
    defaultPainPoint: value.defaultPainPoint == null ? null : String(value.defaultPainPoint), defaultUseCase: value.defaultUseCase == null ? null : String(value.defaultUseCase), notes: value.notes == null ? null : String(value.notes),
  };
}
function endpoint(kind: CatalogKind, group?: LookupGroup): string {
  if (kind === 'lookupOptions') { if (!group) throw new Error('Lookup group is required'); return `/lookups/${group}`; }
  return CATALOG_DEFINITIONS[kind].endpoint;
}
function requestPayload(kind: CatalogKind, payload: CatalogPayload): Record<string, unknown> {
  if (kind === 'industries') return { name: payload.name, ...(payload.description && { description: payload.description }) };
  if (kind === 'universities') return { name: payload.name, ...(payload.code && { code: payload.code }), ...(payload.description && { description: payload.description }), isActive: payload.isActive };
  if (kind === 'leadSources') return { code: payload.code, name: payload.name, ...(payload.description && { description: payload.description }), isActive: payload.isActive, sortOrder: payload.sortOrder };
  if (kind === 'painPoints' || kind === 'useCases') return { title: payload.title, ...(payload.description && { description: payload.description }), ...(payload.category && { category: payload.category }) };
  if (kind === 'personas') return { titlePattern: payload.titlePattern, ...(payload.defaultPainPoint && { defaultPainPoint: payload.defaultPainPoint }), ...(payload.defaultUseCase && { defaultUseCase: payload.defaultUseCase }), ...(payload.notes && { notes: payload.notes }) };
  return { code: payload.code, label: payload.label, ...(payload.description && { description: payload.description }), isActive: payload.isActive, sortOrder: payload.sortOrder };
}
async function fetchItems(kind: CatalogKind, group: LookupGroup | undefined, active?: boolean): Promise<CatalogItem[]> {
  const params = kind === 'universities'
    ? active === undefined ? undefined : { includeInactive: active === false }
    : active === undefined ? undefined : { active };
  const response = await axiosInstance.get(endpoint(kind, group), params ? { params } : undefined);
  return list(response.data).map(normalize);
}
export const catalogsService = {
  getItems: async (kind: CatalogKind, options: CatalogQueryOptions = {}): Promise<CatalogItem[]> => {
    if (kind === 'universities') return fetchItems(kind, undefined, options.includeInactive ? false : undefined);
    if (options.includeInactive && (kind === 'leadSources' || kind === 'lookupOptions')) {
      const [active, inactive] = await Promise.all([fetchItems(kind, options.group, true), fetchItems(kind, options.group, false)]);
      return [...active, ...inactive].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.label.localeCompare(b.label, 'fa'));
    }
    return fetchItems(kind, options.group, kind === 'leadSources' || kind === 'lookupOptions' ? true : undefined);
  },
  createItem: async (kind: CatalogKind, payload: CatalogPayload, group?: LookupGroup): Promise<CatalogItem> => {
    const response = await axiosInstance.post(endpoint(kind, group), requestPayload(kind, payload)); return normalize(unwrapApiResponse<unknown>(response.data));
  },
  updateItem: async (kind: CatalogKind, id: string, payload: CatalogPayload, group?: LookupGroup): Promise<CatalogItem> => {
    const response = await axiosInstance.patch(`${endpoint(kind, group)}/${id}`, requestPayload(kind, payload)); return normalize(unwrapApiResponse<unknown>(response.data));
  },
  deleteItem: async (kind: CatalogKind, id: string, group?: LookupGroup): Promise<void> => { await axiosInstance.delete(`${endpoint(kind, group)}/${id}`); },
};
