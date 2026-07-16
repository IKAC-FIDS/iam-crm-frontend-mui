import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel, GridRenderCellParams } from '@mui/x-data-grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { can } from '@/features/auth/utils/permissions';
import { RowActions } from '@/shared/components/RowActions';
import { useAuthStore } from '@/store/authStore';
import { useCatalog } from '@/features/catalogs/hooks/useCatalogs';
import { getLookupLabel, isCatalogItemActive } from '@/features/catalogs/types/catalog.types';
import PersonDetailDrawer from './PersonDetailDrawer';
import PersonFormDialog from './PersonFormDialog';
import { useDeletePerson, usePeople } from '../hooks/usePeople';
import { getContactTypeLabel, type Person } from '../types/person.types';
interface PeopleTabProps {
  companyId: string;
}
function primaryContactSummary(person: Person): string {
  const contacts = person.contacts ?? [];

  const primary = contacts.find((item) => item.isPrimary && item.value?.trim());

  if (primary) {
    return `${getContactTypeLabel(primary.type)}: ${primary.value}`;
  }

  const fallback = contacts.find((item) => item.value?.trim());

  if (fallback) {
    return `${getContactTypeLabel(fallback.type)}: ${fallback.value}`;
  }

  return '—';
}


export default function PeopleTab({ companyId }: PeopleTabProps) {
  const user = useAuthStore((state) => state.user);
  const canView = can(user, 'person:view', ['ADMIN', 'MANAGER', 'REP']);
  const canCreate = can(user, 'person:create', ['ADMIN', 'MANAGER', 'REP']);
  const canEdit = can(user, 'person:update', ['ADMIN', 'MANAGER', 'REP']);
  const canDelete = can(user, 'person:delete', ['ADMIN', 'MANAGER']);
  const canManageContacts = can(user, 'person:update', ['ADMIN', 'MANAGER', 'REP']);
  const canManageSocials = can(user, 'person:update', ['ADMIN', 'MANAGER', 'REP']);
  const departments = (useCatalog('lookupOptions', canView, { group: 'departments' }).data ?? []).filter(isCatalogItemActive);
  const jobTitles = (useCatalog('lookupOptions', canView, { group: 'job-titles' }).data ?? []).filter(isCatalogItemActive);
  const personaRoles = (useCatalog('lookupOptions', canView, { group: 'persona-roles' }).data ?? []).filter(isCatalogItemActive);
  const seniorityLevels = (useCatalog('lookupOptions', canView, { group: 'seniority-levels' }).data ?? []).filter(isCatalogItemActive);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [detailPersonId, setDetailPersonId] = useState('');
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null);
  const peopleQuery = usePeople({
    companyId,
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize as 5 | 10 | 20,
  });
  const deletePerson = useDeletePerson(companyId);

  const columns = useMemo<GridColDef<Person>[]>(() => [
    { field: 'fullName', headerName: 'نام', minWidth: 170, flex: 1 },
    { field: 'jobTitle', headerName: 'سمت سازمانی', minWidth: 150, flex: 0.7, valueGetter: (_value, row) => getLookupLabel(jobTitles, row.jobTitle ?? row.title) },
    { field: 'department', headerName: 'دپارتمان', minWidth: 130, flex: 0.7, valueGetter: (_value, row) => getLookupLabel(departments, row.department) },
    { field: 'personaRole', headerName: 'نقش پرسونا', minWidth: 170, valueGetter: (_value, row) => getLookupLabel(personaRoles, row.personaRole ?? row.personaTag) },
    { field: 'seniorityLevel', headerName: 'سطح ارشدیت', minWidth: 125, valueGetter: (_value, row) => getLookupLabel(seniorityLevels, row.seniorityLevel) },
    {
      field: 'isPrimaryContact',
      headerName: 'مخاطب اصلی',
      minWidth: 115,
      renderCell: ({ value }: GridRenderCellParams<Person, boolean>) =>
        value ? <Chip size="small" color="primary" label="بله" /> : '—',
    },
    {
      field: 'isSecondaryContact',
      headerName: 'مخاطب دوم',
      minWidth: 105,
      renderCell: ({ value }: GridRenderCellParams<Person, boolean>) => value ? 'بله' : '—',
    },
    // { field: 'email', headerName: 'ایمیل', minWidth: 190, flex: 0.8 },
    // { field: 'phone', headerName: 'تلفن', minWidth: 140 },
    {
      field: 'primaryContactSummary',
      headerName: 'راه تماس اصلی',
      minWidth: 220,
      flex: 0.9,
      valueGetter: (_value, row) => primaryContactSummary(row),
    },
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
      renderCell: ({ row }: GridRenderCellParams<Person>) => (
        <RowActions
          actions={[
            {
              key: 'view',
              label: 'مشاهده جزئیات',
              icon: <VisibilityOutlinedIcon fontSize="small" />,
              onClick: () => setDetailPersonId(row.id),
            },
            {
              key: 'edit',
              label: 'ویرایش',
              icon: <EditOutlinedIcon fontSize="small" />,
              visible: canEdit,
              onClick: () => {
                setSelectedPerson(row);
                setFormMode('edit');
                setFormOpen(true);
              },
            },
            {
              key: 'delete',
              label: 'حذف',
              icon: <DeleteOutlineIcon fontSize="small" />,
              color: 'error',
              visible: canDelete,
              menuOnly: true,
              onClick: () => setDeletingPerson(row),
            },
          ]}
        />
      ),
    },
  ], [canDelete, canEdit, departments, jobTitles, personaRoles, seniorityLevels]);

  if (!canView) {
    return <Alert severity="warning">دسترسی مشاهده افراد برای این حساب فعال نیست.</Alert>;
  }

  const confirmDelete = async () => {
    if (!deletingPerson) return;
    try {
      await deletePerson.mutateAsync(deletingPerson.id);
      toast.success('شخص با موفقیت حذف شد.');
      setDeletingPerson(null);
    } catch {
      toast.error('خطا در حذف شخص.');
    }
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack direction="row" sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">افراد شرکت</Typography>
        {canCreate && (
          <Button variant="contained" onClick={() => { setSelectedPerson(null); setFormMode('create'); setFormOpen(true); }}>
            افزودن شخص
          </Button>
        )}
      </Stack>

      {peopleQuery.isError && <Alert severity="error" sx={{ mb: 2 }}>خطا در دریافت افراد شرکت.</Alert>}
      {peopleQuery.isFetching && <Typography color="text.secondary" sx={{ mb: 1 }}>در حال دریافت افراد...</Typography>}

      <Paper sx={{ overflow: 'hidden' }}>
        <DataGrid
          autoHeight
          rows={peopleQuery.data?.data ?? []}
          columns={columns}
          loading={peopleQuery.isFetching}
          rowCount={peopleQuery.data?.meta.total ?? 0}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => setPaginationModel({
            page: model.pageSize !== paginationModel.pageSize ? 0 : model.page,
            pageSize: model.pageSize,
          })}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'هنوز شخصی برای این شرکت ثبت نشده است.' }}
          sx={{ border: 0, minHeight: 360 }}
        />
      </Paper>

      <PersonFormDialog
        mode={formMode}
        companyId={companyId}
        person={selectedPerson}
        open={formOpen}
        onClose={() => setFormOpen(false)}
      />
      <PersonDetailDrawer
        personId={detailPersonId}
        open={Boolean(detailPersonId)}
        onClose={() => setDetailPersonId('')}
        canManageContacts={canManageContacts}
        canManageSocials={canManageSocials}
        canManageHistories={canEdit}
      />

      <Dialog open={Boolean(deletingPerson)} onClose={() => setDeletingPerson(null)} fullWidth maxWidth="xs">
        <DialogTitle>حذف شخص</DialogTitle>
        <DialogContent>
          <Typography>آیا از حذف این شخص مطمئن هستید؟</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            با حذف شخص، اطلاعات مرتبط با او نیز ممکن است حذف یا غیرقابل دسترس شود.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingPerson(null)} disabled={deletePerson.isPending}>انصراف</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deletePerson.isPending}>
            {deletePerson.isPending ? 'در حال حذف...' : 'حذف'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
