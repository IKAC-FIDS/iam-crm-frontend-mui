import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productCatalogService } from '../services/productCatalog.service';
import type {
  CreateProductCatalogItemPayload,
  ProductCatalogListParams,
  ProductPriceHistoryParams,
  UpdateProductCatalogItemPayload,
} from '../types/productCatalog.types';

export const productCatalogKeys = {
  all: ['product-catalog'] as const,
  list: (params: ProductCatalogListParams) => ['product-catalog', 'list', params] as const,
  detail: (id: string) => ['product-catalog', 'detail', id] as const,
  history: (id: string, params: ProductPriceHistoryParams) => ['product-catalog', 'detail', id, 'price-history', params] as const,
};

function useInvalidateProductCatalog() {
  const client = useQueryClient();
  return (id?: string) => Promise.all([
    client.invalidateQueries({ queryKey: productCatalogKeys.all }),
    id ? client.invalidateQueries({ queryKey: productCatalogKeys.detail(id) }) : Promise.resolve(),
    client.invalidateQueries({ queryKey: ['reports', 'product-performance'] }),
    client.invalidateQueries({ queryKey: ['reports', 'exchange-rate-impact'] }),
    client.invalidateQueries({ queryKey: ['dashboard-summary'] }),
  ]);
}

export function useProductPriceHistory(id: string, params: ProductPriceHistoryParams, enabled = true) {
  return useQuery({ queryKey: productCatalogKeys.history(id, params), queryFn: ({ signal }) => productCatalogService.priceHistory(id, params, signal), enabled: enabled && Boolean(id), placeholderData: keepPreviousData });
}

export function useProductCatalog(params: ProductCatalogListParams, enabled = true) {
  return useQuery({
    queryKey: productCatalogKeys.list(params),
    queryFn: () => productCatalogService.list(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useProductCatalogItem(id: string, enabled = true) {
  return useQuery({
    queryKey: productCatalogKeys.detail(id),
    queryFn: () => productCatalogService.get(id),
    enabled: enabled && Boolean(id),
  });
}

export function useCreateProductCatalogItem() {
  const invalidate = useInvalidateProductCatalog();
  return useMutation({
    mutationFn: (payload: CreateProductCatalogItemPayload) => productCatalogService.create(payload),
    onSuccess: (data) => invalidate(data.id),
  });
}

export function useUpdateProductCatalogItem() {
  const invalidate = useInvalidateProductCatalog();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductCatalogItemPayload }) =>
      productCatalogService.update(id, payload),
    onSuccess: (_data, vars) => invalidate(vars.id),
  });
}

export function useActivateProductCatalogItem() {
  const invalidate = useInvalidateProductCatalog();
  return useMutation({
    mutationFn: productCatalogService.activate,
    onSuccess: (_data, id) => invalidate(id),
  });
}

export function useDeactivateProductCatalogItem() {
  const invalidate = useInvalidateProductCatalog();
  return useMutation({
    mutationFn: productCatalogService.deactivate,
    onSuccess: (_data, id) => invalidate(id),
  });
}
