import { Grid, Paper, Typography } from '@mui/material';
import type { FollowUpActivity } from '../types/followUp.types';
import { getFollowUpDueStatus } from '../utils/followUpDisplay';

export default function FollowUpsSummaryCards({ items }: { items: FollowUpActivity[] }) {
  const overdue = items.filter((item) => getFollowUpDueStatus(item.nextActionDate) === 'overdue').length;
  const today = items.filter((item) => getFollowUpDueStatus(item.nextActionDate) === 'today').length;
  const cards = [
    { label: 'کل پیگیری‌های سررسید', value: items.length, color: 'primary.main' },
    { label: 'عقب‌افتاده', value: overdue, color: 'error.main' },
    { label: 'امروز', value: today, color: 'warning.main' },
  ];
  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 12, sm: 4 }}>
          <Paper sx={{ p: 2 }}><Typography color="text.secondary">{card.label}</Typography><Typography variant="h4" sx={{ color: card.color, mt: 1 }}>{card.value.toLocaleString('fa-IR')}</Typography></Paper>
        </Grid>
      ))}
    </Grid>
  );
}
