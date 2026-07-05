import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '@/components/dashboard/Header';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import ChangeCompanyPriorityDialog from '../components/ChangeCompanyPriorityDialog';
import ChangeCompanyStageDialog from '../components/ChangeCompanyStageDialog';
import EditCompanyDialog from '../components/EditCompanyDialog';
import { useCompany } from '../hooks/useCompanies';
import {
  formatDateTime,
  getOwnershipLabel,
  getPriorityLabel,
  getStageLabel,
} from '../utils/companyDisplay';

const detailTabs = [
  { label: 'نمای کلی', value: 'overview' },
  { label: 'افراد', value: 'people' },
  { label: 'فعالیت‌ها', value: 'activities' },
  { label: 'کال کارت', value: 'call-card' },
  { label: 'شعب', value: 'branches' },
  { label: 'کانال‌های اجتماعی', value: 'social-channels' },
] as const;

type DetailTab = (typeof detailTabs)[number]['value'];

interface DetailItemProps {
  label: string;
  value?: string | null;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body1" sx={{ mt: 0.5, overflowWrap: 'anywhere' }}>
        {value?.trim() || '—'}
      </Typography>
    </Box>
  );
}

function getTeamName(team?: string): string {
  return team || '—';
}

export default function CompanyDetailsPage() {
  const navigate = useNavigate();
  const { companyId = '' } = useParams<{ companyId: string }>();
  const user = useAuthStore((state) => state.user);
  const { data: company, isLoading, isError } = useCompany(companyId);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const canEditCompany = can(user, 'company:update', ['ADMIN', 'MANAGER', 'REP']);
  const canChangeStage = can(user, 'company:change-stage', ['ADMIN', 'MANAGER', 'REP']);
  const canAssignOwner = can(user, 'company:change-owner', ['ADMIN', 'MANAGER']);

  if (isLoading) {
    return (
      <Stack sx={{ minHeight: 320, alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (isError || !company) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>دریافت اطلاعات شرکت با خطا مواجه شد.</Alert>
        <Button onClick={() => navigate('/companies')}>بازگشت به شرکت‌ها</Button>
      </Box>
    );
  }

  const stageLabel = getStageLabel(company.stage);
  const priorityLabel = getPriorityLabel(company.priority);

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <Header />

      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
        >
          <Box>
            <Typography variant="h4">{company.legalName}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {company.brandName || 'بدون نام برند'}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Chip label={stageLabel} color="primary" variant="outlined" />
              <Chip label={priorityLabel} color="secondary" variant="outlined" />
              <Chip label={`مالک: ${company.owner?.fullName || 'بدون مالک'}`} variant="outlined" />
            </Stack>
          </Box>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/companies')}>
            بازگشت به شرکت‌ها
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ mb: 2, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(_, value: DetailTab) => setActiveTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {detailTabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {activeTab === 'overview' ? (
        <Stack spacing={2}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}
            >
              {canEditCompany && (
                <Button variant="contained" onClick={() => setEditOpen(true)}>
                  ویرایش اطلاعات شرکت
                </Button>
              )}
              {canChangeStage && (
                <Button variant="outlined" onClick={() => setStageOpen(true)}>
                  تغییر مرحله
                </Button>
              )}
              {canAssignOwner && (
                <Tooltip title="لیست کاربران برای تخصیص مالک هنوز آماده نیست.">
                  <span>
                    <Button variant="outlined" disabled>
                      تخصیص مالک
                    </Button>
                  </span>
                </Tooltip>
              )}
              {canEditCompany && (
                <Button variant="outlined" onClick={() => setPriorityOpen(true)}>
                  تغییر اولویت
                </Button>
              )}
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="نام حقوقی" value={company.legalName} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="نام برند" value={company.brandName} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="صنعت" value={company.industry} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="نوع مالکیت" value={getOwnershipLabel(company.ownership)} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="مرحله فروش" value={stageLabel} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="اولویت" value={priorityLabel} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="مالک" value={company.owner?.fullName} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="تیم مالک" value={getTeamName(company.owner?.team)} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="شهر دفتر مرکزی" value={company.headOfficeCity} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="وب‌سایت" value={company.website} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="منبع" value={company.source} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="تاریخ ایجاد" value={formatDateTime(company.createdAt)} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="آخرین بروزرسانی" value={formatDateTime(company.updatedAt)} /></Grid>
            </Grid>
          </Paper>
        </Stack>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', minHeight: 220 }}>
          <Typography variant="h6">
            {detailTabs.find((tab) => tab.value === activeTab)?.label}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            این بخش برای پیاده‌سازی در مرحله بعد آماده شده است.
          </Typography>
        </Paper>
      )}

      {canEditCompany && (
        <EditCompanyDialog company={company} open={editOpen} onClose={() => setEditOpen(false)} />
      )}
      {canChangeStage && (
        <ChangeCompanyStageDialog
          companyId={company.id}
          currentStage={company.stage}
          open={stageOpen}
          onOpenChange={setStageOpen}
        />
      )}

      {canEditCompany && (
        <ChangeCompanyPriorityDialog
          companyId={company.id}
          currentPriority={company.priority}
          open={priorityOpen}
          onOpenChange={setPriorityOpen}
        />
      )}

    </Box>
  );
}
