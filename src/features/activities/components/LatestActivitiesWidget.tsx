import { Link as RouterLink } from 'react-router-dom';
import {
  Alert, Box, Button, Divider, Paper, Skeleton, Stack, Tooltip, Typography,
} from '@mui/material';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import type { ReactElement } from 'react';
import { formatRelativeJalaliDateTime } from '@/shared/utils/jalaliDate';
import { useLatestActivities } from '../hooks/useActivities';
import type { LatestActivity } from '../types/activity.types';
import {
  getActivityTitle,
  getStageTransitionDisplay,
} from '../utils/activityDisplay';

function activityIcon(type: string): ReactElement {
  const props = { fontSize: 'small' as const, 'aria-hidden': true };
  if (type === 'CALL') return <PhoneOutlinedIcon {...props} />;
  if (type === 'EMAIL') return <EmailOutlinedIcon {...props} />;
  if (type === 'MEETING') return <EventOutlinedIcon {...props} />;
  if (type === 'NOTE') return <NotesOutlinedIcon {...props} />;
  if (type === 'STAGE_CHANGE') return <SwapHorizOutlinedIcon {...props} />;
  if (type.startsWith('LINKEDIN')) return <LinkedInIcon {...props} />;
  return <HistoryOutlinedIcon {...props} />;
}

export function LatestActivityItem({ activity }: { activity: LatestActivity }) {
  const title = getActivityTitle(activity.type, activity.title);
  const transition = activity.type === 'STAGE_CHANGE'
    ? getStageTransitionDisplay(activity.title)
    : null;
  const companyName = activity.company?.brandName || activity.company?.legalName;
  const personName = activity.person?.fullName;
  const timestamp = formatRelativeJalaliDateTime(activity.activityDate);

  return <Box
    component="article"
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '40px minmax(0, 1fr)', sm: '44px minmax(0, 1fr) minmax(110px, 140px)' },
      gridTemplateAreas: { xs: '"icon content" "icon date"', sm: '"icon content date"' },
      columnGap: 1.5,
      rowGap: 0.5,
      alignItems: 'center',
      py: 1.25,
      minHeight: { xs: 72, sm: 80 },
      minWidth: 0,
    }}
  >
    <Box sx={{ gridArea: 'icon', width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'primary.main', bgcolor: 'action.hover' }}>
      {activityIcon(activity.type)}
    </Box>
    <Box sx={{ gridArea: 'content', minWidth: 0 }}>
      <Tooltip title={title} placement="top" enterDelay={700}>
        <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>{title}</Typography>
      </Tooltip>
      {(companyName || personName) && <Typography component="div" variant="body2" color="text.secondary" noWrap>
        {companyName && <Box component={RouterLink} to={`/companies/${activity.company?.id}`} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}>{companyName}</Box>}
        {companyName && personName && ' · '}
        {personName}
      </Typography>}
      {transition && <Typography variant="body2" color="primary.main" noWrap>{transition.from} ← {transition.to}</Typography>}
      {activity.createdBy?.fullName && <Typography variant="caption" color="text.secondary">توسط {activity.createdBy.fullName}</Typography>}
    </Box>
    {timestamp && <Typography variant="caption" color="text.secondary" sx={{ gridArea: 'date', whiteSpace: 'nowrap', alignSelf: { xs: 'start', sm: 'center' } }}>{timestamp}</Typography>}
  </Box>;
}

function LoadingRows() {
  return <Stack divider={<Divider flexItem />}>{Array.from({ length: 5 }, (_, index) => <Box key={index} sx={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr) 130px', gap: 1.5, alignItems: 'center', py: 1.25, minHeight: 80 }}><Skeleton variant="circular" width={40} height={40} /><Box><Skeleton width="45%" /><Skeleton width="70%" /></Box><Skeleton width={100} /></Box>)}</Stack>;
}

export default function LatestActivitiesWidget() {
  const query = useLatestActivities(true);
  return <Paper sx={{ p: { xs: 1.5, sm: 2 }, overflow: 'hidden' }}>
    <Box sx={{ width: '100%', maxWidth: 960 }}>
      <Typography variant="h6" sx={{ mb: 1.25 }}>آخرین فعالیت‌ها</Typography>
      {query.isLoading && <LoadingRows />}
      {query.isError && <Alert severity="error" action={<Button size="small" onClick={() => query.refetch()}>تلاش مجدد</Button>}>آخرین فعالیت‌ها در دسترس نیست.</Alert>}
      {query.data && <Stack divider={<Divider flexItem />}>
        {query.data.length === 0
          ? <Stack sx={{ py: 2, alignItems: 'center' }} spacing={0.5}><HistoryOutlinedIcon aria-hidden color="disabled" /><Typography color="text.secondary">هیچ فعالیتی ثبت نشده است.</Typography></Stack>
          : query.data.slice(0, 10).map((activity) => <LatestActivityItem key={activity.id} activity={activity} />)}
      </Stack>}
      <Divider sx={{ mt: 1 }} />
      <Button component={RouterLink} to="/activities" sx={{ mt: 1 }}>مشاهده همه فعالیت‌ها</Button>
    </Box>
  </Paper>;
}
