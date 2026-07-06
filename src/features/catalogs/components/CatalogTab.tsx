import { useMemo, useState } from 'react';
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { toast } from 'sonner';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import { useCatalog, useDeleteCatalogItem } from '../hooks/useCatalogs';
import { getCatalogItemLabel, isCatalogItemActive } from '../types/catalog.types';
import type { CatalogItem, CatalogKind } from '../types/catalog.types';
import CatalogItemDialog from './CatalogItemDialog';

export default function CatalogTab({ kind }: { kind: CatalogKind }) {
  const query = useCatalog(kind);
  const remove = useDeleteCatalogItem(kind);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [deleting, setDeleting] = useState<CatalogItem | null>(null);
  const columns = useMemo<GridColDef<CatalogItem>[]>(() => [
    { field: 'displayName', headerName: 'عنوان', minWidth: 180, flex: 1, valueGetter: (_value, row) => getCatalogItemLabel(row) },
    ...(kind === 'lookupOptions' ? [{ field: 'category', headerName: 'دسته‌بندی', minWidth: 150 }, { field: 'value', headerName: 'مقدار', minWidth: 150 }] as GridColDef<CatalogItem>[] : []),
    { field: 'description', headerName: 'توضیحات', minWidth: 220, flex: 1, valueFormatter: (value) => value || '—' },
    { field: 'status', headerName: 'وضعیت', minWidth: 100, renderCell: ({ row }: GridRenderCellParams<CatalogItem>) => <Chip size="small" color={isCatalogItemActive(row) ? 'success' : 'default'} label={isCatalogItemActive(row) ? 'فعال' : 'غیرفعال'} /> },
    { field: 'updatedAt', headerName: 'آخرین بروزرسانی', minWidth: 180, valueFormatter: formatDateTime },
    { field: 'actions', headerName: 'عملیات', minWidth: 150, sortable: false, renderCell: ({ row }: GridRenderCellParams<CatalogItem>) => <Stack direction="row"><Button size="small" onClick={() => { setEditing(row); setFormOpen(true); }}>ویرایش</Button><Button size="small" color="error" onClick={() => setDeleting(row)}>حذف</Button></Stack> },
  ], [kind]);

  const confirmDelete = async () => {
    if (!deleting) return;
    try { await remove.mutateAsync(deleting.id); toast.success('آیتم با موفقیت حذف شد.'); setDeleting(null); }
    catch { toast.error('حذف آیتم با خطا مواجه شد.'); }
  };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  return <Stack spacing={2}><Stack direction="row" sx={{ justifyContent: 'flex-end' }}><Button onClick={() => query.refetch()}>بروزرسانی</Button><Button variant="contained" onClick={() => setFormOpen(true)}>افزودن آیتم</Button></Stack>{query.isError && <Alert severity="error">خطا در دریافت اطلاعات کتابخانه.</Alert>}<Paper><DataGrid autoHeight rows={query.data ?? []} columns={columns} loading={query.isLoading} hideFooter localeText={{ noRowsLabel: 'هنوز آیتمی ثبت نشده است.' }} sx={{ border: 0, minHeight: 340 }} /></Paper><CatalogItemDialog key={`${kind}-${editing?.id ?? 'new'}`} kind={kind} item={editing} open={formOpen} onClose={closeForm} /><Dialog open={Boolean(deleting)} onClose={() => !remove.isPending && setDeleting(null)}><DialogTitle>حذف آیتم</DialogTitle><DialogContent>آیا از حذف «{deleting ? getCatalogItemLabel(deleting) : ''}» مطمئن هستید؟</DialogContent><DialogActions><Button onClick={() => setDeleting(null)} disabled={remove.isPending}>انصراف</Button><Button color="error" variant="contained" onClick={confirmDelete} disabled={remove.isPending}>حذف</Button></DialogActions></Dialog></Stack>;
}
