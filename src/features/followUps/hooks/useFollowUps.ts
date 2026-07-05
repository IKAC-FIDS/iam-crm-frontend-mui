import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { followUpsService } from '../services/followUps.service';
import type { GetDueFollowUpsParams } from '../types/followUp.types';

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
