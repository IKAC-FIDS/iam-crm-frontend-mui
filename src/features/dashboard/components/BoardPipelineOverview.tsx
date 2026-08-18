import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';

import { opportunitiesService } from '@/features/opportunities/services/opportunities.service';
import type { Opportunity } from '@/features/opportunities/types/opportunity.types';
import { formatIrrPrice } from '@/features/opportunityLineItems/utils/money';
import { useRuntimePipelineStages } from '@/features/pipelineConfig/hooks/usePipelineConfig';
import { formatJalaliDateTime } from '@/shared/utils/jalaliDate';

const BOARD_PIPELINE_LIMIT = 100;

function companyName(opportunity: Opportunity): string {
  return (
    opportunity.company?.brandName?.trim() ||
    opportunity.company?.legalName?.trim() ||
    '—'
  );
}

function numericValue(value: Opportunity['estimatedValue']): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function BoardPipelineOverview() {
  const stageQuery = useRuntimePipelineStages(true);

  const stages = useMemo(
    () =>
      (stageQuery.data ?? [])
        .filter((stage) => stage.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [stageQuery.data],
  );

  const queries = useQueries({
    queries: stages.map((stage) => ({
      queryKey: ['board-dashboard-pipeline', stage.id, BOARD_PIPELINE_LIMIT],
      queryFn: () =>
        opportunitiesService.list({
          stageId: stage.id,
          page: 1,
          limit: BOARD_PIPELINE_LIMIT,
          ownershipScope: 'all',
        }),
      staleTime: 60_000,
    })),
  });

  const rows = useMemo(
    () =>
      stages.flatMap((stage, index) => {
        const opportunities = queries[index]?.data?.data ?? [];

        return opportunities
          .map((opportunity) => ({
            stage,
            opportunity,
          }))
          .sort(
            (a, b) =>
              numericValue(b.opportunity.estimatedValue) -
              numericValue(a.opportunity.estimatedValue),
          );
      }),
    [queries, stages],
  );

  if (stageQuery.isLoading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Stack sx={{ alignItems: 'center', py: 3 }}>
          <CircularProgress size={28} />
        </Stack>
      </Paper>
    );
  }

  if (stageQuery.isError) {
    return (
      <Alert severity="error">
        دریافت مراحل پایپ‌لاین فروش انجام نشد.
      </Alert>
    );
  }

  const queryError = queries.some((query) => query.isError);
  const queryLoading = queries.some((query) => query.isLoading);
  const isTruncated = stages.some((_, index) => {
    const page = queries[index]?.data;
    return page ? page.meta.total > page.data.length : false;
  });

  return (
    <Box>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h5">نمای اجرایی پایپ‌لاین فروش</Typography>
        <Typography variant="body2" color="text.secondary">
          نمای فقط‌خواندنی برای هیئت‌مدیره؛ شرکت، مرحله و ارزش فرصت‌ها بدون عملیات اجرایی نمایش داده می‌شود.
        </Typography>
      </Stack>

      {queryError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          دریافت اطلاعات برخی مراحل پایپ‌لاین کامل انجام نشد.
        </Alert>
      )}

      {isTruncated && (
        <Alert severity="info" sx={{ mb: 2 }}>
          در مرحله‌هایی با بیش از {BOARD_PIPELINE_LIMIT.toLocaleString('fa-IR')} فرصت، جزئیات فقط برای {BOARD_PIPELINE_LIMIT.toLocaleString('fa-IR')} فرصت اول نمایش داده می‌شود.
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {stages.map((stage, index) => {
          const page = queries[index]?.data;
          const items = page?.data ?? [];
          const total = page?.meta.total ?? 0;
          const totalValue = items.reduce(
            (sum, item) => sum + numericValue(item.estimatedValue),
            0,
          );
          const complete = total <= items.length;

          return (
            <Grid key={stage.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  height: '100%',
                  borderTop: 4,
                  borderTopColor: stage.color || 'primary.main',
                }}
              >
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {stage.label}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${total.toLocaleString('fa-IR')} فرصت`}
                    />
                  </Stack>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {complete ? 'ارزش مرحله' : 'ارزش موارد نمایش‌داده‌شده'}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 0.25 }}>
                      {formatIrrPrice(totalValue)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell>شرکت</TableCell>
              <TableCell>فرصت</TableCell>
              <TableCell>مرحله</TableCell>
              <TableCell align="right">ارزش</TableCell>
              <TableCell align="center">احتمال موفقیت</TableCell>
              <TableCell>تاریخ بستن</TableCell>
              <TableCell>مالک</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {queryLoading && rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Stack sx={{ alignItems: 'center', py: 4 }}>
                    <CircularProgress size={26} />
                  </Stack>
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map(({ stage, opportunity }) => (
                <TableRow key={opportunity.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {companyName(opportunity)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {opportunity.title}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={stage.label}
                      sx={{
                        borderInlineStart: 3,
                        borderInlineStartColor: stage.color || 'primary.main',
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {opportunity.estimatedValue == null
                        ? '—'
                        : formatIrrPrice(opportunity.estimatedValue)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    {opportunity.probability == null
                      ? '—'
                      : `${Number(opportunity.probability).toLocaleString('fa-IR')}٪`}
                  </TableCell>

                  <TableCell>
                    {opportunity.expectedCloseDate
                      ? formatJalaliDateTime(opportunity.expectedCloseDate)
                      : '—'}
                  </TableCell>

                  <TableCell>
                    {opportunity.owner?.fullName?.trim() || '—'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography
                    color="text.secondary"
                    sx={{ py: 4, textAlign: 'center' }}
                  >
                    فرصتی در پایپ‌لاین وجود ندارد.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
