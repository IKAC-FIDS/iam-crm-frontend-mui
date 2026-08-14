import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { quotaService } from '../services/quota.service';

export const quotaQueryKeys = {
  all: ['quota'] as const,
  current: (organizationId: string | null) => [...quotaQueryKeys.all, 'current', organizationId] as const,
};

export function useCurrentQuota() {
  const organizationId = useAuthStore((state) => state.user?.organizationId ?? null);
  return useQuery({
    queryKey: quotaQueryKeys.current(organizationId),
    queryFn: ({ signal }) => quotaService.current(signal),
    enabled: Boolean(organizationId),
    staleTime: 60_000,
  });
}
