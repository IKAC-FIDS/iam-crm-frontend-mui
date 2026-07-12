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
  jobTitle: z.string(),
  department: z.string(),
  personaRole: z.string(),
  seniorityLevel: z.string(),
  isPrimaryContact: z.boolean(),
  isSecondaryContact: z.boolean(),
});

type PersonFormData = z.infer<typeof personFormSchema>;

function getValues(initialValues?: Partial<Person>): PersonFormData {
  return {
    fullName: initialValues?.fullName ?? '',
    jobTitle: initialValues?.jobTitle ?? initialValues?.title ?? '',
    department: initialValues?.department ?? '',
    personaRole: initialValues?.personaRole ?? initialValues?.personaTag ?? '',
    seniorityLevel: initialValues?.seniorityLevel ?? '',
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

  const jobTitles = useCatalog('lookupOptions', true, {
    group: 'job-titles',
  });

  const personaRoles = useCatalog('lookupOptions', true, {
    group: 'persona-roles',
  });

  const seniorityLevels = useCatalog('lookupOptions', true, {
    group: 'seniority-levels',
  });

  const departmentOptions = (departments.data ?? []).filter(isCatalogItemActive);
  const jobTitleOptions = (jobTitles.data ?? []).filter(isCatalogItemActive);
  const personaRoleOptions = (personaRoles.data ?? []).filter(isCatalogItemActive);
  const seniorityLevelOptions = (seniorityLevels.data ?? []).filter(isCatalogItemActive);

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
      jobTitle: optional(data.jobTitle),
      department: optional(data.department),
      personaRole: optional(data.personaRole),
      seniorityLevel: optional(data.seniorityLevel),
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
        name="jobTitle"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth disabled={jobTitles.isLoading || jobTitles.isError}>
            <InputLabel id={`${mode}-person-job-title`}>
              سمت سازمانی
            </InputLabel>

            <Select
              {...field}
              labelId={`${mode}-person-job-title`}
              label="سمت سازمانی"
            >
              <MenuItem value="">
                انتخاب نشده
              </MenuItem>

              {jobTitleOptions.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {getCatalogItemLabel(item)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="personaRole"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth disabled={personaRoles.isLoading || personaRoles.isError}>
            <InputLabel id={`${mode}-person-persona`}>
              نقش در فرآیند فروش
            </InputLabel>

            <Select
              {...field}
              labelId={`${mode}-person-persona`}
              label="نقش در فرآیند فروش"
            >
              <MenuItem value="">
                انتخاب نشده
              </MenuItem>

              {personaRoleOptions.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {getCatalogItemLabel(item)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="seniorityLevel"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth disabled={seniorityLevels.isLoading || seniorityLevels.isError}>
            <InputLabel id={`${mode}-person-seniority`}>
              سطح ارشدیت
            </InputLabel>

            <Select
              {...field}
              labelId={`${mode}-person-seniority`}
              label="سطح ارشدیت"
            >
              <MenuItem value="">
                انتخاب نشده
              </MenuItem>

              {seniorityLevelOptions.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {getCatalogItemLabel(item)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      {(departments.isError || jobTitles.isError || personaRoles.isError || seniorityLevels.isError) && (
        <Alert severity="error">
          خطا در دریافت گزینه‌های دپارتمان، سمت، نقش فروش یا سطح ارشدیت.
        </Alert>
      )}

      {!departments.isLoading && !departments.isError && departmentOptions.length === 0 && (
        <Alert severity="info">
          هنوز دپارتمانی تعریف نشده است. از بخش کتابخانه‌ها، گزینه‌های پایه، گروه دپارتمان‌ها را تکمیل کنید.
        </Alert>
      )}

      {!jobTitles.isLoading && !jobTitles.isError && jobTitleOptions.length === 0 && (
        <Alert severity="info">
          هنوز سمتی تعریف نشده است. از بخش کتابخانه‌ها، گزینه‌های پایه، گروه سمت‌ها را تکمیل کنید.
        </Alert>
      )}

      {!personaRoles.isLoading && !personaRoles.isError && personaRoleOptions.length === 0 && (
        <Alert severity="info">
          هنوز نقش فروشی تعریف نشده است. از بخش کتابخانه‌ها، گزینه‌های پایه، گروه نقش‌های فروش را تکمیل کنید.
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
