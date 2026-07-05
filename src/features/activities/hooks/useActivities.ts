import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyQueryKeys } from '@/features/companies/hooks/useCompanies';
import { activitiesService } from '../services/activities.service';
import type { CreateActivityPayload, GetActivitiesParams } from '../types/activity.types';

export const activityQueryKeys = {
  all: ['activities'] as const,
  lists: (companyId: string) => [...activityQueryKeys.all, companyId] as const,
  list: (params: GetActivitiesParams) => [
    ...activityQueryKeys.lists(params.companyId),
    { page: params.page, limit: params.limit },
  ] as const,
};

export function useActivities(params: GetActivitiesParams) {
  return useQuery({
    queryKey: activityQueryKeys.list(params),
    queryFn: () => activitiesService.getActivitiesByCompany(params),
    placeholderData: keepPreviousData,
    enabled: Boolean(params.companyId),
  });
}

export function useCreateActivity(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateActivityPayload) => activitiesService.createActivity(payload),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists(companyId) }),
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.detail(companyId) }),
    ]),
  });
}
