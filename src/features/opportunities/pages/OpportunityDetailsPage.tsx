import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Alert, Box, Button, Chip, Divider, Grid, Link, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';

import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { formatDateTime, getPriorityLabel } from '@/features/companies/utils/companyDisplay';
import CommercialDocumentsTab from '@/features/commercialDocuments/components/CommercialDocumentsTab';
import OpportunityLineItemsTab from '@/features/opportunityLineItems/components/OpportunityLineItemsTab';
import PaymentsTab from '@/features/payments/components/PaymentsTab';
import ChangeOpportunityOwnerDialog from '../components/ChangeOpportunityOwnerDialog';
import ChangeOpportunityStageDialog from '../components/ChangeOpportunityStageDialog';
import OpportunityFormDialog from '../components/OpportunityFormDialog';
import { useArchiveOpportunity, useOpportunity, useRestoreOpportunity } from '../hooks/useOpportunities';
import type { Opportunity } from '../types/opportunity.types';

const placeholder = {
  items: 'آیتم‌های فرصت در fix بعدی تکمیل می‌شود.',
  documents: 'اسناد تجاری در fix بعدی تکمیل می‌شود.',
  payments: 'پرداخت‌ها در fix بعدی تکمیل می‌شود.',
  tasks: 'کارها در fix بعدی تکمیل می‌شود.',
  attachments: 'پیوست‌ها در fix بعدی تکمیل می‌شود.',
  activities: 'فعالیت‌های مرتبط در مرحله بعد تکمیل می‌شود.',
};

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return <Grid size={{ xs: 12, sm: 6, md: 4 }}><Typography variant="caption" color="text.secondary">{label}</Typography><Typography sx={{ mt: 0.5 }}>{value ?? '—'}</Typography></Grid>;
}

function PlaceholderCard({ text }: { text: string }) {
  return <Paper variant="outlined" sx={{ p: 3 }}><Typography color="text.secondary">{text}</Typography></Paper>;
}

function Overview({ opportunity }: { opportunity: Opportunity }) {
  const companyName = opportunity.company?.brandName || opportunity.company?.legalName;
  return (
    <Paper sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Field label="عنوان فرصت" value={opportunity.title} />
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="caption" color="text.secondary">شرکت</Typography>
          <Typography sx={{ mt: 0.5 }}>{companyName ? <Link component={RouterLink} to={`/companies/${opportunity.companyId}`}>{companyName}</Link> : '—'}</Typography>
        </Grid>
        <Field label="مرحله" value={opportunity.stage?.label} />
        <Field label="اولویت" value={getPriorityLabel(opportunity.priority)} />
        <Field label="مالک" value={opportunity.owner?.fullName} />
        <Field label="ارزش تخمینی" value={opportunity.estimatedValue == null ? '—' : Number(opportunity.estimatedValue).toLocaleString('fa-IR')} />
        <Field label="تاریخ بستن مورد انتظار" value={formatDateTime(opportunity.expectedCloseDate)} />
        <Field label="منبع" value={opportunity.source} />
        <Field label="تاریخ ایجاد" value={formatDateTime(opportunity.createdAt)} />
        <Field label="آخرین بروزرسانی" value={formatDateTime(opportunity.updatedAt)} />
        <Field label="وضعیت بایگانی" value={opportunity.archivedAt ? 'بایگانی' : 'فعال'} />
        {opportunity.archivedAt && <Field label="تاریخ بایگانی" value={formatDateTime(opportunity.archivedAt)} />}
        {opportunity.archivedAt && <Field label="دلیل بایگانی" value={opportunity.archiveReason} />}
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption" color="text.secondary">توضیحات</Typography>
          <Typography sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>{opportunity.description || '—'}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default function OpportunityDetailsPage() {
  const { opportunityId = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const allowed = can(user, 'opportunity:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const query = useOpportunity(opportunityId, allowed);
  const opportunity = query.data;
  const [tab, setTab] = useState('overview');
  const [formOpen, setFormOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const archive = useArchiveOpportunity(opportunity?.companyId);
  const restore = useRestoreOpportunity(opportunity?.companyId);
  const state = location.state as { backTo?: string; backLabel?: string } | null;
  const backTo = state?.backTo ?? '/opportunities';
  const backLabel = state?.backLabel ?? 'بازگشت به فرصت‌ها';

  if (!allowed) return <Alert severity="warning">دسترسی مشاهده فرصت فعال نیست.</Alert>;
  if (query.isLoading) return <Typography>در حال دریافت جزئیات فرصت...</Typography>;
  if (query.isError || !opportunity) return <Alert severity="error">دریافت جزئیات فرصت انجام نشد.</Alert>;

  const archiveToggle = async () => {
    try {
      if (opportunity.archivedAt) await restore.mutateAsync(opportunity.id);
      else await archive.mutateAsync({ id: opportunity.id });
      toast.success(opportunity.archivedAt ? 'فرصت بازیابی شد.' : 'فرصت بایگانی شد.');
    } catch {
      toast.error('عملیات بایگانی فرصت انجام نشد.');
    }
  };

  return (
    <Box>
      <Button sx={{ mb: 2 }} onClick={() => navigate(backTo)}>{backLabel}</Button>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
            <Typography variant="h4">{opportunity.title}</Typography>
            <Chip size="small" color={opportunity.archivedAt ? 'default' : 'success'} label={opportunity.archivedAt ? 'بایگانی' : 'فعال'} />
          </Stack>
          <Typography color="text.secondary">{opportunity.company?.brandName || opportunity.company?.legalName || 'بدون شرکت'} · {opportunity.stage?.label || 'بدون مرحله'}</Typography>
        </Box>
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
          <Button variant="outlined" disabled={!can(user, 'opportunity:update') || Boolean(opportunity.archivedAt)} onClick={() => setFormOpen(true)}>ویرایش</Button>
          <Button variant="outlined" disabled={!can(user, 'opportunity:change-stage') || Boolean(opportunity.archivedAt)} onClick={() => setStageOpen(true)}>تغییر مرحله</Button>
          <Button variant="outlined" disabled={!can(user, 'opportunity:change-owner') || Boolean(opportunity.archivedAt)} onClick={() => setOwnerOpen(true)}>تغییر مالک</Button>
          <Button color="warning" variant="outlined" disabled={!can(user, opportunity.archivedAt ? 'opportunity:restore' : 'opportunity:archive')} onClick={archiveToggle}>{opportunity.archivedAt ? 'بازیابی' : 'بایگانی'}</Button>
        </Stack>
      </Stack>
      <Paper sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
          <Tab value="overview" label="نمای کلی" />
          <Tab value="items" label="آیتم‌ها" />
          <Tab value="documents" label="اسناد تجاری" />
          <Tab value="payments" label="پرداخت‌ها" />
          <Tab value="tasks" label="کارها" />
          <Tab value="attachments" label="پیوست‌ها" />
          <Tab value="activities" label="فعالیت‌ها" />
        </Tabs>
      </Paper>
      {tab === 'overview' && <Overview opportunity={opportunity} />}
      {tab === 'items' && <OpportunityLineItemsTab opportunityId={opportunity.id} companyId={opportunity.companyId} />}
      {tab === 'documents' && <CommercialDocumentsTab opportunityId={opportunity.id} companyId={opportunity.companyId} />}
      {tab === 'payments' && <PaymentsTab opportunityId={opportunity.id} companyId={opportunity.companyId} />}
      {tab === 'tasks' && <PlaceholderCard text={placeholder.tasks} />}
      {tab === 'attachments' && <PlaceholderCard text={placeholder.attachments} />}
      {tab === 'activities' && <PlaceholderCard text={placeholder.activities} />}
      {formOpen && <OpportunityFormDialog companyId={opportunity.companyId} opportunity={opportunity} open onClose={() => setFormOpen(false)} />}
      {stageOpen && <ChangeOpportunityStageDialog opportunity={opportunity} open onClose={() => setStageOpen(false)} />}
      {ownerOpen && <ChangeOpportunityOwnerDialog opportunity={opportunity} open onClose={() => setOwnerOpen(false)} />}
    </Box>
  );
}
