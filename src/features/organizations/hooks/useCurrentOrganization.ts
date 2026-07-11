import { useQuery } from '@tanstack/react-query';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { organizationsService } from '../services/organizations.service';

export const organizationQueryKeys = {
  all: ['organizations'] as const,
  current: (organizationId?: string | null) => ['organizations', 'current', organizationId ?? 'none'] as const,
  lists: () => ['organizations', 'list'] as const,
  list: (params: object) => ['organizations', 'list', params] as const,
  detail: (id: string) => ['organizations', 'detail', id] as const,
};

export function useCurrentOrganization(enabled = true) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'organization:view', ['ADMIN']);

  return useQuery({
    queryKey: organizationQueryKeys.current(user?.organizationId),
    queryFn: organizationsService.getCurrent,
    enabled: enabled && Boolean(user) && canView,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
