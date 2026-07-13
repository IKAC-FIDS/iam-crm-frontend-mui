import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { can } from '@/features/auth/utils/permissions';
import { RowActions } from '@/shared/components/RowActions';
import { useAuthStore } from '@/store/authStore';
import { useDeleteOpportunityLineItem, useOpportunityLineItems } from '../hooks/useOpportunityLineItems';
import type { OpportunityLineItem } from '../types/opportunityLineItem.types';
import { formatMoney } from '../utils/money';
import OpportunityLineItemFormDialog from './OpportunityLineItemFormDialog';

function itemTitle(item: OpportunityLineItem): string {
  const code = item.product?.code ?? item.productCodeSnapshot;
  const name = item.product?.name ?? item.productNameSnapshot;
  if (code && name) return `${code} - ${name}`;
  return name ?? code ?? item.description ?? '—';
}

export default function OpportunityLineItemsTab({
  opportunityId,
  companyId,
  currency,
}: {
  opportunityId: string;
  companyId?: string;
  currency?: string | null;
}) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'opportunity-line-item:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const canManage = can(user, 'opportunity-line-item:manage', ['ADMIN', 'MANAGER', 'REP']);
  const query = useOpportunityLineItems(opportunityId, canView);
  const remove = useDeleteOpportunityLineItem(opportunityId, companyId);
  const [editing, setEditing] = useState<OpportunityLineItem | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<OpportunityLineItem | null>(null);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success('آیتم فرصت حذف شد.');
      setDeleting(null);
    } catch {
      toast.error('حذف آیتم فرصت انجام نشد.');
    }
  };

  const columns = useMemo<GridColDef<OpportunityLineItem>[]>(() => [
    { field: 'product', headerName: 'محصول / شرح', minWidth: 220, flex: 1, valueGetter: (_value, row) => itemTitle(row) },
    { field: 'quantity', headerName: 'تعداد', minWidth: 100 },
    {
      field: 'unitPrice',
      headerName: 'قیمت واحد',
      minWidth: 150,
      valueFormatter: (value, row) => formatMoney(value, row.product?.currency ?? currency),
    },
    {
      field: 'discountAmount',
      headerName: 'تخفیف',
      minWidth: 130,
      valueFormatter: (value, row) => formatMoney(value, row.product?.currency ?? currency),
    },
    {
      field: 'taxAmount',
      headerName: 'مالیات',
      minWidth: 130,
      valueFormatter: (value, row) => formatMoney(value, row.product?.currency ?? currency),
    },
    {
      field: 'lineTotal',
      headerName: 'جمع خط',
      minWidth: 150,
      valueFormatter: (value, row) => formatMoney(value, row.product?.currency ?? currency),
    },
    { field: 'currency', headerName: 'ارز', minWidth: 90, valueGetter: (_value, row) => row.product?.currency ?? currency ?? '—' },
    { field: 'sortOrder', headerName: 'ترتیب', minWidth: 90 },
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
      renderCell: ({ row }: GridRenderCellParams<OpportunityLineItem>) => (
        <RowActions
          actions={[
            {
              key: 'edit',
              label: 'ویرایش',
              icon: <EditOutlinedIcon fontSize="small" />,
              disabled: !canManage,
              onClick: () => setEditing(row),
            },
            {
              key: 'delete',
              label: 'حذف',
              icon: <DeleteOutlineIcon fontSize="small" />,
              color: 'error',
              disabled: !canManage || remove.isPending,
              onClick: () => setDeleting(row),
            },
          ]}
        />
      ),
    },
  ], [canManage, currency, remove.isPending]);

  if (!canView) return <Alert severity="warning">دسترسی مشاهده آیتم‌های فرصت فعال نیست.</Alert>;

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">آیتم‌های فرصت</Typography>
        {canManage && <Button variant="contained" onClick={() => setEditing(null)}>افزودن آیتم</Button>}
      </Stack>
      {query.isError && <Alert severity="error">دریافت آیتم‌های فرصت انجام نشد.</Alert>}
      <Paper>
        <DataGrid
          autoHeight
          rows={query.data ?? []}
          columns={columns}
          loading={query.isLoading}
          hideFooter
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'هنوز آیتمی برای این فرصت ثبت نشده است.' }}
          sx={{ border: 0, minHeight: 340 }}
        />
      </Paper>
      {editing !== undefined && (
        <OpportunityLineItemFormDialog
          key={editing?.id ?? 'new'}
          opportunityId={opportunityId}
          companyId={companyId}
          item={editing}
          currency={currency}
          open
          onClose={() => setEditing(undefined)}
        />
      )}
      <Dialog open={Boolean(deleting)} onClose={() => !remove.isPending && setDeleting(null)}>
        <DialogTitle>حذف آیتم فرصت</DialogTitle>
        <DialogContent>آیا از حذف «{deleting ? itemTitle(deleting) : ''}» مطمئن هستید؟</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)} disabled={remove.isPending}>انصراف</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={remove.isPending}>حذف</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
