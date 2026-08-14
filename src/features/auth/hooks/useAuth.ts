// ============================================================
// مسیر: src/features/auth/hooks/useAuth.ts
// ============================================================

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { LoginRequest } from '../services/auth.service';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { applyAuthenticatedSession } from '../utils/authSession';
import { toast } from 'sonner';

export function useAuth() {
  const navigate = useNavigate();
  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      applyAuthenticatedSession(response);
      toast.success('ورود موفق!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'خطا در ورود'));
    },
  });

  return { login, isLoading: isPending };
}
