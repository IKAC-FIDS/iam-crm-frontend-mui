import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import type { CallCard } from '../types/callCard.types';
import { displayCallCardValue } from '../utils/callCardDisplay';

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
        {displayCallCardValue(value)}
      </Typography>
    </Box>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <Paper sx={{ p: { xs: 2, md: 3 } }}><Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>{children}</Paper>;
}

export default function CallCardView({ callCard }: { callCard: CallCard }) {
  return (
    <Stack spacing={2}>
      <Section title="مخاطبان">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}><Field label="مخاطب اصلی" value={callCard.primaryContact?.fullName ?? callCard.primaryContactId} /></Grid>
          <Grid size={{ xs: 12, sm: 6 }}><Field label="مخاطب دوم" value={callCard.secondaryContact?.fullName ?? callCard.secondaryContactId} /></Grid>
        </Grid>
      </Section>

      <Section title="استراتژی">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}><Field label="زاویه ورود" value={callCard.entryAngle} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Field label="هدف تماس" value={callCard.callGoal} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Field label="نقطه درد" value={callCard.painPoint} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Field label="کاربرد پیشنهادی" value={callCard.useCase} /></Grid>
        </Grid>
      </Section>

      <Section title="متن‌های شروع ارتباط">
        <Stack spacing={3}>
          <Field label="جمله شروع تماس" value={callCard.openingLine} />
          <Field label="متن ایمیل اول" value={callCard.firstEmail} />
          <Field label="پیام لینکدین" value={callCard.linkedinMsg} />
        </Stack>
      </Section>

      <Section title="سؤالات کشف نیاز">
        {callCard.discoveryQs?.length ? (
          <Box component="ol" sx={{ m: 0, pr: 3 }}>
            {callCard.discoveryQs.map((item, index) => <li key={`${item.question}-${index}`}><Typography>{item.question}</Typography></li>)}
          </Box>
        ) : <Typography color="text.secondary">سؤالی ثبت نشده است.</Typography>}
      </Section>

      <Section title="اعتراض‌ها و پاسخ‌ها">
        {callCard.objections?.length ? (
          <Stack spacing={2}>
            {callCard.objections.map((item, index) => (
              <Paper key={`${item.objection}-${index}`} variant="outlined" sx={{ p: 2 }}>
                <Field label="اعتراض" value={item.objection} />
                <Box sx={{ mt: 2 }}><Field label="پاسخ پیشنهادی" value={item.response} /></Box>
              </Paper>
            ))}
          </Stack>
        ) : <Typography color="text.secondary">اعتراضی ثبت نشده است.</Typography>}
      </Section>

      <Section title="ارزیابی صلاحیت">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}><Field label="معیارهای احراز" value={callCard.qualificationCriteria} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Field label="معیارهای رد صلاحیت" value={callCard.disqualificationCriteria} /></Grid>
        </Grid>
      </Section>

      <Section title="پیگیری">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}><Field label="درخواست جلسه" value={callCard.meetingAsk} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Field label="پیگیری در صورت عدم پاسخ" value={formatDateTime(callCard.followUpNoResponseAt)} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><Field label="پیگیری در صورت علاقه‌مندی" value={formatDateTime(callCard.followUpInterestAt)} /></Grid>
        </Grid>
      </Section>
    </Stack>
  );
}
