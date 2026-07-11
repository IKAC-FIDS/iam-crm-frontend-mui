// ============================================================
// مسیر: src/features/auth/hooks/useAuth.ts
// ============================================================

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { LoginRequest } from '../services/auth.service';
import { useAuthStore } from '@/store/authStore';
import { queryClient } from '@/lib/queryClient';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { toast } from 'sonner';

export function useAuth() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      queryClient.clear();
      localStorage.setItem('accessToken', response.accessToken);
      setUser(response.user);
      toast.success('ورود موفق!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'خطا در ورود'));
    },
  });

  return { login, isLoading: isPending };
}
