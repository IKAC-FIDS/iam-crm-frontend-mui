import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ssoService } from '../services/sso.service';
import type {
  CreateSsoProviderPayload,
  FindSsoProvidersParams,
  SsoProvider,
  UpdateSsoProviderPayload,
} from '../types/sso.types';

export const ssoQueryKeys = {
  all: ['sso'] as const,
  publicProviders: () => ['sso', 'public-providers'] as const,
  lists: () => ['sso', 'providers', 'list'] as const,
  list: (params: FindSsoProvidersParams) => ['sso', 'providers', 'list', params] as const,
  detail: (id: string) => ['sso', 'providers', 'detail', id] as const,
};

function useInvalidateSsoProviders() {
  const client = useQueryClient();
  return (id?: string) => Promise.all([
    client.invalidateQueries({ queryKey: ssoQueryKeys.lists() }),
    client.invalidateQueries({ queryKey: ssoQueryKeys.publicProviders() }),
    id ? client.invalidateQueries({ queryKey: ssoQueryKeys.detail(id) }) : Promise.resolve(),
  ]);
}

export function usePublicSsoProviders(enabled = true) {
  return useQuery({
    queryKey: ssoQueryKeys.publicProviders(),
    queryFn: ssoService.listPublicProviders,
    enabled,
    retry: false,
  });
}

export function useSsoProviders(params: FindSsoProvidersParams, enabled = true) {
  return useQuery({
    queryKey: ssoQueryKeys.list(params),
    queryFn: () => ssoService.listProviders(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useSsoProvider(id: string, enabled = true) {
  return useQuery({
    queryKey: ssoQueryKeys.detail(id),
    queryFn: () => ssoService.getProvider(id),
    enabled: enabled && Boolean(id),
  });
}

export function useCreateSsoProvider() {
  const invalidate = useInvalidateSsoProviders();
  return useMutation({
    mutationFn: (payload: CreateSsoProviderPayload) => ssoService.createProvider(payload),
    onSuccess: (data) => invalidate(data.id),
  });
}

export function useUpdateSsoProvider() {
  const invalidate = useInvalidateSsoProviders();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSsoProviderPayload }) =>
      ssoService.updateProvider(id, payload),
    onSuccess: (data, vars) => invalidate(data.id ?? vars.id),
  });
}

export function useActivateSsoProvider() {
  const invalidate = useInvalidateSsoProviders();
  return useMutation({
    mutationFn: (provider: SsoProvider) => ssoService.activateProvider(provider.id),
    onSuccess: (data, provider) => invalidate(data.id ?? provider.id),
  });
}

export function useDeactivateSsoProvider() {
  const invalidate = useInvalidateSsoProviders();
  return useMutation({
    mutationFn: (provider: SsoProvider) => ssoService.deactivateProvider(provider.id),
    onSuccess: (data, provider) => invalidate(data.id ?? provider.id),
  });
}

export function useDeleteSsoProvider() {
  const invalidate = useInvalidateSsoProviders();
  return useMutation({
    mutationFn: (provider: SsoProvider) => ssoService.deleteProvider(provider.id),
    onSuccess: (_data, provider) => invalidate(provider.id),
  });
}
