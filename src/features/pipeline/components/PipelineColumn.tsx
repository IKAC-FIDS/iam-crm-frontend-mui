import { Alert, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import type { UseQueryResult } from '@tanstack/react-query';

import OpportunityCard from '@/features/opportunities/components/OpportunityCard';
import type {
  Opportunity,
  OpportunityPage,
} from '@/features/opportunities/types/opportunity.types';
import type { PipelineStageConfig } from '@/features/pipelineConfig/types/pipelineConfig.types';

export default function PipelineColumn({
  stage,
  query,
  canChangeStage,
  onChangeStage,
}: {
  stage: PipelineStageConfig;
  query: UseQueryResult<OpportunityPage, Error>;
  canChangeStage: boolean;
  onChangeStage: (item: Opportunity) => void;
}) {
  const items = query.data?.data ?? [];
  const total = query.data?.meta.total ?? items.length;

  return (
    <Paper
      sx={{
        width: '100%',
        minWidth: 0,
        height: { xs: 520, md: 'clamp(520px, calc(100vh - 260px), 640px)' },
        p: 1.5,
        bgcolor: 'background.default',
        borderTop: 4,
        borderTopColor: stage.color || 'primary.main',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, mb: 1.25 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={stage.label}>
          {stage.label}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
          {total.toLocaleString('fa-IR')} فرصت
        </Typography>
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', pe: 0.5 }}>
        {query.isLoading ? (
          <Stack sx={{ alignItems: 'center', py: 5 }}>
            <CircularProgress size={26} />
          </Stack>
        ) : query.isError ? (
          <Alert severity="error">
            خطا در دریافت فرصت‌های این مرحله.
          </Alert>
        ) : items.length ? (
          <Stack spacing={1}>
            {items.map((item) => (
              <OpportunityCard
                key={item.id}
                opportunity={item}
                canChangeStage={canChangeStage}
                onChangeStage={onChangeStage}
              />
            ))}
          </Stack>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              فرصتی در این وضعیت وجود ندارد.
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
