import { Alert, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';
import type { CompanyListItem, PaginatedResult, PipelineStage } from '@/features/companies/types/company.types';
import { getStageLabel } from '@/features/companies/utils/companyDisplay';
import PipelineCompanyCard from './PipelineCompanyCard';

interface Props {
  stage: PipelineStage;
  query: UseQueryResult<PaginatedResult<CompanyListItem>, Error>;
  canChangeStage: boolean;
  onChangeStage: (company: CompanyListItem) => void;
}

export default function PipelineColumn({ stage, query, canChangeStage, onChangeStage }: Props) {
  const companies = query.data?.data ?? [];
  const total = query.data?.meta.total ?? companies.length;
  return (
    <Paper sx={{ width: 310, minWidth: 310, p: 2, bgcolor: 'background.default', alignSelf: 'stretch' }}>
      <Stack spacing={2} sx={{ height: '100%' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{getStageLabel(stage)} — {total.toLocaleString('fa-IR')}</Typography>
        {query.isLoading ? (
          <Stack sx={{ minHeight: 140, alignItems: 'center', justifyContent: 'center' }} spacing={1}><CircularProgress size={26} /><Typography variant="body2">در حال دریافت...</Typography></Stack>
        ) : query.isError ? (
          <Alert severity="error">خطا در دریافت این مرحله.</Alert>
        ) : companies.length ? (
          <Stack spacing={1.5}>{companies.map((company) => <PipelineCompanyCard key={company.id} company={company} canChangeStage={canChangeStage} onChangeStage={onChangeStage} />)}</Stack>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}><Typography variant="body2" color="text.secondary">شرکتی در این مرحله نیست.</Typography></Box>
        )}
        {total > companies.length && <Typography variant="caption" color="text.secondary">نمایش {companies.length.toLocaleString('fa-IR')} مورد از {total.toLocaleString('fa-IR')}</Typography>}
      </Stack>
    </Paper>
  );
}
