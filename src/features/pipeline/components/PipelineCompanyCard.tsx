import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatDateTime, getPriorityLabel } from '@/features/companies/utils/companyDisplay';
import type { CompanyListItem } from '@/features/companies/types/company.types';

function value(input?: string | null): string {
  return input?.trim() || '—';
}

interface Props {
  company: CompanyListItem;
  canChangeStage: boolean;
  onChangeStage: (company: CompanyListItem) => void;
}

export default function PipelineCompanyCard({ company, canChangeStage, onChangeStage }: Props) {
  const navigate = useNavigate();
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.25}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{company.legalName}</Typography>
          <Typography variant="body2" color="text.secondary">برند: {value(company.brandName)}</Typography>
          <Typography variant="body2">صنعت: {value(company.industry)}</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip size="small" label={`اولویت: ${getPriorityLabel(company.priority)}`} />
            <Typography variant="caption">مالک: {value(company.owner?.fullName)}</Typography>
          </Stack>
          <Typography variant="caption">شهر: {value(company.headOfficeCity)}</Typography>
          <Typography variant="caption" color="text.secondary">آخرین بروزرسانی: {formatDateTime(company.updatedAt)}</Typography>
          <Stack direction="row" spacing={0.5} sx={{ pt: 0.5 }}>
            <Button size="small" onClick={() => navigate(`/companies/${company.id}`, { state: { backTo: '/pipeline', backLabel: 'بازگشت به پایپ‌لاین' } })}>مشاهده جزئیات</Button>
            {canChangeStage && <Button size="small" onClick={() => onChangeStage(company)}>تغییر مرحله</Button>}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
