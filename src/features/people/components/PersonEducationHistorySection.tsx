import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Alert, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Paper, Stack, TextField, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useCatalog } from '@/features/catalogs/hooks/useCatalogs';
import type { CatalogItem } from '@/features/catalogs/types/catalog.types';
import { getApiErrorMessage } from '@/lib/apiResponse';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { formatJalaliDate } from '@/shared/utils/jalaliDate';
import {
  useCreatePersonEducationHistory,
  useDeletePersonEducationHistory,
  usePersonEducationHistory,
  useUpdatePersonEducationHistory,
} from '../hooks/usePeople';
import {
  getPersonEducationDegreeLabel,
  PERSON_EDUCATION_DEGREE_OPTIONS,
} from '../types/person.types';
import type {
  PersonEducationDegree,
  PersonEducationHistory,
} from '../types/person.types';

function universityOption(id: string, name: string): CatalogItem {
  return { id, name, label: name, value: name, isActive: true };
}

function EducationDialog({ personId, item, onClose }: {
  personId: string;
  item?: PersonEducationHistory;
  onClose: () => void;
}) {
  const [degree, setDegree] = useState<PersonEducationDegree | ''>(item?.degree ?? '');
  const initialUniversity = item?.university
    ? universityOption(item.university.id, item.university.name)
    : null;
  const [university, setUniversity] = useState<CatalogItem | null>(initialUniversity);
  const [educationDate, setEducationDate] = useState(item?.educationDate ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [attempted, setAttempted] = useState(false);
  const universities = useCatalog('universities');
  const create = useCreatePersonEducationHistory(personId);
  const update = useUpdatePersonEducationHistory(personId, item?.id ?? '');
  const options = useMemo(() => {
    const values = (universities.data ?? []).filter((entry) => entry.isActive);
    return university && !values.some((entry) => entry.id === university.id)
      ? [university, ...values]
      : values;
  }, [universities.data, university]);
  const meaningful = Boolean(degree || university || educationDate || description.trim());
  const pending = create.isPending || update.isPending;

  const submit = async () => {
    setAttempted(true);
    if (!meaningful) return;
    const payload = {
      degree: degree || undefined,
      universityId: university?.id,
      educationDate: educationDate || undefined,
      description: description.trim() || undefined,
    };
    try {
      if (item) await update.mutateAsync(payload); else await create.mutateAsync(payload);
      toast.success(item ? 'سابقه تحصیلی بروزرسانی شد.' : 'سابقه تحصیلی ایجاد شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'ذخیره سابقه تحصیلی انجام نشد.'));
    }
  };

  return (
    <Dialog open onClose={() => !pending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{item ? 'ویرایش سابقه تحصیلی' : 'افزودن سابقه تحصیلی'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {(create.isError || update.isError) && <Alert severity="error">ذخیره سابقه تحصیلی با خطا مواجه شد.</Alert>}
          {attempted && !meaningful && <Alert severity="warning">حداقل یکی از فیلدهای مدرک، دانشگاه، تاریخ تحصیل یا توضیحات را وارد کنید.</Alert>}
          <TextField select label="مدرک" value={degree} onChange={(event) => setDegree(event.target.value as PersonEducationDegree | '')}>
            <MenuItem value="">انتخاب نشده</MenuItem>
            {PERSON_EDUCATION_DEGREE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
          {universities.isError && <Alert severity="error">دریافت فهرست دانشگاه‌ها انجام نشد.</Alert>}
          <Autocomplete
            options={options}
            value={university}
            loading={universities.isLoading}
            disabled={universities.isError}
            onChange={(_, value) => setUniversity(value)}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText="دانشگاه فعالی یافت نشد."
            renderInput={(params) => <TextField {...params} label="دانشگاه" placeholder="انتخاب دانشگاه" />}
          />
          <JalaliDateField fullWidth label="تاریخ تحصیل" value={educationDate} onChange={(next) => setEducationDate(next ?? '')} />
          <TextField label="توضیحات" multiline minRows={3} value={description} onChange={(event) => setDescription(event.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={pending}>ذخیره</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function PersonEducationHistorySection({ personId, canManage }: {
  personId: string;
  canManage: boolean;
}) {
  const query = usePersonEducationHistory(personId);
  const remove = useDeletePersonEducationHistory(personId);
  const [formItem, setFormItem] = useState<PersonEducationHistory | null | undefined>();
  const [deleting, setDeleting] = useState<PersonEducationHistory>();

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success('سابقه تحصیلی حذف شد.');
      setDeleting(undefined);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'حذف سابقه تحصیلی انجام نشد.'));
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">سوابق تحصیلی</Typography>
        {canManage && <Button size="small" onClick={() => setFormItem(null)}>افزودن سابقه تحصیلی</Button>}
      </Stack>
      {query.isLoading ? <Typography>در حال دریافت...</Typography>
        : query.isError ? <Alert severity="error">خطا در دریافت سوابق تحصیلی.</Alert>
          : !query.data?.length ? <Typography color="text.secondary">سابقه تحصیلی ثبت نشده است.</Typography>
            : <Stack spacing={1.5}>{query.data.map((education) => (
              <Paper key={education.id} variant="outlined" sx={{ p: 1.5 }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2">مدرک: {education.degreeLabel || getPersonEducationDegreeLabel(education.degree)}</Typography>
                    <Typography variant="body2">دانشگاه: {education.university?.name || education.universityNameSnapshot || '—'}</Typography>
                    <Typography variant="body2">تاریخ: {formatJalaliDate(education.educationDate)}</Typography>
                    {education.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{education.description}</Typography>}
                  </Box>
                  {canManage && <Box>
                    <IconButton size="small" aria-label="ویرایش سابقه تحصیلی" onClick={() => setFormItem(education)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" aria-label="حذف سابقه تحصیلی" onClick={() => setDeleting(education)}><DeleteIcon /></IconButton>
                  </Box>}
                </Stack>
              </Paper>
            ))}</Stack>}
      {formItem !== undefined && <EducationDialog personId={personId} item={formItem ?? undefined} onClose={() => setFormItem(undefined)} />}
      <Dialog open={Boolean(deleting)} onClose={() => setDeleting(undefined)}>
        <DialogTitle>حذف سابقه تحصیلی</DialogTitle>
        <DialogContent><Typography>آیا از حذف این سابقه تحصیلی مطمئن هستید؟</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(undefined)}>انصراف</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={remove.isPending}>حذف</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
