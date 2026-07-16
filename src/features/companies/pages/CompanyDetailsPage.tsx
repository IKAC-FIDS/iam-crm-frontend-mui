import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '@/components/dashboard/Header';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import ChangeCompanyPriorityDialog from '../components/ChangeCompanyPriorityDialog';
import EditCompanyDialog from '../components/EditCompanyDialog';
import ChangeCompanyOwnerDialog from '../components/ChangeCompanyOwnerDialog';
import ArchiveCompanyDialog from '../components/ArchiveCompanyDialog';
import RestoreCompanyDialog from '../components/RestoreCompanyDialog';
import PeopleTab from '@/features/people/components/PeopleTab';
import ActivitiesTab from '@/features/activities/components/ActivitiesTab';
import CallCardTab from '@/features/callCards/components/CallCardTab';
import CompanyBranchesTab from '@/features/companyBranches/components/CompanyBranchesTab';
import CompanySocialChannelsTab from '@/features/companySocialChannels/components/CompanySocialChannelsTab';
import CompanyOpportunitiesTab from '@/features/opportunities/components/CompanyOpportunitiesTab';
import CompanyTasksTab from '@/features/tasks/components/CompanyTasksTab';
import CompanyLegalDocumentsTab from '../components/CompanyLegalDocumentsTab';
import { useCompany } from '../hooks/useCompanies';
import { isCompanyArchived, type CompanySummary } from '../types/company.types';
import {
  formatDate,
  formatDateTime,
  formatNumber,
  getActivityStatusLabel,
  getOwnershipLabel,
  getPriorityLabel,
} from '../utils/companyDisplay';

const detailTabs = [
  { label: 'Ù†Ù…Ø§ÛŒ Ú©Ù„ÛŒ', value: 'overview' },
  { label: 'Ø§ÙØ±Ø§Ø¯', value: 'people' },
  { label: 'ÙØ±ØµØªâ€ŒÙ‡Ø§', value: 'opportunities' },
  { label: 'Ú©Ø§Ø±Ù‡Ø§', value: 'tasks' },
  { label: 'ÙØ¹Ø§Ù„ÛŒØªâ€ŒÙ‡Ø§', value: 'activities' },
  { label: 'Ú©Ø§Ù„ Ú©Ø§Ø±Øª', value: 'call-card' },
  { label: 'اسناد حقوقی', value: 'legal-documents' },
  { label: 'Ø´Ø¹Ø¨', value: 'branches' },
  { label: 'Ú©Ø§Ù†Ø§Ù„â€ŒÙ‡Ø§ÛŒ Ø§Ø¬ØªÙ…Ø§Ø¹ÛŒ', value: 'social-channels' },
] as const;

type DetailTab = (typeof detailTabs)[number]['value'];
interface CompanyDetailLocationState { backTo?: string; backLabel?: string }

interface DetailItemProps {
  label: string;
  value?: string | null;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body1" sx={{ mt: 0.5, overflowWrap: 'anywhere' }}>
        {value?.trim() || 'â€”'}
      </Typography>
    </Box>
  );
}

function getTeamName(team?: string): string {
  return team || 'â€”';
}

function CompanyLinks({ companies }: { companies?: CompanySummary[] }) {
  const navigate = useNavigate();
  if (!companies?.length) return <Typography variant="body1" sx={{ mt: 0.5 }}>—</Typography>;
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 1 }}>
      {companies.map((item) => (
        <Chip
          key={item.id}
          label={item.brandName ? `${item.legalName} (${item.brandName})` : item.legalName}
          variant="outlined"
          onClick={() => navigate(`/companies/${item.id}`)}
        />
      ))}
    </Stack>
  );
}

export default function CompanyDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state as CompanyDetailLocationState | null;
  const backTo = navigationState?.backTo ?? '/companies';
  const backLabel = navigationState?.backLabel ?? 'Ø¨Ø§Ø²Ú¯Ø´Øª Ø¨Ù‡ Ø´Ø±Ú©Øªâ€ŒÙ‡Ø§';
  const { companyId = '' } = useParams<{ companyId: string }>();
  const user = useAuthStore((state) => state.user);
  const { data: company, isLoading, isError } = useCompany(companyId);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const canEditCompany = can(user, 'company:update', ['ADMIN', 'MANAGER', 'REP']);
  const canAssignOwner = can(user, 'company:change-owner', ['ADMIN', 'MANAGER']);
  const canArchiveCompany = can(user, 'company:archive', ['ADMIN', 'MANAGER']);

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
        <Alert severity="error" sx={{ mb: 2 }}>Ø¯Ø±ÛŒØ§ÙØª Ø§Ø·Ù„Ø§Ø¹Ø§Øª Ø´Ø±Ú©Øª Ø¨Ø§ Ø®Ø·Ø§ Ù…ÙˆØ§Ø¬Ù‡ Ø´Ø¯.</Alert>
        <Button onClick={() => navigate(backTo)}>{backLabel}</Button>
      </Box>
    );
  }

  const priorityLabel = getPriorityLabel(company.priority);
  const archived = isCompanyArchived(company);

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
              {company.brandName || 'Ø¨Ø¯ÙˆÙ† Ù†Ø§Ù… Ø¨Ø±Ù†Ø¯'}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Chip label={priorityLabel} color="secondary" variant="outlined" />
              <Chip label={`Ù…Ø§Ù„Ú©: ${company.owner?.fullName || 'Ø¨Ø¯ÙˆÙ† Ù…Ø§Ù„Ú©'}`} variant="outlined" />
              {archived && <Chip label="Ø¨Ø§ÛŒÚ¯Ø§Ù†ÛŒâ€ŒØ´Ø¯Ù‡" color="warning" />}
            </Stack>
          </Box>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(backTo)}>
            {backLabel}
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
              {canEditCompany && !archived && (
                <Button variant="contained" onClick={() => setEditOpen(true)}>
                  ÙˆÛŒØ±Ø§ÛŒØ´ Ø§Ø·Ù„Ø§Ø¹Ø§Øª Ø´Ø±Ú©Øª
                </Button>
              )}
              {canAssignOwner && !archived && (
                <Button variant="outlined" onClick={() => setOwnerOpen(true)}>
                  ØªØ®ØµÛŒØµ Ù…Ø§Ù„Ú©
                </Button>
              )}
              {canEditCompany && !archived && (
                <Button variant="outlined" onClick={() => setPriorityOpen(true)}>
                  ØªØºÛŒÛŒØ± Ø§ÙˆÙ„ÙˆÛŒØª
                </Button>
              )}
              {canArchiveCompany && (archived
                ? <Button color="success" variant="outlined" onClick={() => setRestoreOpen(true)}>Ø¨Ø§Ø²ÛŒØ§Ø¨ÛŒ</Button>
                : <Button color="warning" variant="outlined" onClick={() => setArchiveOpen(true)}>Ø¨Ø§ÛŒÚ¯Ø§Ù†ÛŒ</Button>)}
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="Ù†Ø§Ù… Ø­Ù‚ÙˆÙ‚ÛŒ" value={company.legalName} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="Ù†Ø§Ù… Ø¨Ø±Ù†Ø¯" value={company.brandName} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="ØµÙ†Ø¹Øª" value={company.industry} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="Ù†ÙˆØ¹ Ù…Ø§Ù„Ú©ÛŒØª" value={getOwnershipLabel(company.ownership)} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="Ø§ÙˆÙ„ÙˆÛŒØª" value={priorityLabel} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="Ù…Ø§Ù„Ú©" value={company.owner?.fullName} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="ØªÛŒÙ… Ù…Ø§Ù„Ú©" value={getTeamName(company.owner?.team)} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="Ø´Ù‡Ø± Ø¯ÙØªØ± Ù…Ø±Ú©Ø²ÛŒ" value={company.headOfficeCity} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="ÙˆØ¨â€ŒØ³Ø§ÛŒØª" value={company.website} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="Ù…Ù†Ø¨Ø¹" value={company.source} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="ØªØ§Ø±ÛŒØ® Ø§ÛŒØ¬Ø§Ø¯" value={formatDateTime(company.createdAt)} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="Ø¢Ø®Ø±ÛŒÙ† Ø¨Ø±ÙˆØ²Ø±Ø³Ø§Ù†ÛŒ" value={formatDateTime(company.updatedAt)} /></Grid>
              {archived && <><Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="ØªØ§Ø±ÛŒØ® Ø¨Ø§ÛŒÚ¯Ø§Ù†ÛŒ" value={formatDateTime(company.archivedAt)} /></Grid><Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="Ø¯Ù„ÛŒÙ„ Ø¨Ø§ÛŒÚ¯Ø§Ù†ÛŒ" value={company.archiveReason} /></Grid></>}
            </Grid>
          </Paper>
          <Alert
            severity="info"
            action={
              <Button color="inherit" size="small" onClick={() => setActiveTab('opportunities')}>
                Ù…Ø´Ø§Ù‡Ø¯Ù‡ ÙØ±ØµØªâ€ŒÙ‡Ø§ÛŒ ÙØ±ÙˆØ´
              </Button>
            }
          >
            Ù…Ø±Ø­Ù„Ù‡ ÙØ±ÙˆØ´ Ø§Ø² Ø·Ø±ÛŒÙ‚ ÙØ±ØµØªâ€ŒÙ‡Ø§ÛŒ ÙØ±ÙˆØ´ Ø§ÛŒÙ† Ø´Ø±Ú©Øª Ù…Ø¯ÛŒØ±ÛŒØª Ù…ÛŒâ€ŒØ´ÙˆØ¯.
          </Alert>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 3 }}>اطلاعات ثبتی و حقوقی</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="شماره ثبت" value={company.registrationNumber} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="شناسه ملی" value={company.nationalId} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="کد اقتصادی" value={company.economicCode} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="تاریخ تاسیس" value={formatDate(company.establishmentDate)} /></Grid>
            </Grid>
          </Paper>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 3 }}>وضعیت و اندازه شرکت</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="وضعیت فعالیت" value={getActivityStatusLabel(company.activityStatus)} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="سرمایه ثبتی" value={formatNumber(company.registeredCapital)} /></Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}><DetailItem label="تعداد پرسنل" value={formatNumber(company.employeeCount)} /></Grid>
            </Grid>
          </Paper>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ mb: 3 }}>ساختار مالکیتی</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">شرکت‌های مادر</Typography>
                <CompanyLinks companies={company.parentCompanies} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">شرکت‌های زیرمجموعه</Typography>
                <CompanyLinks companies={company.subsidiaryCompanies} />
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      ) : activeTab === 'people' ? (
        <PeopleTab companyId={company.id} />
      ) : activeTab === 'opportunities' ? (
        <CompanyOpportunitiesTab companyId={company.id} />
      ) : activeTab === 'tasks' ? (
        <CompanyTasksTab companyId={company.id} companyName={company.brandName || company.legalName} />
      ) : activeTab === 'activities' ? (
        <ActivitiesTab companyId={company.id} />
      ) : activeTab === 'call-card' ? (
        <CallCardTab companyId={company.id} />
      ) : activeTab === 'legal-documents' ? (
        <CompanyLegalDocumentsTab companyId={company.id} />
      ) : activeTab === 'branches' ? (
        <CompanyBranchesTab companyId={company.id} />
      ) : activeTab === 'social-channels' ? (
        <CompanySocialChannelsTab companyId={company.id} />
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', minHeight: 220 }}>
          <Typography variant="h6">
            {detailTabs.find((tab) => tab.value === activeTab)?.label}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Ø§ÛŒÙ† Ø¨Ø®Ø´ Ø¨Ø±Ø§ÛŒ Ù¾ÛŒØ§Ø¯Ù‡â€ŒØ³Ø§Ø²ÛŒ Ø¯Ø± Ù…Ø±Ø­Ù„Ù‡ Ø¨Ø¹Ø¯ Ø¢Ù…Ø§Ø¯Ù‡ Ø´Ø¯Ù‡ Ø§Ø³Øª.
          </Typography>
        </Paper>
      )}

      {canEditCompany && (
        <EditCompanyDialog company={company} open={editOpen} onClose={() => setEditOpen(false)} />
      )}
      {canArchiveCompany && <ArchiveCompanyDialog companyId={company.id} companyName={company.legalName} open={archiveOpen} onClose={() => setArchiveOpen(false)} onSuccess={() => navigate('/companies')} />}
      {canArchiveCompany && <RestoreCompanyDialog companyId={company.id} companyName={company.legalName} open={restoreOpen} onClose={() => setRestoreOpen(false)} />}

      {canAssignOwner && (
        <ChangeCompanyOwnerDialog
          key={company.ownerId ?? 'no-owner'}
          companyId={company.id}
          currentOwnerId={company.ownerId}
          open={ownerOpen}
          onOpenChange={setOwnerOpen}
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
