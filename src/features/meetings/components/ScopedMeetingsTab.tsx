import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import type { CompanyOption } from '@/features/companies/types/company.types';
import type { Opportunity } from '@/features/opportunities/types/opportunity.types';
import { formatJalaliDateTime } from '@/shared/utils/jalaliDate';
import { useMeetings } from '../hooks/useMeetings';
import { meetingStatusColor, meetingStatusLabel } from '../utils/meetingDisplay';
import MeetingFormDialog from './MeetingFormDialog';

export default function ScopedMeetingsTab({ company, opportunity }: { company: CompanyOption; opportunity?: Opportunity }) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const allowed = can(user, 'meeting:view');
  const [open, setOpen] = useState(false);
  const query = useMeetings({ page: 1, limit: 20, companyId: company.id, opportunityId: opportunity?.id }, allowed);
  if (!allowed) return <Alert severity="warning">دسترسی مشاهده جلسات فعال نیست.</Alert>;
  return <Stack spacing={2}>
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between' }} spacing={1}>
      <Typography variant="h6">جلسات</Typography>
      <Stack direction="row" spacing={1}>
        {can(user, 'meeting:create') && <Button variant="contained" onClick={() => setOpen(true)}>جلسه جدید</Button>}
        <Button onClick={() => navigate(`/meetings?${opportunity ? `opportunityId=${opportunity.id}` : `companyId=${company.id}`}`)}>مشاهده همه جلسات این {opportunity ? 'فرصت' : 'شرکت'}</Button>
      </Stack>
    </Stack>
    {query.isLoading && <Typography>در حال دریافت جلسات...</Typography>}
    {query.isError && <Alert severity="error">خطا در دریافت جلسات</Alert>}
    {!query.isLoading && !query.data?.data.length && <Alert severity="info">برای این {opportunity ? 'فرصت' : 'شرکت'} جلسه‌ای ثبت نشده است.</Alert>}
    {query.data?.data.map((meeting) => <Paper key={meeting.id} variant="outlined" sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate(`/meetings/${meeting.id}`)}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between' }} spacing={1}>
        <Stack><Typography sx={{ fontWeight: 700 }}>{meeting.title}</Typography><Typography color="text.secondary">{formatJalaliDateTime(meeting.startAt)} · {meeting.assignees?.map((item) => item.user.fullName).join('، ') || 'بدون مسئول'}</Typography></Stack>
        <Chip size="small" label={meetingStatusLabel(meeting.status)} color={meetingStatusColor(meeting.status)} />
      </Stack>
    </Paper>)}
    {open && <MeetingFormDialog key="scoped-create" open onClose={() => setOpen(false)} initialCompany={company} initialOpportunity={opportunity} lockCompany />}
  </Stack>;
}
