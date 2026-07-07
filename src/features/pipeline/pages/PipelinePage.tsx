import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import { COMPANY_PRIORITY_OPTIONS, type Priority } from '@/features/companies/types/company.types';
import { useRuntimePipelineStages } from '@/features/pipelineConfig/hooks/usePipelineConfig';
import type { Opportunity } from '@/features/opportunities/types/opportunity.types';
import ChangeOpportunityStageDialog from '@/features/opportunities/components/ChangeOpportunityStageDialog';
import PipelineColumn from '../components/PipelineColumn';
import { pipelineQueryKeys, usePipeline } from '../hooks/usePipeline';

export default function PipelinePage() {
  const user = useAuthStore((s) => s.user);
  const canView = can(user, 'opportunity:view');
  const canChangeStage = can(user, 'opportunity:change-stage');

  const client = useQueryClient();

  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<Priority | ''>('');
  const [selected, setSelected] = useState<Opportunity | null>(null);

  const debounced = useDebouncedValue(search.trim(), 400);
  const stageQuery = useRuntimePipelineStages(canView);
  const stages = useMemo(
    () =>
      (stageQuery.data ?? [])
        .filter((s) => s.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [stageQuery.data]
  );

  const queries = usePipeline(
    stages.map((s) => s.id),
    priority || undefined,
    debounced || undefined
  );

  const total = queries.reduce((sum, q) => sum + (q.data?.meta.total ?? 0), 0);

  if (!canView) {
    return (
      <Alert severity="warning">
        دسترسی مشاهده پایپ‌لاین فرصت‌ها فعال نیست.
      </Alert>
    );
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack sx={{ mb: 3 }}>
        <Typography variant="h4">پایپ‌لاین فروش</Typography>
        <Typography color="text.secondary">
          مدیریت فرصت‌های فروش؛ شرکت به‌عنوان حساب مرجع نمایش داده می‌شود.
        </Typography>
      </Stack>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="جستجوی فرصت یا شرکت"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel>اولویت</InputLabel>
            <Select
              label="اولویت"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority | '')}
            >
              <MenuItem value="">همه</MenuItem>
              {COMPANY_PRIORITY_OPTIONS.map((p) => (
                <MenuItem key={p.value} value={p.value}>
                  {p.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => client.invalidateQueries({ queryKey: pipelineQueryKeys.all })}
          >
            به‌روزرسانی
          </Button>
        </Stack>
      </Paper>

      {stageQuery.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          دریافت مراحل پایپ‌لاین انجام نشد.
        </Alert>
      )}

      {queries.some((q) => q.isError) && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          دریافت برخی ستون‌های فرصت‌ها انجام نشد.
        </Alert>
      )}

      <Stack
        direction="row"
        spacing={2}
        sx={{ overflowX: 'auto', pb: 2, alignItems: 'stretch' }}
      >
        {stages.map((stage, i) => (
          <PipelineColumn
            key={stage.id}
            stage={stage}
            query={queries[i]}
            canChangeStage={canChangeStage}
            onChangeStage={setSelected}
          />
        ))}
      </Stack>

      <Typography variant="caption">
        مجموع فرصت‌ها: {total.toLocaleString('fa-IR')}
      </Typography>

      {selected && (
        <ChangeOpportunityStageDialog
          opportunity={selected}
          open
          onClose={() => setSelected(null)}
        />
      )}
    </Box>
  );
}