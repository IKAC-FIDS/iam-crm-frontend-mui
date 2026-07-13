import { useMemo, useState } from 'react';
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { toast } from 'sonner';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import { RowActions } from '@/shared/components/RowActions';
import { useCatalog, useDeleteCatalogItem } from '../hooks/useCatalogs';
import { getCatalogItemLabel, isCatalogItemActive } from '../types/catalog.types';
import { LOOKUP_GROUP_LABELS, LOOKUP_GROUPS } from '../types/catalog.types';
import type { CatalogItem, CatalogKind, LookupGroup } from '../types/catalog.types';
import CatalogItemDialog from './CatalogItemDialog';

export default function CatalogTab({ kind }: { kind: CatalogKind }) {
  const [group, setGroup] = useState<LookupGroup>('teams');
  const lookupGroup = kind === 'lookupOptions' ? group : undefined;
  const query = useCatalog(kind, true, { group: lookupGroup, includeInactive: true });
  const remove = useDeleteCatalogItem(kind, lookupGroup);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [deleting, setDeleting] = useState<CatalogItem | null>(null);
  const columns = useMemo<GridColDef<CatalogItem>[]>(() => [
    { field: 'displayName', headerName: 'عنوان', minWidth: 180, flex: 1, valueGetter: (_value, row) => getCatalogItemLabel(row) },
    ...(kind === 'lookupOptions' || kind === 'leadSources' ? [{ field: 'code', headerName: 'کد', minWidth: 150 }] as GridColDef<CatalogItem>[] : []),
    ...(kind === 'painPoints' || kind === 'useCases' ? [{ field: 'category', headerName: 'دسته‌بندی', minWidth: 150, valueFormatter: (value) => value || '—' }] as GridColDef<CatalogItem>[] : []),
    { field: 'description', headerName: 'توضیحات', minWidth: 220, flex: 1, valueFormatter: (value) => value || '—' },
    { field: 'status', headerName: 'وضعیت', minWidth: 100, renderCell: ({ row }: GridRenderCellParams<CatalogItem>) => <Chip size="small" color={isCatalogItemActive(row) ? 'success' : 'default'} label={isCatalogItemActive(row) ? 'فعال' : 'غیرفعال'} /> },
    { field: 'updatedAt', headerName: 'آخرین بروزرسانی', minWidth: 180, valueFormatter: formatDateTime },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 104,
      width: 104,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridRenderCellParams<CatalogItem>) => (
        <RowActions
          actions={[
            {
              key: 'edit',
              label: 'ویرایش',
              icon: <EditOutlinedIcon fontSize="small" />,
              onClick: () => {
                setEditing(row);
                setFormOpen(true);
              },
            },
            {
              key: 'delete',
              label: 'حذف',
              icon: <DeleteOutlineIcon fontSize="small" />,
              color: 'error',
              onClick: () => setDeleting(row),
            },
          ]}
        />
      ),
    },
  ], [kind]);

  const confirmDelete = async () => {
    if (!deleting) return;
    try { await remove.mutateAsync(deleting.id); toast.success('آیتم با موفقیت حذف شد.'); setDeleting(null); }
    catch { toast.error('حذف آیتم با خطا مواجه شد.'); }
  };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  return <Stack spacing={2}>{kind === 'lookupOptions' && <FormControl sx={{ maxWidth: 320 }}><InputLabel id="lookup-group-label">گروه گزینه‌ها</InputLabel><Select labelId="lookup-group-label" label="گروه گزینه‌ها" value={group} onChange={(event) => { setGroup(event.target.value as LookupGroup); setEditing(null); setFormOpen(false); }}>{LOOKUP_GROUPS.map((item) => <MenuItem key={item} value={item}>{LOOKUP_GROUP_LABELS[item]}</MenuItem>)}</Select></FormControl>}<Stack direction="row" sx={{ justifyContent: 'flex-end' }}><Button onClick={() => query.refetch()}>بروزرسانی</Button><Button variant="contained" onClick={() => setFormOpen(true)}>افزودن آیتم</Button></Stack>{query.isError && <Alert severity="error">خطا در دریافت اطلاعات کتابخانه.</Alert>}<Paper><DataGrid autoHeight rows={query.data ?? []} columns={columns} loading={query.isLoading} hideFooter localeText={{ noRowsLabel: 'هنوز آیتمی ثبت نشده است.' }} sx={{ border: 0, minHeight: 340 }} /></Paper><CatalogItemDialog key={`${kind}-${lookupGroup ?? 'none'}-${editing?.id ?? 'new'}`} kind={kind} group={lookupGroup} item={editing} open={formOpen} onClose={closeForm} /><Dialog open={Boolean(deleting)} onClose={() => !remove.isPending && setDeleting(null)}><DialogTitle>حذف آیتم</DialogTitle><DialogContent>آیا از حذف «{deleting ? getCatalogItemLabel(deleting) : ''}» مطمئن هستید؟</DialogContent><DialogActions><Button onClick={() => setDeleting(null)} disabled={remove.isPending}>انصراف</Button><Button color="error" variant="contained" onClick={confirmDelete} disabled={remove.isPending}>حذف</Button></DialogActions></Dialog></Stack>;
}
