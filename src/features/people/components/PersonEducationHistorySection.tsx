import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { normalizeDateDigits } from '@/shared/utils/jalaliDate';
import {
  useCreatePersonEducationHistory,
  useDeletePersonEducationHistory,
  usePersonEducationHistory,
  useUpdatePersonEducationHistory,
} from '../hooks/usePeople';
import type { PersonEducationHistory } from '../types/person.types';

function EducationDialog({ personId, item, onClose }: { personId: string; item?: PersonEducationHistory; onClose: () => void }) {
  const [degree, setDegree] = useState(item?.degree ?? '');
  const [university, setUniversity] = useState(item?.university ?? '');
  const [year, setYear] = useState(item?.year?.toString() ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [attempted, setAttempted] = useState(false);
  const create = useCreatePersonEducationHistory(personId);
  const update = useUpdatePersonEducationHistory(personId, item?.id ?? '');
  const normalizedYear = normalizeDateDigits(year).trim();
  const yearNumber = normalizedYear ? Number(normalizedYear) : undefined;
  const yearError = normalizedYear && (!Number.isInteger(yearNumber) || Number(yearNumber) < 1000 || Number(yearNumber) > 3000)
    ? 'سال باید یک عدد صحیح بین ۱۰۰۰ تا ۳۰۰۰ باشد.' : undefined;
  const meaningful = Boolean(degree.trim() || university.trim() || normalizedYear || description.trim());
  const pending = create.isPending || update.isPending;
  const submit = async () => {
    setAttempted(true);
    if (!meaningful || yearError) return;
    const payload = { degree: degree.trim() || undefined, university: university.trim() || undefined,
      year: yearNumber, description: description.trim() || undefined };
    try {
      if (item) await update.mutateAsync(payload); else await create.mutateAsync(payload);
      toast.success(item ? 'سابقه تحصیلی بروزرسانی شد.' : 'سابقه تحصیلی ایجاد شد.'); onClose();
    } catch (error) { toast.error(getApiErrorMessage(error, 'ذخیره سابقه تحصیلی انجام نشد.')); }
  };
  return <Dialog open onClose={() => !pending && onClose()} fullWidth maxWidth="sm">
    <DialogTitle>{item ? 'ویرایش سابقه تحصیلی' : 'افزودن سابقه تحصیلی'}</DialogTitle>
    <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
      {(create.isError || update.isError) && <Alert severity="error">ذخیره سابقه تحصیلی با خطا مواجه شد.</Alert>}
      {attempted && !meaningful && <Alert severity="warning">حداقل یکی از فیلدهای مدرک، دانشگاه، سال یا توضیحات را وارد کنید.</Alert>}
      <TextField label="مدرک" value={degree} onChange={(event) => setDegree(event.target.value)} />
      <TextField label="دانشگاه" value={university} onChange={(event) => setUniversity(event.target.value)} />
      <TextField label="سال" value={year} error={Boolean(yearError)} helperText={yearError}
        slotProps={{ htmlInput: { inputMode: 'numeric', dir: 'ltr' } }} onChange={(event) => setYear(event.target.value)} />
      <TextField label="توضیحات" multiline minRows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
    </Stack></DialogContent>
    <DialogActions><Button onClick={onClose} disabled={pending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={pending}>ذخیره</Button></DialogActions>
  </Dialog>;
}

export default function PersonEducationHistorySection({ personId, canManage }: { personId: string; canManage: boolean }) {
  const query = usePersonEducationHistory(personId);
  const remove = useDeletePersonEducationHistory(personId);
  const [formItem, setFormItem] = useState<PersonEducationHistory | null | undefined>();
  const [deleting, setDeleting] = useState<PersonEducationHistory>();
  const confirmDelete = async () => {
    if (!deleting) return;
    try { await remove.mutateAsync(deleting.id); toast.success('سابقه تحصیلی حذف شد.'); setDeleting(undefined); }
    catch (error) { toast.error(getApiErrorMessage(error, 'حذف سابقه تحصیلی انجام نشد.')); }
  };
  return <Paper variant="outlined" sx={{ p: 2 }}>
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Typography variant="h6">سوابق تحصیلی</Typography>
      {canManage && <Button size="small" onClick={() => setFormItem(null)}>افزودن سابقه تحصیلی</Button>}
    </Stack>
    {query.isLoading ? <Typography>در حال دریافت...</Typography> : query.isError ? <Alert severity="error">خطا در دریافت سوابق تحصیلی.</Alert>
      : !query.data?.length ? <Typography color="text.secondary">سابقه تحصیلی ثبت نشده است.</Typography>
        : <Stack spacing={1.5}>{query.data.map((education) => <Paper key={education.id} variant="outlined" sx={{ p: 1.5 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}><Box>
            <Typography sx={{ fontWeight: 700 }}>{education.degree || 'مدرک ثبت نشده'}</Typography>
            <Typography variant="body2">دانشگاه: {education.university || '—'}</Typography>
            <Typography variant="body2">سال: {education.year ?? '—'}</Typography>
            {education.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{education.description}</Typography>}
          </Box>{canManage && <Box><IconButton size="small" aria-label="ویرایش سابقه تحصیلی" onClick={() => setFormItem(education)}><EditIcon /></IconButton>
            <IconButton size="small" color="error" aria-label="حذف سابقه تحصیلی" onClick={() => setDeleting(education)}><DeleteIcon /></IconButton></Box>}</Stack>
        </Paper>)}</Stack>}
    {formItem !== undefined && <EducationDialog personId={personId} item={formItem ?? undefined} onClose={() => setFormItem(undefined)} />}
    <Dialog open={Boolean(deleting)} onClose={() => setDeleting(undefined)}><DialogTitle>حذف سابقه تحصیلی</DialogTitle>
      <DialogContent><Typography>آیا از حذف این سابقه تحصیلی مطمئن هستید؟</Typography></DialogContent>
      <DialogActions><Button onClick={() => setDeleting(undefined)}>انصراف</Button><Button color="error" variant="contained" onClick={confirmDelete} disabled={remove.isPending}>حذف</Button></DialogActions></Dialog>
  </Paper>;
}
