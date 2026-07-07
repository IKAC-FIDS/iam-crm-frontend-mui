import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { browserSupportsWebAuthn, startRegistration } from '@simplewebauthn/browser';

import { useAuthStore } from '@/store/authStore';
import { passkeysService } from '../services/passkeys.service';

export const passkeyQueryKeys = {
  all: ['passkeys'] as const,
  list: (userId?: string) =>
    ['passkeys', 'list', userId ?? 'anonymous'] as const,
};

export function usePasskeys() {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    queryKey: passkeyQueryKeys.list(userId),
    queryFn: passkeysService.list,
    enabled: Boolean(userId),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useRegisterPasskey() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: async (deviceName: string) => {
      if (!browserSupportsWebAuthn()) {
        throw new DOMException(
          'WebAuthn is not supported',
          'NotSupportedError'
        );
      }

      const options = await passkeysService.getRegistrationOptions(deviceName);
      const response = await startRegistration({ optionsJSON: options });

      await passkeysService.verifyRegistration({
        deviceName,
        response,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: passkeyQueryKeys.list(userId),
      });
    },
  });
}

export function useDeletePasskey() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: passkeysService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: passkeyQueryKeys.list(userId),
      });
    },
  });
}
