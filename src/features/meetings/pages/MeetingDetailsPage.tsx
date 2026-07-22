import { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Chip, Divider, Grid, Link, Paper, Stack, Typography } from '@mui/material';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { formatJalaliDateTime } from '@/shared/utils/jalaliDate';
import { useMeeting } from '../hooks/useMeetings';
import { meetingModeLabel, meetingStatusColor, meetingStatusLabel } from '../utils/meetingDisplay';
import MeetingFormDialog from '../components/MeetingFormDialog';
import MeetingStatusActionDialog from '../components/MeetingStatusActionDialog';
import AttachmentsTab from '@/features/attachments/components/AttachmentsTab';

function Field({ label, value }: { label: string; value?: string | null }) {
  return <Grid size={{ xs: 12, sm: 6, md: 4 }}><Typography variant="caption" color="text.secondary">{label}</Typography><Typography sx={{ whiteSpace: 'pre-wrap' }}>{value || '—'}</Typography></Grid>;
}

export default function MeetingDetailsPage() {
  const { meetingId = '' } = useParams();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const allowed = can(user, 'meeting:view');
  const query = useMeeting(meetingId, allowed);
  const [edit, setEdit] = useState(false);
  const [action, setAction] = useState<'complete' | 'cancel' | null>(null);
  if (!allowed) return <Alert severity="warning">دسترسی مشاهده جلسه فعال نیست.</Alert>;
  if (query.isLoading) return <Typography>در حال دریافت جلسات...</Typography>;
  if (query.isError || !query.data) return <Alert severity="error">خطا در دریافت جلسات</Alert>;
  const meeting = query.data;
  return <Stack spacing={2}>
    <Button sx={{ alignSelf: 'flex-start' }} onClick={() => navigate('/meetings')}>بازگشت به جلسات</Button>
    <Paper sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between' }} spacing={2}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><Typography variant="h4">{meeting.title}</Typography><Chip label={meetingStatusLabel(meeting.status)} color={meetingStatusColor(meeting.status)} /></Stack>
        <Stack direction="row" spacing={1}>
          {can(user, 'meeting:update') && meeting.status === 'SCHEDULED' && <Button variant="outlined" onClick={() => setEdit(true)}>ویرایش</Button>}
          {can(user, 'meeting:complete') && meeting.status === 'SCHEDULED' && <Button color="success" variant="outlined" onClick={() => setAction('complete')}>ثبت به‌عنوان برگزارشده</Button>}
          {can(user, 'meeting:cancel') && meeting.status === 'SCHEDULED' && <Button color="error" variant="outlined" onClick={() => setAction('cancel')}>لغو جلسه</Button>}
        </Stack>
      </Stack>
      <Divider sx={{ my: 3 }} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}><Typography variant="caption" color="text.secondary">شرکت</Typography><Typography><Link component={RouterLink} to={`/companies/${meeting.companyId}`}>{meeting.company?.brandName || meeting.company?.legalName || '—'}</Link></Typography></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}><Typography variant="caption" color="text.secondary">فرصت</Typography><Typography>{meeting.opportunity ? <Link component={RouterLink} to={`/opportunities/${meeting.opportunity.id}`}>{meeting.opportunity.title}</Link> : '—'}</Typography></Grid>
        <Field label="وضعیت" value={meetingStatusLabel(meeting.status)} /><Field label="نوع برگزاری" value={meetingModeLabel(meeting.mode)} /><Field label="زمان شروع" value={formatJalaliDateTime(meeting.startAt)} /><Field label="زمان پایان" value={formatJalaliDateTime(meeting.endAt)} /><Field label="زمان یادآوری" value={meeting.reminderAt ? formatJalaliDateTime(meeting.reminderAt) : 'بدون یادآوری'} /><Field label="برگزارکننده" value={meeting.organizer?.fullName} /><Field label="مسئولان داخلی" value={meeting.assignees?.map((item) => item.user.fullName).join('، ')} /><Field label="مدعوین شرکت" value={meeting.attendees?.map((item) => item.person.fullName).join('، ')} /><Field label="محل جلسه" value={meeting.location} />
        {meeting.meetingUrl && <Grid size={{ xs: 12, sm: 6, md: 4 }}><Button component="a" href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer">ورود به جلسه</Button></Grid>}
        <Field label="دستور جلسه" value={meeting.agenda} /><Field label="توضیحات" value={meeting.description} /><Field label="یادداشت نتیجه جلسه" value={meeting.completionNote} /><Field label="دلیل لغو" value={meeting.cancellationReason} /><Field label="ایجاد" value={formatJalaliDateTime(meeting.createdAt)} /><Field label="آخرین بروزرسانی" value={formatJalaliDateTime(meeting.updatedAt)} />
      </Grid>
    </Paper>
    <Paper sx={{ p: { xs: 2, sm: 3 }, direction: 'rtl', minWidth: 0 }}>
      {meeting.status === 'SCHEDULED' && <Stack spacing={2}>
        <Typography variant="h6">صورتجلسه و مستندات جلسه</Typography>
        <Alert severity="info">پس از ثبت جلسه به‌عنوان برگزارشده، امکان بارگذاری صورتجلسه و مستندات جلسه فعال می‌شود.</Alert>
      </Stack>}
      {meeting.status === 'CANCELLED' && <Stack spacing={2}>
        <Typography variant="h6">صورتجلسه و مستندات جلسه</Typography>
        <Alert severity="info">این جلسه لغو شده است و امکان بارگذاری صورتجلسه یا مستندات برای آن وجود ندارد.</Alert>
      </Stack>}
      {meeting.status === 'COMPLETED' && <AttachmentsTab
        entityType="MEETING"
        entityId={meeting.id}
        title="صورتجلسه و مستندات جلسه"
        emptyMessage="هنوز صورتجلسه یا مستندی برای این جلسه ثبت نشده است."
        uploadButtonLabel="بارگذاری صورتجلسه یا مستند"
        uploadDialogTitle="بارگذاری صورتجلسه یا مستند جلسه"
        descriptionLabel="عنوان یا توضیح فایل"
      />}
    </Paper>
    {edit && <MeetingFormDialog key={meeting.updatedAt} meeting={meeting} open onClose={() => setEdit(false)} />}
    {action && <MeetingStatusActionDialog meeting={meeting} action={action} open onClose={() => setAction(null)} />}
  </Stack>;
}
