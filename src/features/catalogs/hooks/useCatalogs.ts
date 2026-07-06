import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogsService } from '../services/catalogs.service';
import type { CatalogKind, CatalogPayload, CatalogQueryOptions, LookupGroup } from '../types/catalog.types';

export const catalogQueryKeys = { all: ['catalogs'] as const, list: (kind: CatalogKind, options: CatalogQueryOptions) => [...catalogQueryKeys.all, kind, options] as const };
export function useCatalog(kind: CatalogKind, enabled = true, options: CatalogQueryOptions = {}) { return useQuery({ queryKey: catalogQueryKeys.list(kind, options), queryFn: () => catalogsService.getItems(kind, options), enabled, staleTime: 2 * 60 * 1000 }); }
function useInvalidate(kind: CatalogKind) { const client = useQueryClient(); return () => Promise.all([client.invalidateQueries({ queryKey: [...catalogQueryKeys.all, kind] }), client.invalidateQueries({ queryKey: ['reports', 'filter-options'] })]); }
export function useCreateCatalogItem(kind: CatalogKind, group?: LookupGroup) { const invalidate = useInvalidate(kind); return useMutation({ mutationFn: (payload: CatalogPayload) => catalogsService.createItem(kind, payload, group), onSuccess: invalidate }); }
export function useUpdateCatalogItem(kind: CatalogKind, group?: LookupGroup) { const invalidate = useInvalidate(kind); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: CatalogPayload }) => catalogsService.updateItem(kind, id, payload, group), onSuccess: invalidate }); }
export function useDeleteCatalogItem(kind: CatalogKind, group?: LookupGroup) { const invalidate = useInvalidate(kind); return useMutation({ mutationFn: (id: string) => catalogsService.deleteItem(kind, id, group), onSuccess: invalidate }); }
