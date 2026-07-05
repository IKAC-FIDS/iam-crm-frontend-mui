import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyQueryKeys } from '@/features/companies/hooks/useCompanies';
import { companySocialChannelsService } from '../services/companySocialChannels.service';
import type { CreateCompanySocialChannelPayload, UpdateCompanySocialChannelPayload } from '../types/companySocialChannel.types';

export const companySocialChannelQueryKeys = {
  all: ['company-social-channels'] as const,
  list: (companyId: string) => [...companySocialChannelQueryKeys.all, companyId] as const,
};

export function useCompanySocialChannels(companyId: string) {
  return useQuery({ queryKey: companySocialChannelQueryKeys.list(companyId), queryFn: () => companySocialChannelsService.getCompanySocialChannels(companyId), enabled: Boolean(companyId) });
}

function useInvalidation(companyId: string) {
  const queryClient = useQueryClient();
  return () => Promise.all([
    queryClient.invalidateQueries({ queryKey: companySocialChannelQueryKeys.list(companyId) }),
    queryClient.invalidateQueries({ queryKey: companyQueryKeys.detail(companyId) }),
  ]);
}

export function useCreateCompanySocialChannel(companyId: string) {
  const invalidate = useInvalidation(companyId);
  return useMutation({ mutationFn: (payload: CreateCompanySocialChannelPayload) => companySocialChannelsService.createCompanySocialChannel(companyId, payload), onSuccess: invalidate });
}

export function useUpdateCompanySocialChannel(companyId: string, channelId: string) {
  const invalidate = useInvalidation(companyId);
  return useMutation({ mutationFn: (payload: UpdateCompanySocialChannelPayload) => companySocialChannelsService.updateCompanySocialChannel(companyId, channelId, payload), onSuccess: invalidate });
}

export function useDeleteCompanySocialChannel(companyId: string) {
  const invalidate = useInvalidation(companyId);
  return useMutation({ mutationFn: (channelId: string) => companySocialChannelsService.deleteCompanySocialChannel(companyId, channelId), onSuccess: invalidate });
}
