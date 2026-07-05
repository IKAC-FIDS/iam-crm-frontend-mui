import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import { companyQueryKeys } from '@/features/companies/hooks/useCompanies';
import ChangeCompanyStageDialog from '@/features/companies/components/ChangeCompanyStageDialog';
import { COMPANY_PRIORITY_OPTIONS, COMPANY_STAGES } from '@/features/companies/types/company.types';
import type { CompanyListItem, Priority } from '@/features/companies/types/company.types';
import PipelineColumn from '../components/PipelineColumn';
import { pipelineQueryKeys, usePipeline } from '../hooks/usePipeline';

export default function PipelinePage() {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'company:view', ['ADMIN', 'MANAGER', 'REP']);
  const canChangeStage = can(user, 'company:change-stage', ['ADMIN', 'MANAGER', 'REP']);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<Priority | ''>('');
  const [selectedCompany, setSelectedCompany] = useState<CompanyListItem | null>(null);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);
  const queries = usePipeline(priority || undefined, debouncedSearch || undefined);
  const isInitialLoading = queries.every((query) => query.isLoading);
  const hasError = queries.some((query) => query.isError);
  const isEmpty = queries.every((query) => !query.isLoading && (query.data?.data.length ?? 0) === 0);
  const isRefreshing = queries.some((query) => query.isFetching);

  const totalCompanies = useMemo(
    () => queries.reduce((total, query) => total + (query.data?.meta.total ?? 0), 0),
    [queries],
  );

  if (!canView) return <Alert severity="warning">دسترسی مشاهده پایپ‌لاین برای این حساب فعال نیست.</Alert>;

  const refreshPipeline = async () => {
    await queryClient.invalidateQueries({ queryKey: pipelineQueryKeys.all });
  };

  const handleStageSuccess = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: pipelineQueryKeys.all }),
      queryClient.invalidateQueries({ queryKey: companyQueryKeys.all }),
    ]);
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4">پایپ‌لاین فروش</Typography>
        <Typography color="text.secondary">مدیریت شرکت‌ها بر اساس مرحله فروش</Typography>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' } }}>
          <TextField fullWidth label="جستجوی شرکت..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <FormControl fullWidth>
            <InputLabel id="pipeline-priority-label">اولویت</InputLabel>
            <Select labelId="pipeline-priority-label" label="اولویت" value={priority} onChange={(event) => setPriority(event.target.value as Priority | '')}>
              <MenuItem value="">همه اولویت‌ها</MenuItem>
              {COMPANY_PRIORITY_OPTIONS.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={refreshPipeline} disabled={isRefreshing} sx={{ minWidth: 140 }}>بروزرسانی</Button>
        </Stack>
      </Paper>

      {hasError && <Alert severity="warning" sx={{ mb: 2 }}>خطا در دریافت اطلاعات یک یا چند ستون پایپ‌لاین؛ سایر ستون‌ها همچنان قابل استفاده‌اند.</Alert>}
      {isInitialLoading && <Typography color="text.secondary" sx={{ mb: 2 }}>در حال دریافت پایپ‌لاین...</Typography>}
      {isEmpty && !hasError && <Alert severity="info" sx={{ mb: 2 }}>هنوز شرکتی در پایپ‌لاین وجود ندارد.</Alert>}

      <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 2, alignItems: 'stretch' }}>
        {COMPANY_STAGES.map((stage, index) => (
          <PipelineColumn key={stage} stage={stage} query={queries[index]} canChangeStage={canChangeStage} onChangeStage={setSelectedCompany} />
        ))}
      </Stack>
      <Typography variant="caption" color="text.secondary">مجموع شرکت‌ها در مراحل: {totalCompanies.toLocaleString('fa-IR')}</Typography>

      {canChangeStage && selectedCompany && (
        <ChangeCompanyStageDialog
          companyId={selectedCompany.id}
          currentStage={selectedCompany.stage}
          open={Boolean(selectedCompany)}
          onOpenChange={(open) => { if (!open) setSelectedCompany(null); }}
          onSuccess={handleStageSuccess}
        />
      )}
    </Box>
  );
}
