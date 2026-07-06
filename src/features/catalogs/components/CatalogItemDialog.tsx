import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { toast } from 'sonner';
import { useCreateCatalogItem, useUpdateCatalogItem } from '../hooks/useCatalogs';
import { getCatalogItemLabel, isCatalogItemActive } from '../types/catalog.types';
import type { CatalogItem, CatalogKind, CatalogPayload } from '../types/catalog.types';

export default function CatalogItemDialog({ kind, item, open, onClose }: { kind: CatalogKind; item: CatalogItem | null; open: boolean; onClose: () => void }) {
  const create = useCreateCatalogItem(kind);
  const update = useUpdateCatalogItem(kind);
  const [name, setName] = useState(item ? getCatalogItemLabel(item) : '');
  const [value, setValue] = useState(item?.value ?? '');
  const [category, setCategory] = useState(item?.category ?? item?.type ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [isActive, setIsActive] = useState(item ? isCatalogItemActive(item) : true);
  const lookup = kind === 'lookupOptions';
  const pending = create.isPending || update.isPending;

  const submit = async () => {
    const payload: CatalogPayload = lookup
      ? { label: name.trim(), value: value.trim(), category: category.trim(), description: description.trim() || undefined, isActive }
      : { name: name.trim(), description: description.trim() || undefined, isActive };
    try {
      if (item) await update.mutateAsync({ id: item.id, payload });
      else await create.mutateAsync(payload);
      toast.success(item ? 'آیتم با موفقیت بروزرسانی شد.' : 'آیتم با موفقیت ایجاد شد.');
      onClose();
    } catch { toast.error(item ? 'خطا در بروزرسانی آیتم.' : 'خطا در ایجاد آیتم.'); }
  };

  const valid = name.trim() && (!lookup || (value.trim() && category.trim()));
  return <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="sm"><DialogTitle>{item ? 'ویرایش آیتم' : 'افزودن آیتم'}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>{(create.isError || update.isError) && <Alert severity="error">عملیات با خطا مواجه شد.</Alert>}<TextField autoFocus required label={lookup ? 'عنوان نمایشی' : 'نام'} value={name} onChange={(event) => setName(event.target.value)} />{lookup && <><TextField required label="مقدار" value={value} onChange={(event) => setValue(event.target.value)} /><TextField required label="دسته‌بندی" value={category} onChange={(event) => setCategory(event.target.value)} helperText="برای نمونه: department یا personaTag" /></>}<TextField label="توضیحات" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} /><FormControlLabel label="فعال" control={<Switch checked={isActive} onChange={(_, checked) => setIsActive(checked)} />} /></Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={pending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={!valid || pending}>ذخیره</Button></DialogActions></Dialog>;
}
