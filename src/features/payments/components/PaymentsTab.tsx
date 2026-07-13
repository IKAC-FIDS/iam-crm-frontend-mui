import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from '@mui/x-data-grid';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AttachmentsTab from '@/features/attachments/components/AttachmentsTab';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { formatDateTime } from '@/features/companies/utils/companyDisplay';
import { formatMoney } from '@/features/opportunityLineItems/utils/money';
import { getCommercialDocumentTypeLabel } from '@/features/commercialDocuments/utils/commercialDocumentDisplay';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { RowActions } from '@/shared/components/RowActions';
import { useDeletePayment, usePayments } from '../hooks/usePayments';
import { getPaymentMethodLabel, getPaymentStatusLabel, paymentStatusOptions } from '../utils/paymentDisplay';
import type { OpportunityPayment, PaymentListParams, PaymentStatus } from '../types/payment.types';
import CancelPaymentDialog from './CancelPaymentDialog';
import MarkPaymentPaidDialog from './MarkPaymentPaidDialog';
import PaymentFormDialog from './PaymentFormDialog';

function documentTitle(payment: OpportunityPayment): string {
  const doc = payment.commercialDocument;
  if (!doc) return '—';
  return `${getCommercialDocumentTypeLabel(doc.type)} ${doc.number ? doc.number : ''} - ${doc.title ?? ''}`.trim();
}

export default function PaymentsTab({ opportunityId, companyId }: { opportunityId: string; companyId?: string }) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'payment:view', ['ADMIN', 'MANAGER', 'REP', 'BOARDS']);
  const canManage = can(user, 'payment:manage', ['ADMIN', 'MANAGER', 'REP']);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [status, setStatus] = useState<PaymentStatus | ''>('');
  const params: PaymentListParams = { page: pagination.page + 1, limit: pagination.pageSize, status };
  const query = usePayments(opportunityId, params, canView);
  const remove = useDeletePayment(opportunityId, companyId);
  const [editing, setEditing] = useState<OpportunityPayment | null | undefined>(undefined);
  const [markingPaid, setMarkingPaid] = useState<OpportunityPayment | null>(null);
  const [cancelling, setCancelling] = useState<OpportunityPayment | null>(null);
  const [deleting, setDeleting] = useState<OpportunityPayment | null>(null);
  const [attachments, setAttachments] = useState<OpportunityPayment | null>(null);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success('پرداخت حذف شد.');
      setDeleting(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'حذف پرداخت انجام نشد.'));
    }
  };

  const columns = useMemo<GridColDef<OpportunityPayment>[]>(() => [
    { field: 'status', headerName: 'وضعیت', minWidth: 130, valueFormatter: (value) => getPaymentStatusLabel(value) },
    { field: 'amount', headerName: 'مبلغ', minWidth: 150, valueFormatter: (value, row) => formatMoney(value, row.currency) },
    { field: 'dueDate', headerName: 'سررسید', minWidth: 140, valueFormatter: formatDateTime },
    { field: 'paidAt', headerName: 'پرداخت', minWidth: 140, valueFormatter: formatDateTime },
    { field: 'method', headerName: 'روش', minWidth: 130, valueFormatter: (value) => getPaymentMethodLabel(value) },
    { field: 'referenceNumber', headerName: 'پیگیری', minWidth: 140, valueFormatter: (value) => value || '—' },
    { field: 'commercialDocument', headerName: 'سند مرتبط', minWidth: 220, flex: 1, valueGetter: (_value, row) => documentTitle(row) },
    { field: 'createdAt', headerName: 'ایجاد', minWidth: 150, valueFormatter: formatDateTime },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 136,
      width: 136,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridRenderCellParams<OpportunityPayment>) => (
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
              key: 'attachments',
              label: 'پیوست‌ها',
              icon: <AttachFileOutlinedIcon fontSize="small" />,
              onClick: () => setAttachments(row),
            },
            {
              key: 'paid',
              label: 'پرداخت شد',
              icon: <CheckCircleOutlineIcon fontSize="small" />,
              color: 'success',
              disabled: !canManage || row.status === 'PAID' || row.status === 'CANCELLED',
              menuOnly: true,
              onClick: () => setMarkingPaid(row),
            },
            {
              key: 'cancel',
              label: 'لغو',
              icon: <CancelOutlinedIcon fontSize="small" />,
              color: 'warning',
              disabled: !canManage || row.status === 'CANCELLED',
              menuOnly: true,
              onClick: () => setCancelling(row),
            },
            {
              key: 'delete',
              label: 'حذف',
              icon: <DeleteOutlineIcon fontSize="small" />,
              color: 'error',
              disabled: !canManage || remove.isPending,
              menuOnly: true,
              onClick: () => setDeleting(row),
            },
          ]}
        />
      ),
    },
  ], [canManage, remove.isPending]);

  if (!canView) return <Alert severity="warning">دسترسی مشاهده پرداخت‌ها فعال نیست.</Alert>;

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField fullWidth select label="وضعیت" value={status} onChange={(event) => { setStatus(event.target.value as PaymentStatus | ''); setPagination((p) => ({ ...p, page: 0 })); }}><MenuItem value="">همه</MenuItem>{paymentStatusOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</TextField>
      </Stack>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">پرداخت‌ها</Typography>
        {canManage && <Button variant="contained" onClick={() => setEditing(null)}>افزودن پرداخت</Button>}
      </Stack>
      {query.isError && <Alert severity="error">دریافت پرداخت‌ها انجام نشد.</Alert>}
      <Paper>
        <DataGrid autoHeight rows={query.data?.data ?? []} columns={columns} loading={query.isFetching} rowCount={query.data?.meta.total ?? 0} paginationMode="server" paginationModel={pagination} onPaginationModelChange={setPagination} pageSizeOptions={[5, 10, 20, 50]} disableRowSelectionOnClick localeText={{ noRowsLabel: 'هنوز پرداختی برای این فرصت ثبت نشده است.' }} sx={{ border: 0, minHeight: 360 }} />
      </Paper>
      {editing !== undefined && <PaymentFormDialog key={editing?.id ?? 'new'} opportunityId={opportunityId} companyId={companyId} payment={editing} open onClose={() => setEditing(undefined)} />}
      {markingPaid && <MarkPaymentPaidDialog key={markingPaid.id} opportunityId={opportunityId} companyId={companyId} payment={markingPaid} open onClose={() => setMarkingPaid(null)} />}
      {cancelling && <CancelPaymentDialog key={cancelling.id} opportunityId={opportunityId} companyId={companyId} payment={cancelling} open onClose={() => setCancelling(null)} />}
      <Dialog open={Boolean(attachments)} onClose={() => setAttachments(null)} fullWidth maxWidth="md"><DialogTitle>پیوست‌های پرداخت</DialogTitle><DialogContent>{attachments && <AttachmentsTab entityType="PAYMENT" entityId={attachments.id} title="پیوست‌های پرداخت" emptyMessage="هنوز پیوستی برای این پرداخت ثبت نشده است." />}</DialogContent><DialogActions><Button onClick={() => setAttachments(null)}>بستن</Button></DialogActions></Dialog>
      <Dialog open={Boolean(deleting)} onClose={() => !remove.isPending && setDeleting(null)}><DialogTitle>حذف پرداخت</DialogTitle><DialogContent>آیا از حذف این پرداخت مطمئن هستید؟</DialogContent><DialogActions><Button onClick={() => setDeleting(null)} disabled={remove.isPending}>انصراف</Button><Button color="error" variant="contained" onClick={confirmDelete} disabled={remove.isPending}>حذف</Button></DialogActions></Dialog>
    </Stack>
  );
}
