import { Button, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function RouteErrorPage() {
  const navigate = useNavigate();

  return (
    <Stack sx={{ minHeight: '100vh', p: 2, alignItems: 'center', justifyContent: 'center' }}>
      <Paper variant="outlined" sx={{ width: '100%', maxWidth: 480, p: 3, textAlign: 'center' }}>
        <Typography variant="h5">خطایی در نمایش این بخش رخ داد.</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          لطفاً دوباره تلاش کنید یا به صفحه قبل بازگردید.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 3, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => window.location.reload()}>تلاش مجدد</Button>
          <Button variant="outlined" onClick={() => navigate(-1)}>بازگشت</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
