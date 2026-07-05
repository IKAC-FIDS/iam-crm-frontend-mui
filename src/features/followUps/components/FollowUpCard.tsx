import { Box, Button, Chip, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getActivityTypeLabel } from '@/features/activities/types/activity.types';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import type { FollowUpActivity } from '../types/followUp.types';
import { FOLLOW_UP_STATUS_PRESENTATION, getFollowUpDueStatus } from '../utils/followUpDisplay';

function display(value?: string | null): string { return value?.trim() || '—'; }

export default function FollowUpCard({ followUp }: { followUp: FollowUpActivity }) {
  const navigate = useNavigate();
  const status = getFollowUpDueStatus(followUp.nextActionDate);
  const presentation = FOLLOW_UP_STATUS_PRESENTATION[status];
  const companyId = followUp.company?.id ?? followUp.companyId;
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
            <Chip label={presentation.label} color={presentation.color} size="small" />
            <Chip label={getActivityTypeLabel(followUp.type)} variant="outlined" size="small" />
            <Typography sx={{ fontWeight: 700 }}>{display(followUp.company?.legalName)}</Typography>
          </Stack>
          <Typography variant="body2"><strong>زمان پیگیری:</strong> {formatDateTime(followUp.nextActionDate)}</Typography>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }}>
          <Typography variant="body2"><strong>برند:</strong> {display(followUp.company?.brandName)}</Typography>
          <Typography variant="body2"><strong>شخص مرتبط:</strong> {display(followUp.person?.fullName)}</Typography>
          <Typography variant="body2"><strong>ثبت‌کننده:</strong> {display(followUp.user?.fullName)}</Typography>
          <Typography variant="body2"><strong>زمان انجام:</strong> {formatDateTime(followUp.occurredAt)}</Typography>
        </Stack>
        <Box><Typography variant="caption" color="text.secondary">یادداشت</Typography><Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{display(followUp.notes)}</Typography></Box>
        <Box><Typography variant="caption" color="text.secondary">نتیجه</Typography><Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{display(followUp.outcome)}</Typography></Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Button size="small" onClick={() => navigate(`/companies/${companyId}`)}>مشاهده شرکت</Button>
          {followUp.personId && <Button size="small" onClick={() => navigate(`/companies/${companyId}`)}>مشاهده شخص</Button>}
          <Tooltip title="ثبت انجام پیگیری نیازمند endpoint بک‌اند است."><span><Button size="small" disabled>ثبت انجام</Button></span></Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}
