import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { queryClient } from '@/lib/queryClient';
import { useAuthStore } from '@/store/authStore';
import { ssoService } from '../services/sso.service';

export default function SsoCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [errorMessage, setErrorMessage] = useState('');
  const ticket = useMemo(() => searchParams.get('ticket')?.trim() ?? '', [searchParams]);
  const providerError = searchParams.get('error') || searchParams.get('message');
  const callbackErrorMessage = providerError
    ? 'ورود سازمانی با خطا مواجه شد.'
    : !ticket
      ? 'تیکت ورود سازمانی دریافت نشد.'
      : '';

  useEffect(() => {
    if (callbackErrorMessage) return;

    let cancelled = false;
    const exchange = async () => {
      try {
        const response = await ssoService.exchangeTicket({ ticket });
        if (cancelled) return;
        queryClient.clear();
        localStorage.setItem('accessToken', response.accessToken);
        setUser(response.user);
        window.history.replaceState(null, '', '/auth/sso/callback');
        toast.success('ورود سازمانی موفق!');
        navigate('/dashboard', { replace: true });
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getApiErrorMessage(error, 'تبادل تیکت ورود سازمانی انجام نشد.'));
        }
      }
    };

    void exchange();
    return () => {
      cancelled = true;
    };
  }, [callbackErrorMessage, navigate, setUser, ticket]);

  const visibleError = callbackErrorMessage || errorMessage;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent>
          <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
            {!visibleError ? (
              <>
                <CircularProgress />
                <Typography variant="h6">در حال تکمیل ورود سازمانی...</Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" color="error">ورود سازمانی انجام نشد</Typography>
                <Typography color="text.secondary">{visibleError}</Typography>
                <Button component={RouterLink} to="/login" variant="contained">بازگشت به ورود</Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
