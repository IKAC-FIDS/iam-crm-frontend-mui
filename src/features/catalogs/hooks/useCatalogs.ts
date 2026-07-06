import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogsService } from '../services/catalogs.service';
import type { CatalogKind, CatalogPayload } from '../types/catalog.types';

export const catalogQueryKeys = {
  all: ['catalogs'] as const,
  list: (kind: CatalogKind) => [...catalogQueryKeys.all, kind] as const,
};

export function useCatalog(kind: CatalogKind, enabled = true) {
  return useQuery({ queryKey: catalogQueryKeys.list(kind), queryFn: () => catalogsService.getItems(kind), enabled, staleTime: 2 * 60 * 1000 });
}

function useInvalidate(kind: CatalogKind) {
  const client = useQueryClient();
  return () => Promise.all([
    client.invalidateQueries({ queryKey: catalogQueryKeys.list(kind) }),
    client.invalidateQueries({ queryKey: ['reports', 'filter-options'] }),
  ]);
}

export function useCreateCatalogItem(kind: CatalogKind) {
  const invalidate = useInvalidate(kind);
  return useMutation({ mutationFn: (payload: CatalogPayload) => catalogsService.createItem(kind, payload), onSuccess: invalidate });
}
export function useUpdateCatalogItem(kind: CatalogKind) {
  const invalidate = useInvalidate(kind);
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: CatalogPayload }) => catalogsService.updateItem(kind, id, payload), onSuccess: invalidate });
}
export function useDeleteCatalogItem(kind: CatalogKind) {
  const invalidate = useInvalidate(kind);
  return useMutation({ mutationFn: (id: string) => catalogsService.deleteItem(kind, id), onSuccess: invalidate });
}
