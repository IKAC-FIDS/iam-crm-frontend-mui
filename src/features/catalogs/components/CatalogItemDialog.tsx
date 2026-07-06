import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { toast } from 'sonner';
import { useCreateCatalogItem, useUpdateCatalogItem } from '../hooks/useCatalogs';
import type { CatalogItem, CatalogKind, CatalogPayload, LookupGroup } from '../types/catalog.types';

export default function CatalogItemDialog({ kind, group, item, open, onClose }: { kind: CatalogKind; group?: LookupGroup; item: CatalogItem | null; open: boolean; onClose: () => void }) {
  const create = useCreateCatalogItem(kind, group); const update = useUpdateCatalogItem(kind, group);
  const [primary, setPrimary] = useState(item?.label ?? ''); const [code, setCode] = useState(item?.code ?? ''); const [description, setDescription] = useState(item?.description ?? '');
  const [category, setCategory] = useState(item?.category ?? ''); const [sortOrder, setSortOrder] = useState(String(item?.sortOrder ?? 0)); const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [defaultPainPoint, setDefaultPainPoint] = useState(item?.defaultPainPoint ?? ''); const [defaultUseCase, setDefaultUseCase] = useState(item?.defaultUseCase ?? ''); const [notes, setNotes] = useState(item?.notes ?? '');
  const pending = create.isPending || update.isPending;
  const coded = kind === 'leadSources' || kind === 'lookupOptions'; const categorized = kind === 'painPoints' || kind === 'useCases'; const persona = kind === 'personas';
  const payload = (): CatalogPayload => {
    if (kind === 'industries') return { name: primary.trim(), description: description.trim() || undefined };
    if (kind === 'leadSources') return { code: code.trim(), name: primary.trim(), description: description.trim() || undefined, isActive, sortOrder: Number(sortOrder) };
    if (kind === 'painPoints' || kind === 'useCases') return { title: primary.trim(), description: description.trim() || undefined, category: category.trim() || undefined };
    if (kind === 'personas') return { titlePattern: primary.trim(), defaultPainPoint: defaultPainPoint.trim() || undefined, defaultUseCase: defaultUseCase.trim() || undefined, notes: notes.trim() || undefined };
    return { code: code.trim(), label: primary.trim(), description: description.trim() || undefined, isActive, sortOrder: Number(sortOrder) };
  };
  const submit = async () => { try { if (item) await update.mutateAsync({ id: item.id, payload: payload() }); else await create.mutateAsync(payload()); toast.success(item ? 'آیتم با موفقیت بروزرسانی شد.' : 'آیتم با موفقیت ایجاد شد.'); onClose(); } catch { toast.error(item ? 'خطا در بروزرسانی آیتم.' : 'خطا در ایجاد آیتم.'); } };
  const valid = Boolean(primary.trim()) && (!coded || Boolean(code.trim())) && (!coded || Number.isInteger(Number(sortOrder)));
  return <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="sm"><DialogTitle>{item ? 'ویرایش آیتم' : 'افزودن آیتم'}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>{(create.isError || update.isError) && <Alert severity="error">عملیات با خطا مواجه شد.</Alert>}<TextField autoFocus required label={persona ? 'الگوی عنوان' : kind === 'lookupOptions' ? 'عنوان نمایشی' : 'عنوان'} value={primary} onChange={(event) => setPrimary(event.target.value)} />{coded && <TextField required label="کد" value={code} onChange={(event) => setCode(event.target.value)} />}{!persona && <TextField label="توضیحات" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} />}{categorized && <TextField label="دسته‌بندی" value={category} onChange={(event) => setCategory(event.target.value)} />}{persona && <><TextField label="نقطه درد پیش‌فرض" value={defaultPainPoint} onChange={(event) => setDefaultPainPoint(event.target.value)} /><TextField label="کاربرد پیش‌فرض" value={defaultUseCase} onChange={(event) => setDefaultUseCase(event.target.value)} /><TextField label="یادداشت‌ها" multiline minRows={2} value={notes} onChange={(event) => setNotes(event.target.value)} /></>}{coded && <><TextField required label="ترتیب نمایش" type="number" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} /><FormControlLabel label="فعال" control={<Switch checked={isActive} onChange={(_, checked) => setIsActive(checked)} />} /></>}</Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={pending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={!valid || pending}>ذخیره</Button></DialogActions></Dialog>;
}
