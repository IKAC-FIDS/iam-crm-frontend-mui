import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyQueryKeys } from '@/features/companies/hooks/useCompanies';
import { activitiesService } from '../services/activities.service';
import type { CreateActivityPayload, GetActivitiesParams, UpdateActivityPayload } from '../types/activity.types';

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
      queryClient.invalidateQueries({ queryKey: ['follow-ups', 'due'] }),
      queryClient.invalidateQueries({ queryKey: ['reports'] }),
    ]),
  });
}

export function useUpdateActivity(companyId: string, activityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateActivityPayload) => activitiesService.updateActivity(activityId, payload),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists(companyId) }),
      queryClient.invalidateQueries({ queryKey: ['follow-ups', 'due'] }),
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.detail(companyId) }),
      queryClient.invalidateQueries({ queryKey: ['reports'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    ]),
  });
}
