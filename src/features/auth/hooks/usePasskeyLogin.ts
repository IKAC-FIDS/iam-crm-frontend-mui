import { useMutation } from '@tanstack/react-query';
import { browserSupportsWebAuthn, startAuthentication } from '@simplewebauthn/browser';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { authService } from '../services/auth.service';
import { passkeyErrorMessage } from '../utils/passkeyErrors';
import { useAuthStore } from '@/store/authStore';
import { queryClient } from '@/lib/queryClient';

export function usePasskeyLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!browserSupportsWebAuthn()) {
        throw new DOMException(
          'WebAuthn is not supported',
          'NotSupportedError'
        );
      }

      const { challengeId, options } = await authService.getPasskeyAuthenticationOptions();
      const response = await startAuthentication({ optionsJSON: options });

      return authService.verifyPasskeyAuthentication({
        challengeId,
        response,
      });
    },
    onSuccess: (response) => {
      queryClient.clear();
      localStorage.setItem('accessToken', response.accessToken);
      setUser(response.user);
      toast.success('ورود موفق!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(passkeyErrorMessage(error));
    },
  });

  return {
    loginWithPasskey: mutation.mutateAsync,
    isPasskeyLoading: mutation.isPending,
  };
}
