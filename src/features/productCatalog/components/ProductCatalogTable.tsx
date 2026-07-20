import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from '@mui/x-data-grid';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { can } from '@/features/auth/utils/permissions';
import { useAuthStore } from '@/store/authStore';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import { formatIrrPrice } from '@/features/opportunityLineItems/utils/money';
import { RowActions } from '@/shared/components/RowActions';
import {
  useActivateProductCatalogItem,
  useDeactivateProductCatalogItem,
  useProductCatalog,
} from '../hooks/useProductCatalog';
import type { ProductCatalogItem } from '../types/productCatalog.types';
import ProductCatalogFormDialog from './ProductCatalogFormDialog';

type ActiveFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

export default function ProductCatalogTable() {
  const user = useAuthStore((state) => state.user);
  const canManage = can(user, 'product:manage', ['ADMIN']);
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [active, setActive] = useState<ActiveFilter>('ALL');
  const [editing, setEditing] = useState<ProductCatalogItem | null | undefined>(undefined);
  const debouncedSearch = useDebouncedValue(search.trim(), 400);
  const debouncedCategory = useDebouncedValue(category.trim(), 400);
  const query = useProductCatalog({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    category: debouncedCategory || undefined,
    active: active === 'ALL' ? undefined : active === 'ACTIVE',
  });
  const activate = useActivateProductCatalogItem();
  const deactivate = useDeactivateProductCatalogItem();
  const togglePending = activate.isPending || deactivate.isPending;

  const toggleActive = useCallback(async (item: ProductCatalogItem) => {
    try {
      if (item.isActive) await deactivate.mutateAsync(item.id);
      else await activate.mutateAsync(item.id);
      toast.success(item.isActive ? 'محصول غیرفعال شد.' : 'محصول فعال شد.');
    } catch {
      toast.error('تغییر وضعیت محصول انجام نشد.');
    }
  }, [activate, deactivate]);

  const columns = useMemo<GridColDef<ProductCatalogItem>[]>(() => [
    { field: 'code', headerName: 'کد', minWidth: 130 },
    { field: 'name', headerName: 'نام محصول', minWidth: 180, flex: 1 },
    { field: 'category', headerName: 'دسته‌بندی', minWidth: 150, valueFormatter: (value) => value || '—' },
    { field: 'unit', headerName: 'واحد', minWidth: 100, valueFormatter: (value) => value || '—' },
    {
      field: 'inPersonPriceIrr',
      headerName: 'قیمت حضوری',
      minWidth: 160,
      valueFormatter: (value) => formatIrrPrice(value),
    },
    { field: 'digikalaPriceIrr', headerName: 'قیمت دیجی‌کالا', minWidth: 170, valueFormatter: (value) => formatIrrPrice(value) },
    {
      field: 'isActive',
      headerName: 'وضعیت',
      minWidth: 110,
      renderCell: ({ row }: GridRenderCellParams<ProductCatalogItem>) => (
        <Chip size="small" color={row.isActive ? 'success' : 'default'} label={row.isActive ? 'فعال' : 'غیرفعال'} />
      ),
    },
    { field: 'sortOrder', headerName: 'ترتیب', minWidth: 90 },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 112,
      width: 112,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }: GridRenderCellParams<ProductCatalogItem>) => (
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
              key: 'active-toggle',
              label: row.isActive ? 'غیرفعال‌سازی' : 'فعال‌سازی',
              icon: row.isActive ? <BlockOutlinedIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />,
              color: row.isActive ? 'warning' : 'success',
              disabled: !canManage || togglePending,
              onClick: () => toggleActive(row),
            },
          ]}
        />
      ),
    },
  ], [canManage, toggleActive, togglePending]);

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField fullWidth label="جستجو" value={search} onChange={(event) => { setSearch(event.target.value); setPagination((p) => ({ ...p, page: 0 })); }} />
          <TextField fullWidth label="دسته‌بندی" value={category} onChange={(event) => { setCategory(event.target.value); setPagination((p) => ({ ...p, page: 0 })); }} />
          <FormControl fullWidth>
            <InputLabel>وضعیت</InputLabel>
            <Select label="وضعیت" value={active} onChange={(event) => { setActive(event.target.value as ActiveFilter); setPagination((p) => ({ ...p, page: 0 })); }}>
              <MenuItem value="ALL">همه</MenuItem>
              <MenuItem value="ACTIVE">فعال</MenuItem>
              <MenuItem value="INACTIVE">غیرفعال</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>
      <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 2 }}>
        <Button onClick={() => query.refetch()}>بروزرسانی</Button>
        {canManage && <Button variant="contained" onClick={() => setEditing(null)}>افزودن محصول</Button>}
      </Stack>
      {query.isError && <Alert severity="error" sx={{ mb: 2 }}>دریافت فهرست محصولات انجام نشد.</Alert>}
      <Paper>
        <DataGrid
          autoHeight
          rows={query.data?.data ?? []}
          columns={columns}
          loading={query.isFetching}
          rowCount={query.data?.meta.total ?? 0}
          paginationMode="server"
          paginationModel={pagination}
          onPaginationModelChange={setPagination}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
          localeText={{ noRowsLabel: 'هنوز محصولی ثبت نشده است.' }}
          sx={{ border: 0, minHeight: 420 }}
        />
      </Paper>
      {editing !== undefined && (
        <ProductCatalogFormDialog
          key={editing?.id ?? 'new'}
          item={editing}
          open
          onClose={() => setEditing(undefined)}
        />
      )}
    </Box>
  );
}
