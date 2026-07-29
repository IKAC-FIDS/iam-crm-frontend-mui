import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyQueryKeys } from '@/features/companies/hooks/useCompanies';
import { activitiesService } from '../services/activities.service';
import type { CreateActivityPayload, GetActivitiesParams, UpdateActivityPayload } from '../types/activity.types';

export const activityQueryKeys = {
  all: ['activities'] as const,
  lists: () => [...activityQueryKeys.all, 'list'] as const,
  list: (params: GetActivitiesParams) => [...activityQueryKeys.lists(), params] as const,
  latest: ['dashboard', 'latest-activities'] as const,
};

export function useActivities(params: GetActivitiesParams, enabled = true) {
  return useQuery({
    queryKey: activityQueryKeys.list(params),
    queryFn: ({ signal }) => activitiesService.getActivities(params, signal),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useLatestActivities(enabled = true) {
  return useQuery({ queryKey: activityQueryKeys.latest, queryFn: ({ signal }) => activitiesService.getLatestActivities(signal), enabled, staleTime: 60_000 });
}

export function useCreateActivity(companyId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateActivityPayload) => activitiesService.createActivity(payload),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.detail(companyId) }),
      queryClient.invalidateQueries({ queryKey: ['follow-ups', 'due'] }),
      queryClient.invalidateQueries({ queryKey: ['reports'] }),
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.latest }),
    ]),
  });
}

export function useUpdateActivity(companyId: string, activityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateActivityPayload) => activitiesService.updateActivity(activityId, payload),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: ['follow-ups', 'due'] }),
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.detail(companyId) }),
      queryClient.invalidateQueries({ queryKey: ['reports'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    ]),
  });
}
