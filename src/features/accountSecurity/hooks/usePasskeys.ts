import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { browserSupportsWebAuthn, startRegistration } from '@simplewebauthn/browser';

import { passkeysService } from '../services/passkeys.service';

export const passkeyKeys = {
  all: ['passkeys'] as const,
};

export function usePasskeys() {
  return useQuery({
    queryKey: passkeyKeys.all,
    queryFn: passkeysService.list,
  });
}

export function useRegisterPasskey() {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: passkeyKeys.all });
    },
  });
}

export function useDeletePasskey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: passkeysService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: passkeyKeys.all });
    },
  });
}
