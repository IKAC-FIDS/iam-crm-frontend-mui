import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { formatDateTime, getPriorityLabel } from '@/features/companies/utils/companyDisplay';

import type { Opportunity } from '../types/opportunity.types';

const show = (value?: string | null) => value?.trim() || '—';

export default function OpportunityCard({
  opportunity,
  canChangeStage,
  onChangeStage,
}: {
  opportunity: Opportunity;
  canChangeStage: boolean;
  onChangeStage: (item: Opportunity) => void;
}) {
  const navigate = useNavigate();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {opportunity.title}
          </Typography>

          <Typography variant="body2">
            شرکت: {show(opportunity.company?.brandName || opportunity.company?.legalName)}
          </Typography>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Chip size="small" label={`اولویت: ${getPriorityLabel(opportunity.priority)}`} />

            <Typography variant="caption">
              مالک: {show(opportunity.owner?.fullName)}
            </Typography>
          </Stack>

          <Typography variant="caption">
            تاریخ بسته‌شدن:{' '}
            {opportunity.expectedCloseDate ? formatDateTime(opportunity.expectedCloseDate) : '—'}
          </Typography>

          <Typography variant="caption">
            ارزش تخمینی:{' '}
            {opportunity.estimatedValue == null
              ? '—'
              : Number(opportunity.estimatedValue).toLocaleString('fa-IR')}
          </Typography>

          <Stack direction="row">
            <Button
              size="small"
              onClick={() =>
                navigate(`/opportunities/${opportunity.id}`, {
                  state: {
                    backTo: '/pipeline',
                    backLabel: 'بازگشت به پایپ‌لاین',
                  },
                })
              }
            >
              مشاهده
            </Button>

            <Button
              size="small"
              onClick={() =>
                navigate(`/companies/${opportunity.companyId}`, {
                  state: {
                    backTo: '/pipeline',
                    backLabel: 'بازگشت به پایپ‌لاین',
                  },
                })
              }
            >
              مشاهده شرکت
            </Button>

            {canChangeStage && (
              <Button size="small" onClick={() => onChangeStage(opportunity)}>
                تغییر مرحله
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
