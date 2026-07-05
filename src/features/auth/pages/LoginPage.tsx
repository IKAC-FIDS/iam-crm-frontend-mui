// ============================================================
// مسیر: src/features/auth/pages/LoginPage.tsx
// ============================================================

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Stack,
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Fingerprint } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface ApiErrorResponse {
  message?: string;
}

// ============================================================
// 📝 اعتبارسنجی فرم
// ============================================================

const loginSchema = z.object({
  email: z.string().email('ایمیل نامعتبر است'),
  password: z.string().min(6, 'رمز عبور حداقل ۶ کاراکتر باشد'),
  // remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================================
// 🎯 کامپوننت اصلی (مطابق با تصویر)
// ============================================================

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    // defaultValues: {
    //   remember: false,
    // },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data);
    } catch (err: unknown) {
      const message = axios.isAxiosError<ApiErrorResponse>(err)
        ? err.response?.data?.message
        : undefined;
      setError(message || 'خطا در ورود به سیستم');
    }
  };

  return (
    <Box
      sx={{
        width: '100%', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'radial-gradient(circle at center, #667eea 0%, #080C13 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 2,
          boxShadow: '0 10px 40px rgba(74, 9, 9, 0.06)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* عنوان */}
          <Typography
            variant="h4"
            align="right"
            sx={{ fontWeight: 700, color: '#080C13', mb: 2 }}
          >
            ورود
          </Typography>

          {/* خطا */}
          {error && (
            <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {/* فرم */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
              
              sx={{ '& input:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 30px white inset !important',
                    WebkitTextFillColor: '#767676 !important',
                    backgroundColor: 'transparent !important',
                    backgroundClip: 'padding-box !important',
                  },
                  '& input:-webkit-autofill:hover': {
                      WebkitBoxShadow: '0 0 0 30px white inset !important',
                  },
                  '& input:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 30px white inset !important',
                  },
                  mb: 2 
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
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ '& input:-webkit-autofill': {
                      WebkitBoxShadow: '0 0 0 30px white inset !important',
                      WebkitTextFillColor: '#767676 !important',
                      backgroundColor: 'transparent !important',
                      backgroundClip: 'padding-box !important',
                  },
                  '& input:-webkit-autofill:hover': {
                      WebkitBoxShadow: '0 0 0 30px white inset !important',
                  },
                  '& input:-webkit-autofill:focus': {
                      WebkitBoxShadow: '0 0 0 30px white inset !important',
                  },
                  mb: 1 
                }}
            />

            {/* فراموشی رمز و مرا به خاطر بسپار */}
            <Box sx={{ display: 'contents', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              {/* <FormControlLabel
                control={<Checkbox {...register('remember')} color="primary" />}
                label="مرا به خاطر بسپار"
              /> */}
              <Link href="#" underline="hover" variant="body2" sx={{ fontWeight: 500 }}>
                رمز عبور را فراموش کرده‌اید؟
              </Link>
            </Box>

            {/* دکمه ورود */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                mb: 2,
                bgcolor: '#667eea', // ← رنگ پس‌زمینه دلخواه
                '&:hover': {
                  bgcolor: '#182E77', // ← رنگ هنگام هاور
                },
              }}
              disabled={isLoading}
            >
              {isLoading ? 'در حال ورود...' : 'ورود'}
            </Button>

            {/* لینک ثبت‌نام */}
            {/* <Typography align="center" variant="body2" sx={{ mb: 2 }}>
              حساب کاربری ندارید؟{' '}
              <Link href="#" underline="hover" sx={{ fontWeight: 500 }}>
                ثبت‌نام
              </Link>
            </Typography> */}

            {/* یا */}
            <Divider sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                یا
              </Typography>
            </Divider>

            {/* دکمه‌های ورود با شبکه‌های اجتماعی */}
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Fingerprint />}
                sx={{ py: 1.5, color: 'text.primary', borderColor: '#182E77' }}
              >
                ورود بدون کلمه عبور
              </Button>
              {/* <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                sx={{ py: 1.5, color: 'text.primary', borderColor: 'border.main' }}
              >
                فیسبوک
              </Button> */}
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
