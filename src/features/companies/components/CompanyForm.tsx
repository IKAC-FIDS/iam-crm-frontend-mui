import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import IranProvinceSelect from '@/shared/components/IranProvinceSelect';
import { useCatalog } from '@/features/catalogs/hooks/useCatalogs';
import { getCatalogItemLabel, isCatalogItemActive } from '@/features/catalogs/types/catalog.types';
import {
  COMPANY_OWNERSHIPS,
  COMPANY_OWNERSHIP_OPTIONS,
  COMPANY_PRIORITIES,
  COMPANY_PRIORITY_OPTIONS,
} from '../types/company.types';
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from '../types/company.types';

export interface CompanyFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<Company>;
  isSubmitting?: boolean;
  errorMessage?: string;
  onSubmit: (
    values: CreateCompanyPayload | UpdateCompanyPayload,
  ) => Promise<void> | void;
  onCancel?: () => void;
}

const companyFormSchema = z.object({
  legalName: z.string().trim().min(1, 'نام حقوقی الزامی است'),
  brandName: z.string().trim().optional().or(z.literal('')),
  industry: z.string().trim().optional().or(z.literal('')),
  ownership: z.enum(COMPANY_OWNERSHIPS).or(z.literal('')),
  priority: z.enum(COMPANY_PRIORITIES).or(z.literal('')),
  headOfficeCity: z.string().trim().optional().or(z.literal('')),
  website: z
    .string()
    .trim()
    .url('آدرس وب‌سایت معتبر نیست')
    .optional()
    .or(z.literal('')),
  source: z.string().trim().optional().or(z.literal('')),
});

type CompanyFormData = z.infer<typeof companyFormSchema>;

function getDefaultValues(initialValues?: Partial<Company>): CompanyFormData {
  const ownership = COMPANY_OWNERSHIPS.find(
    (value) => value === initialValues?.ownership,
  );
  const priority = COMPANY_PRIORITIES.find(
    (value) => value === initialValues?.priority,
  );

  return {
    legalName: initialValues?.legalName ?? '',
    brandName: initialValues?.brandName ?? '',
    industry: initialValues?.industry ?? '',
    ownership: ownership ?? '',
    priority: priority ?? '',
    headOfficeCity: initialValues?.headOfficeCity ?? '',
    website: initialValues?.website ?? '',
    source: initialValues?.source ?? '',
  };
}

function optionalValue(value?: string): string | undefined {
  return value?.trim() || undefined;
}

export default function CompanyForm({
  mode,
  initialValues,
  isSubmitting = false,
  errorMessage,
  onSubmit,
  onCancel,
}: CompanyFormProps) {
  const industries = useCatalog('industries');
  const leadSources = useCatalog('leadSources');
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: getDefaultValues(initialValues),
  });

  useEffect(() => {
    reset(getDefaultValues(initialValues));
  }, [initialValues, reset]);

  const submit = (data: CompanyFormData) => {
    const values: CreateCompanyPayload | UpdateCompanyPayload = {
      legalName: data.legalName.trim(),
      brandName: optionalValue(data.brandName),
      industry: optionalValue(data.industry),
      ownership: data.ownership || undefined,
      priority: data.priority || undefined,
      headOfficeCity: optionalValue(data.headOfficeCity),
      website: optionalValue(data.website),
      source: optionalValue(data.source),
    };

    return onSubmit(values);
  };

  return (
    <Stack
      component="form"
      id={`company-form-${mode}`}
      onSubmit={handleSubmit(submit)}
      spacing={2}
      sx={{ pt: 1 }}
    >
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <TextField
        autoFocus
        required
        label="نام حقوقی"
        error={Boolean(errors.legalName)}
        helperText={errors.legalName?.message}
        {...register('legalName')}
      />
      <TextField label="نام برند" {...register('brandName')} />
      <Controller
        name="industry"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth disabled={industries.isLoading || industries.isError} error={industries.isError}>
            <InputLabel id={`${mode}-company-industry-label`}>صنعت</InputLabel>
            <Select {...field} labelId={`${mode}-company-industry-label`} label="صنعت">
              <MenuItem value="">انتخاب نشده</MenuItem>
              {(industries.data ?? []).filter(isCatalogItemActive).map((item) => { const label = getCatalogItemLabel(item); return <MenuItem key={item.id} value={label}>{label}</MenuItem>; })}
            </Select>
          </FormControl>
        )}
      />
      {industries.isError && <Alert severity="error">خطا در دریافت فهرست صنایع.</Alert>}

      <Controller
        name="ownership"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id={`${mode}-company-ownership-label`}>نوع مالکیت</InputLabel>
            <Select
              {...field}
              labelId={`${mode}-company-ownership-label`}
              label="نوع مالکیت"
            >
              <MenuItem value="">انتخاب نشده</MenuItem>
              {COMPANY_OWNERSHIP_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="priority"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id={`${mode}-company-priority-label`}>اولویت</InputLabel>
            <Select
              {...field}
              labelId={`${mode}-company-priority-label`}
              label="اولویت"
            >
              <MenuItem value="">بدون اولویت</MenuItem>
              {COMPANY_PRIORITY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="headOfficeCity"
        control={control}
        render={({ field }) => (
          <IranProvinceSelect
            value={field.value ?? ''}
            onChange={field.onChange}
            label="استان دفتر مرکزی"
          />
        )}
      />
      <TextField
        label="وب‌سایت"
        error={Boolean(errors.website)}
        helperText={errors.website?.message}
        {...register('website')}
      />
      <Controller
        name="source"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth disabled={leadSources.isLoading || leadSources.isError} error={leadSources.isError}>
            <InputLabel id={`${mode}-company-source-label`}>منبع جذب</InputLabel>
            <Select {...field} labelId={`${mode}-company-source-label`} label="منبع جذب">
              <MenuItem value="">انتخاب نشده</MenuItem>
              {(leadSources.data ?? []).filter(isCatalogItemActive).map((item) => { const label = getCatalogItemLabel(item); return <MenuItem key={item.id} value={label}>{label}</MenuItem>; })}
            </Select>
          </FormControl>
        )}
      />
      {leadSources.isError && <Alert severity="error">خطا در دریافت فهرست منابع جذب.</Alert>}

      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button type="button" onClick={onCancel} disabled={isSubmitting}>
            انصراف
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting
            ? 'در حال ثبت...'
            : mode === 'create'
              ? 'ثبت شرکت'
              : 'ذخیره تغییرات'}
        </Button>
      </Stack>
    </Stack>
  );
}
