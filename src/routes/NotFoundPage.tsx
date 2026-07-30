import { Button, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Stack component="main" dir="rtl" sx={{ minHeight: '100vh', p: 2, alignItems: 'center', justifyContent: 'center' }}>
      <Paper variant="outlined" sx={{ width: '100%', maxWidth: 480, p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1">صفحه پیدا نشد</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>نشانی واردشده معتبر نیست یا این صفحه جابه‌جا شده است.</Typography>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/dashboard')}>بازگشت به داشبورد</Button>
      </Paper>
    </Stack>
  );
}
