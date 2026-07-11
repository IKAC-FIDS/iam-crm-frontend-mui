import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { organizationsService } from '../services/organizations.service';
import { organizationQueryKeys } from './useCurrentOrganization';
import type {
  CreateOrganizationPayload,
  FindOrganizationsParams,
  Organization,
  UpdateOrganizationPayload,
} from '../types/organization.types';

function useInvalidateOrganizations() {
  const client = useQueryClient();
  const currentOrganizationId = useAuthStore((state) => state.user?.organizationId);

  return (organization?: Organization, organizationId?: string) => {
    const id = organization?.id ?? organizationId;
    return Promise.all([
      client.invalidateQueries({ queryKey: organizationQueryKeys.lists() }),
      id ? client.invalidateQueries({ queryKey: organizationQueryKeys.detail(id) }) : Promise.resolve(),
      id && id === currentOrganizationId
        ? client.invalidateQueries({ queryKey: organizationQueryKeys.current(currentOrganizationId) })
        : Promise.resolve(),
    ]);
  };
}

export function useOrganizations(params: FindOrganizationsParams, enabled = true) {
  return useQuery({
    queryKey: organizationQueryKeys.list(params),
    queryFn: () => organizationsService.list(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useOrganization(id: string, enabled = true) {
  return useQuery({
    queryKey: organizationQueryKeys.detail(id),
    queryFn: () => organizationsService.get(id),
    enabled: enabled && Boolean(id),
  });
}

export function useCreateOrganization() {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (payload: CreateOrganizationPayload) => organizationsService.create(payload),
    onSuccess: (data) => invalidate(data, data.id),
  });
}

export function useUpdateOrganization() {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrganizationPayload }) =>
      organizationsService.update(id, payload),
    onSuccess: (data, vars) => invalidate(data, vars.id),
  });
}

export function useActivateOrganization() {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (organization: Organization) => organizationsService.activate(organization.id),
    onSuccess: (data, organization) => invalidate(data, organization.id),
  });
}

export function useSuspendOrganization() {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (organization: Organization) => organizationsService.suspend(organization.id),
    onSuccess: (data, organization) => invalidate(data, organization.id),
  });
}
