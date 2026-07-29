import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import type { ReactNode } from 'react';
import { formatJalaliDateTime } from '@/shared/utils/jalaliDate';
import { useLatestActivities } from '../hooks/useActivities';
import type { ActivityType } from '../types/activity.types';

const icons: Partial<Record<ActivityType, ReactNode>> = { CALL: <PhoneOutlinedIcon fontSize="small" />, EMAIL: <EmailOutlinedIcon fontSize="small" />, MEETING: <EventOutlinedIcon fontSize="small" />, NOTE: <NotesOutlinedIcon fontSize="small" /> };

export default function LatestActivitiesWidget() {
  const query = useLatestActivities(true);
  return <Paper sx={{ p: 2 }}><Typography variant="h6" sx={{ mb: 1 }}>آخرین فعالیت‌ها</Typography>
    {query.isLoading && <Stack spacing={1}>{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} height={54} />)}</Stack>}
    {query.isError && <Alert severity="error" action={<Button size="small" onClick={() => query.refetch()}>تلاش مجدد</Button>}>آخرین فعالیت‌ها در دسترس نیست.</Alert>}
    {query.data && <Stack divider={<Box sx={{ borderTop: 1, borderColor: 'divider' }} />}>{query.data.length === 0 && <Typography color="text.secondary" sx={{ py: 2 }}>هیچ فعالیتی ثبت نشده است.</Typography>}{query.data.slice(0, 10).map((item) => <Stack key={item.id} direction="row" spacing={1.5} sx={{ py: 1.25, alignItems: 'center' }}><Box color="primary.main" sx={{ display: 'flex' }}>{icons[item.type] ?? <HistoryIcon fontSize="small" />}</Box><Box sx={{ minWidth: 0, flex: 1 }}><Typography noWrap>{item.title}</Typography><Typography variant="caption" color="text.secondary" noWrap>{[item.person?.fullName, item.company?.brandName || item.company?.legalName, item.createdBy?.fullName].filter(Boolean).join(' · ') || '—'}</Typography></Box><Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{formatJalaliDateTime(item.activityDate)}</Typography></Stack>)}</Stack>}
    <Button component={RouterLink} to="/activities" sx={{ mt: 1 }}>مشاهده همه فعالیت‌ها</Button>
  </Paper>;
}
