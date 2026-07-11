import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Email, Fingerprint, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { getApiErrorMessage } from '@/lib/apiResponse';
import SsoLoginButtons from '@/features/sso/components/SsoLoginButtons';
import { useAuth } from '../hooks/useAuth';
import { usePasskeyLogin } from '../hooks/usePasskeyLogin';
import { passkeyErrorMessage } from '../utils/passkeyErrors';

const loginSchema = z.object({
  email: z.string().email('ایمیل نامعتبر است'),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر باشد'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { loginWithPasskey, isPasskeyLoading } = usePasskeyLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'خطا در ورود به سیستم'));
    }
  };

  const handlePasskeyLogin = async () => {
    try {
      setError(null);
      await loginWithPasskey();
    } catch (err) {
      setError(passkeyErrorMessage(err));
    }
  };

  const autofillSx = {
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 30px var(--color-bg-paper) inset !important',
      WebkitTextFillColor: 'var(--color-text-secondary) !important',
      backgroundColor: 'transparent !important',
      backgroundClip: 'padding-box !important',
    },
    '& input:-webkit-autofill:hover': {
      WebkitBoxShadow: '0 0 0 30px var(--color-bg-paper) inset !important',
    },
    '& input:-webkit-autofill:focus': {
      WebkitBoxShadow: '0 0 0 30px var(--color-bg-paper) inset !important',
    },
  };

  const disabled = isLoading || isPasskeyLoading;

  return (
    <Box
      sx={{
        width: '100%',
        direction: 'rtl',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage:
          'radial-gradient(circle at center, var(--color-primary-light) 0%, var(--color-primary-dark) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 'var(--radius-lg)',
          bgcolor: 'var(--color-bg-paper)',
          border: '1px solid var(--color-divider)',
          boxShadow: 'var(--shadow-login-card)',
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2.5, sm: 4 },
            '&:last-child': {
              pb: { xs: 2.5, sm: 4 },
            },
          }}
        >
          <Typography
            variant="h4"
            align="right"
            sx={{
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              mb: 2,
            }}
          >
            ورود
          </Typography>

          {error && (
            <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ textAlign: 'right' }}>
            <TextField
              fullWidth
              label="ایمیل"
              placeholder="your_mail@rsa.ir"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                ...autofillSx,
                mb: 2,
              }}
            />

            <TextField
              fullWidth
              label="رمز عبور"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((current) => !current)}
                        edge="end"
                        aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                ...autofillSx,
                mb: 1,
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 2 }}>
              <Link
                href="#"
                underline="hover"
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: 'var(--color-secondary-main)',
                  '&:hover': {
                    color: 'var(--color-secondary-dark)',
                  },
                }}
              >
                رمز عبور را فراموش کرده‌اید؟
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{
                py: 1.5,
                mb: 2,
              }}
              disabled={disabled}
            >
              {isLoading ? 'در حال ورود...' : 'ورود'}
            </Button>

            <Divider sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                یا
              </Typography>
            </Divider>

            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                type="button"
                variant="outlined"
                color="primary"
                startIcon={<Fingerprint />}
                sx={{
                  py: 1.5,
                }}
                disabled={disabled}
                onClick={handlePasskeyLogin}
              >
                {isPasskeyLoading ? 'در حال بررسی Passkey...' : 'ورود با Passkey'}
              </Button>
            </Stack>
            <SsoLoginButtons disabled={disabled} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
