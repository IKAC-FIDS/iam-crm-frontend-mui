import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '@/components/dashboard/Header';
import { useCompany } from '../hooks/useCompanies';
import {
  companyPriorityLabels,
  companyStageLabels,
  isCompanyPriority,
  isCompanyStage,
} from '../types/company.types';

interface DetailItemProps {
  label: string;
  value?: string | null;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ mt: 0.5 }}>
        {value?.trim() || '—'}
      </Typography>
    </Box>
  );
}

export default function CompanyDetailsPage() {
  const navigate = useNavigate();
  const { companyId = '' } = useParams<{ companyId: string }>();
  const { data: company, isLoading, isError } = useCompany(companyId);

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
        <Alert severity="error" sx={{ mb: 2 }}>
          دریافت اطلاعات شرکت با خطا مواجه شد.
        </Alert>
        <Button onClick={() => navigate('/companies')}>بازگشت به شرکت‌ها</Button>
      </Box>
    );
  }

  const stageLabel =
    company.stage && isCompanyStage(company.stage)
      ? companyStageLabels[company.stage]
      : company.stage;
  const priorityLabel =
    company.priority && isCompanyPriority(company.priority)
      ? companyPriorityLabels[company.priority]
      : company.priority;

  return (
    <Box sx={{ width: '100%' }}>
      <Header />
      <Stack
        direction="row"
        sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant="h5">{company.legalName}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/companies')}>
          بازگشت
        </Button>
      </Stack>

      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DetailItem label="نام حقوقی" value={company.legalName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DetailItem label="نام برند" value={company.brandName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DetailItem label="صنعت" value={company.industry} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DetailItem label="مرحله" value={stageLabel} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DetailItem label="اولویت" value={priorityLabel} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DetailItem label="مالک" value={company.owner?.fullName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <DetailItem label="شهر دفتر مرکزی" value={company.headOfficeCity} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
