import { useMemo, useState } from 'react';
import { Alert, Box, Button, Chip, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { usePipelineStages } from '../hooks/usePipelineConfig';
import type { PipelineStageConfig } from '../types/pipelineConfig.types';
import StageConfigDialog from './StageConfigDialog';

export default function StagesConfigTab() {
  const query = usePipelineStages();
  const [editing, setEditing] = useState<PipelineStageConfig | null>(null);
  const columns = useMemo<GridColDef<PipelineStageConfig>[]>(() => [
    { field: 'label', headerName: 'عنوان', minWidth: 180, flex: 1 },
    { field: 'code', headerName: 'کد', minWidth: 180 },
    { field: 'description', headerName: 'توضیح', minWidth: 220, flex: 1, valueFormatter: (value) => value || '—' },
    { field: 'sortOrder', headerName: 'ترتیب نمایش', minWidth: 110 },
    { field: 'color', headerName: 'رنگ', minWidth: 100, renderCell: ({ value }) => <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: value || 'transparent', border: 1, borderColor: 'divider' }} />{value || '—'}</Box> },
    { field: 'isActive', headerName: 'وضعیت', minWidth: 100, renderCell: ({ value }) => <Chip size="small" color={value ? 'success' : 'default'} label={value ? 'فعال' : 'غیرفعال'} /> },
    { field: 'isTerminal', headerName: 'مرحله پایانی', minWidth: 110, valueFormatter: (value) => value ? 'بله' : 'خیر' },
    { field: 'actions', headerName: 'عملیات', minWidth: 100, sortable: false, renderCell: ({ row }: GridRenderCellParams<PipelineStageConfig>) => <Button size="small" onClick={() => setEditing(row)}>ویرایش</Button> },
  ], []);
  return <>{query.isError && <Alert severity="error" sx={{ mb: 2 }}>خطا در دریافت تنظیمات مراحل.</Alert>}<Paper><DataGrid autoHeight rows={query.data ?? []} columns={columns} loading={query.isLoading} hideFooter localeText={{ noRowsLabel: 'هیچ مرحله‌ای از Backend دریافت نشد.' }} sx={{ border: 0, minHeight: 360 }} /></Paper>{editing && <StageConfigDialog key={editing.id} stage={editing} open onClose={() => setEditing(null)} />}</>;
}
