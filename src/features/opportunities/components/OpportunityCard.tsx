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
    <Card variant="outlined" sx={{ minWidth: 0 }}>
      <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 } }}>
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.45 }}>
            {opportunity.title}
          </Typography>

          <Typography variant="caption" color="text.secondary" noWrap title={show(opportunity.company?.brandName || opportunity.company?.legalName)}>
            شرکت: {show(opportunity.company?.brandName || opportunity.company?.legalName)}
          </Typography>

          {opportunity.primaryContact?.fullName && (
            <Typography variant="caption" color="text.secondary" noWrap title={opportunity.primaryContact.fullName}>
              مخاطب: {opportunity.primaryContact.fullName}
            </Typography>
          )}

          <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <Chip size="small" label={getPriorityLabel(opportunity.priority)} sx={{ height: 22 }} />
            <Typography variant="caption">مالک: {show(opportunity.owner?.fullName)}</Typography>
          </Stack>

          <Typography variant="caption" color="text.secondary">
            بسته‌شدن:{' '}
            {opportunity.expectedCloseDate ? formatDateTime(opportunity.expectedCloseDate) : '—'}
          </Typography>

          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            ارزش:{' '}
            {opportunity.estimatedValue == null
              ? '—'
              : Number(opportunity.estimatedValue).toLocaleString('fa-IR')}
          </Typography>

          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', mt: 0.25, '& .MuiButton-root': { minWidth: 0, px: 0.75 } }}>
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
