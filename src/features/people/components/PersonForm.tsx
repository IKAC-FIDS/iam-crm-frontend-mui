import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Alert,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from '@mui/material';

import { useCatalog } from '@/features/catalogs/hooks/useCatalogs';
import {
  getCatalogItemLabel,
  isCatalogItemActive,
} from '@/features/catalogs/types/catalog.types';

import type {
  CreatePersonPayload,
  Person,
  UpdatePersonPayload,
} from '../types/person.types';

interface PersonFormProps {
  mode: 'create' | 'edit';
  companyId: string;
  initialValues?: Partial<Person>;
  isSubmitting?: boolean;
  errorMessage?: string;
  onSubmit: (values: CreatePersonPayload | UpdatePersonPayload) => Promise<void> | void;
  onCancel?: () => void;
}

const personFormSchema = z.object({
  fullName: z.string().trim().min(1, 'نام کامل الزامی است'),
  title: z.string(),
  department: z.string(),
  personaTag: z.string(),
  isPrimaryContact: z.boolean(),
  isSecondaryContact: z.boolean(),
});

type PersonFormData = z.infer<typeof personFormSchema>;

function getValues(initialValues?: Partial<Person>): PersonFormData {
  return {
    fullName: initialValues?.fullName ?? '',
    title: initialValues?.title ?? '',
    department: initialValues?.department ?? '',
    personaTag: initialValues?.personaTag ?? '',
    isPrimaryContact: initialValues?.isPrimaryContact ?? false,
    isSecondaryContact: initialValues?.isSecondaryContact ?? false,
  };
}

function optional(value: string): string | undefined {
  return value.trim() || undefined;
}

export default function PersonForm({
  mode,
  companyId,
  initialValues,
  isSubmitting = false,
  errorMessage,
  onSubmit,
  onCancel,
}: PersonFormProps) {
  const departments = useCatalog('lookupOptions', true, {
    group: 'departments',
  });

  const personas = useCatalog('personas', true);

  const departmentOptions = (departments.data ?? []).filter(isCatalogItemActive);
  const personaOptions = (personas.data ?? []).filter(isCatalogItemActive);

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<PersonFormData>({
    resolver: zodResolver(personFormSchema),
    defaultValues: getValues(initialValues),
  });

  useEffect(() => {
    reset(getValues(initialValues));
  }, [initialValues, reset]);

  const submit = (data: PersonFormData) => {
    const common: UpdatePersonPayload = {
      fullName: data.fullName.trim(),
      title: optional(data.title),
      department: optional(data.department),
      personaTag: optional(data.personaTag),
      isPrimaryContact: data.isPrimaryContact,
      isSecondaryContact: data.isSecondaryContact,
    };

    return onSubmit(
      mode === 'create'
        ? ({ companyId, ...common } as CreatePersonPayload)
        : common
    );
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(submit)} spacing={2} sx={{ pt: 1 }}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <TextField
        required
        autoFocus
        label="نام کامل"
        error={Boolean(errors.fullName)}
        helperText={errors.fullName?.message}
        {...register('fullName')}
      />

      <TextField label="سمت" {...register('title')} />

      <Controller
        name="department"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth disabled={departments.isLoading || departments.isError}>
            <InputLabel id={`${mode}-person-department`}>
              دپارتمان
            </InputLabel>

            <Select
              {...field}
              labelId={`${mode}-person-department`}
              label="دپارتمان"
            >
              <MenuItem value="">
                انتخاب نشده
              </MenuItem>

              {departmentOptions.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {getCatalogItemLabel(item)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="personaTag"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth disabled={personas.isLoading || personas.isError}>
            <InputLabel id={`${mode}-person-persona`}>
              پرسونا
            </InputLabel>

            <Select
              {...field}
              labelId={`${mode}-person-persona`}
              label="پرسونا"
            >
              <MenuItem value="">
                انتخاب نشده
              </MenuItem>

              {personaOptions.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {getCatalogItemLabel(item)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      {(departments.isError || personas.isError) && (
        <Alert severity="error">
          خطا در دریافت گزینه‌های دپارتمان و پرسونا.
        </Alert>
      )}

      {!departments.isLoading && !departments.isError && departmentOptions.length === 0 && (
        <Alert severity="info">
          هنوز دپارتمانی تعریف نشده است. از بخش کتابخانه‌ها، گزینه‌های پایه، گروه دپارتمان‌ها را تکمیل کنید.
        </Alert>
      )}

      {!personas.isLoading && !personas.isError && personaOptions.length === 0 && (
        <Alert severity="info">
          هنوز پرسونا تعریف نشده است. از بخش کتابخانه‌ها، تب پرسوناها را تکمیل کنید.
        </Alert>
      )}

      <Alert severity="info">
        راه‌های تماس مثل ایمیل، تلفن، موبایل و شبکه‌های اجتماعی بعد از ثبت شخص، از بخش مشاهده جزئیات همان شخص اضافه می‌شوند.
      </Alert>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Controller
          name="isPrimaryContact"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label="مخاطب اصلی"
              control={
                <Switch
                  checked={field.value}
                  onChange={(_, checked) => field.onChange(checked)}
                />
              }
            />
          )}
        />

        <Controller
          name="isSecondaryContact"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label="مخاطب دوم"
              control={
                <Switch
                  checked={field.value}
                  onChange={(_, checked) => field.onChange(checked)}
                />
              }
            />
          )}
        />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button onClick={onCancel} disabled={isSubmitting}>
            انصراف
          </Button>
        )}

        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting
            ? 'در حال ثبت...'
            : mode === 'create'
              ? 'ثبت شخص'
              : 'ذخیره تغییرات'}
        </Button>
      </Stack>
    </Stack>
  );
}