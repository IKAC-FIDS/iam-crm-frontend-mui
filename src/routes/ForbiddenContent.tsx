import { useEffect } from 'react';
import { Button, Paper, Stack, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

interface ForbiddenContentProps {
  embedded?: boolean;
}

export function ForbiddenContent({ embedded = false }: ForbiddenContentProps) {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'دسترسی غیرمجاز | CRM';
  }, []);

  return (
    <Stack
      component={embedded ? 'section' : 'main'}
      aria-labelledby="forbidden-title"
      dir="rtl"
      sx={{ minHeight: embedded ? 360 : '100vh', p: 2, alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper variant="outlined" sx={{ width: '100%', maxWidth: 480, p: 4, textAlign: 'center' }}>
        <LockOutlinedIcon color="warning" sx={{ fontSize: 48 }} aria-hidden />
        <Typography id="forbidden-title" variant="h4" component="h1" sx={{ mt: 1 }}>دسترسی غیرمجاز</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          شما اجازه مشاهده این صفحه را ندارید.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 3, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>بازگشت به داشبورد</Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>صفحه قبل</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
