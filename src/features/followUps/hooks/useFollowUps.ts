import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followUpsService } from '../services/followUps.service';
import type { CompleteFollowUpPayload, GetDueFollowUpsParams, RescheduleFollowUpPayload } from '../types/followUp.types';

export const followUpQueryKeys = {
  all: ['follow-ups'] as const,
  due: (params: GetDueFollowUpsParams) => [...followUpQueryKeys.all, 'due', params] as const,
};

export function useDueFollowUps(params: GetDueFollowUpsParams) {
  return useQuery({
    queryKey: followUpQueryKeys.due(params),
    queryFn: () => followUpsService.getDueFollowUps(params),
    placeholderData: keepPreviousData,
  });
}

function useFollowUpInvalidation(companyId: string) {
  const queryClient = useQueryClient();
  return () => Promise.all([
    queryClient.invalidateQueries({ queryKey: [...followUpQueryKeys.all, 'due'] }),
    queryClient.invalidateQueries({ queryKey: ['activities', companyId] }),
    queryClient.invalidateQueries({ queryKey: ['companies', 'detail', companyId] }),
    queryClient.invalidateQueries({ queryKey: ['reports'] }),
    queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
  ]);
}

export function useCompleteFollowUp(companyId: string, activityId: string) {
  const invalidate = useFollowUpInvalidation(companyId);
  return useMutation({ mutationFn: (payload: CompleteFollowUpPayload) => followUpsService.completeFollowUp(activityId, payload), onSuccess: invalidate });
}

export function useRescheduleFollowUp(companyId: string, activityId: string) {
  const invalidate = useFollowUpInvalidation(companyId);
  return useMutation({ mutationFn: (payload: RescheduleFollowUpPayload) => followUpsService.rescheduleFollowUp(activityId, payload), onSuccess: invalidate });
}
