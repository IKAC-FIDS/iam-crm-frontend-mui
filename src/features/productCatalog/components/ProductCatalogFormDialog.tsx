import { useState } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import { useCreateProductCatalogItem, useUpdateProductCatalogItem } from '../hooks/useProductCatalog';
import type { ProductCatalogItem, CreateProductCatalogItemPayload } from '../types/productCatalog.types';

export default function ProductCatalogFormDialog({
  item,
  open,
  onClose,
}: {
  item: ProductCatalogItem | null;
  open: boolean;
  onClose: () => void;
}) {
  const create = useCreateProductCatalogItem();
  const update = useUpdateProductCatalogItem();
  const [code, setCode] = useState(item?.code ?? '');
  const [name, setName] = useState(item?.name ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [category, setCategory] = useState(item?.category ?? '');
  const [unit, setUnit] = useState(item?.unit ?? '');
  const [defaultUnitPrice, setDefaultUnitPrice] = useState(String(item?.defaultUnitPrice ?? '0'));
  const [currency, setCurrency] = useState(item?.currency ?? 'IRR');
  const [sortOrder, setSortOrder] = useState(String(item?.sortOrder ?? 0));
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const pending = create.isPending || update.isPending;

  const payload = (): CreateProductCatalogItemPayload => ({
    code: code.trim(),
    name: name.trim(),
    description: description.trim() || undefined,
    category: category.trim() || undefined,
    unit: unit.trim() || undefined,
    defaultUnitPrice: defaultUnitPrice.trim() || '0',
    currency: currency.trim() || 'IRR',
    sortOrder: Number(sortOrder) || 0,
    isActive,
  });

  const submit = async () => {
    try {
      if (item) await update.mutateAsync({ id: item.id, payload: payload() });
      else await create.mutateAsync(payload());
      toast.success(item ? 'محصول با موفقیت بروزرسانی شد.' : 'محصول با موفقیت ایجاد شد.');
      onClose();
    } catch {
      toast.error(item ? 'بروزرسانی محصول انجام نشد.' : 'ایجاد محصول انجام نشد.');
    }
  };

  const valid = Boolean(code.trim()) && Boolean(name.trim()) && Number.isFinite(Number(sortOrder));

  return (
    <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{item ? 'ویرایش محصول' : 'افزودن محصول'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {(create.isError || update.isError) && <Alert severity="error">عملیات محصول با خطا مواجه شد.</Alert>}
          <TextField autoFocus required label="کد محصول" value={code} onChange={(event) => setCode(event.target.value)} />
          <TextField required label="نام محصول" value={name} onChange={(event) => setName(event.target.value)} />
          <TextField label="توضیحات" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
          <TextField label="دسته‌بندی" value={category} onChange={(event) => setCategory(event.target.value)} />
          <TextField label="واحد" value={unit} onChange={(event) => setUnit(event.target.value)} />
          <TextField label="قیمت پیش‌فرض" inputMode="decimal" value={defaultUnitPrice} onChange={(event) => setDefaultUnitPrice(event.target.value)} />
          <TextField label="ارز" value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} />
          <TextField required label="ترتیب نمایش" type="number" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} />
          <FormControlLabel label="فعال" control={<Switch checked={isActive} onChange={(_, checked) => setIsActive(checked)} />} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={!valid || pending}>ذخیره</Button>
      </DialogActions>
    </Dialog>
  );
}
