import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { opportunityKeys } from '@/features/opportunities/hooks/useOpportunities';
import { opportunityLineItemsService } from '../services/opportunityLineItems.service';
import type {
  CreateOpportunityLineItemPayload,
  UpdateOpportunityLineItemPayload,
} from '../types/opportunityLineItem.types';

export const opportunityLineItemKeys = {
  all: ['opportunity-line-items'] as const,
  list: (opportunityId: string) => ['opportunity-line-items', opportunityId, 'list'] as const,
  detail: (opportunityId: string, lineItemId: string) =>
    ['opportunity-line-items', opportunityId, 'detail', lineItemId] as const,
};

function useInvalidateLineItems(opportunityId: string, companyId?: string) {
  const client = useQueryClient();
  return (lineItemId?: string) => Promise.all([
    client.invalidateQueries({ queryKey: opportunityLineItemKeys.list(opportunityId) }),
    lineItemId
      ? client.invalidateQueries({ queryKey: opportunityLineItemKeys.detail(opportunityId, lineItemId) })
      : Promise.resolve(),
    client.invalidateQueries({ queryKey: opportunityKeys.detail(opportunityId) }),
    client.invalidateQueries({ queryKey: opportunityKeys.all }),
    client.invalidateQueries({ queryKey: ['pipeline'] }),
    client.invalidateQueries({ queryKey: ['company-opportunities', companyId] }),
    client.invalidateQueries({ queryKey: ['companies', 'detail', companyId] }),
    client.invalidateQueries({ queryKey: ['reports', 'product-performance'] }),
    client.invalidateQueries({ queryKey: ['dashboard-summary'] }),
  ]);
}

export function useOpportunityLineItems(opportunityId: string, enabled = true) {
  return useQuery({
    queryKey: opportunityLineItemKeys.list(opportunityId),
    queryFn: () => opportunityLineItemsService.list(opportunityId),
    enabled: enabled && Boolean(opportunityId),
  });
}

export function useCreateOpportunityLineItem(opportunityId: string, companyId?: string) {
  const invalidate = useInvalidateLineItems(opportunityId, companyId);
  return useMutation({
    mutationFn: (payload: CreateOpportunityLineItemPayload) =>
      opportunityLineItemsService.create(opportunityId, payload),
    onSuccess: (data) => invalidate(data.id),
  });
}

export function useUpdateOpportunityLineItem(opportunityId: string, companyId?: string) {
  const invalidate = useInvalidateLineItems(opportunityId, companyId);
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOpportunityLineItemPayload }) =>
      opportunityLineItemsService.update(opportunityId, id, payload),
    onSuccess: (_data, vars) => invalidate(vars.id),
  });
}

export function useDeleteOpportunityLineItem(opportunityId: string, companyId?: string) {
  const invalidate = useInvalidateLineItems(opportunityId, companyId);
  return useMutation({
    mutationFn: (id: string) => opportunityLineItemsService.remove(opportunityId, id),
    onSuccess: (_data, id) => invalidate(id),
  });
}
