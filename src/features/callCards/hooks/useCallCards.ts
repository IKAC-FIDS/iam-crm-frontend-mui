import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyQueryKeys } from '@/features/companies/hooks/useCompanies';
import { callCardsService } from '../services/callCards.service';
import type { UpsertCallCardPayload } from '../types/callCard.types';

export const callCardQueryKeys = {
  detail: (companyId: string) => ['call-card', companyId] as const,
  suggestion: (companyId: string) => ['call-card-suggest', companyId] as const,
};

export function useCallCard(companyId: string) {
  return useQuery({
    queryKey: callCardQueryKeys.detail(companyId),
    queryFn: () => callCardsService.getCallCard(companyId),
    enabled: Boolean(companyId),
  });
}

export function useSuggestCallCard(companyId: string) {
  return useMutation({
    mutationKey: callCardQueryKeys.suggestion(companyId),
    mutationFn: () => callCardsService.suggestCallCard(companyId),
  });
}

export function useUpsertCallCard(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertCallCardPayload) =>
      callCardsService.upsertCallCard(companyId, payload),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: callCardQueryKeys.detail(companyId) }),
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.detail(companyId) }),
    ]),
  });
}
