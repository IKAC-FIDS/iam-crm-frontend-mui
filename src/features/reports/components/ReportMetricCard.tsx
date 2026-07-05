import { Paper, Typography } from '@mui/material';

export default function ReportMetricCard({ label, value, unavailable = false }: { label: string; value?: string; unavailable?: boolean }) {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant={unavailable ? 'body1' : 'h4'} color={unavailable ? 'text.secondary' : 'text.primary'} sx={{ mt: 1 }}>
        {unavailable ? 'داده در دسترس نیست.' : value ?? '—'}
      </Typography>
    </Paper>
  );
}
