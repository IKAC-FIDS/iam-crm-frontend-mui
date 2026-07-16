import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
  Alert,
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import IranProvinceSelect from '@/shared/components/IranProvinceSelect';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { useCatalog } from '@/features/catalogs/hooks/useCatalogs';
import { getCatalogItemLabel, isCatalogItemActive } from '@/features/catalogs/types/catalog.types';
import { useCompanies } from '../hooks/useCompanies';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import {
  COMPANY_ACTIVITY_STATUSES,
  COMPANY_ACTIVITY_STATUS_OPTIONS,
  COMPANY_OWNERSHIPS,
  COMPANY_OWNERSHIP_OPTIONS,
  COMPANY_PRIORITIES,
  COMPANY_PRIORITY_OPTIONS,
} from '../types/company.types';
import type {
  Company,
  CompanyListItem,
  CompanySummary,
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

const normalizedDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/,/g, '')
    .trim();

const numericText = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .refine((value) => {
    const normalized = normalizedDigits(value ?? '');
    return !normalized || /^\d+(\.\d{1,2})?$/.test(normalized);
  }, 'مقدار باید عددی و غیرمنفی باشد');

const employeeCountText = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .refine((value) => {
    const normalized = normalizedDigits(value ?? '');
    return !normalized || /^\d+$/.test(normalized);
  }, 'تعداد پرسنل باید عدد صحیح غیرمنفی باشد');

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
  registrationNumber: z.string().trim().optional().or(z.literal('')),
  nationalId: z.string().trim().optional().or(z.literal('')),
  economicCode: z.string().trim().optional().or(z.literal('')),
  establishmentDate: z.string().optional().or(z.literal('')),
  activityStatus: z.enum(COMPANY_ACTIVITY_STATUSES).or(z.literal('')),
  registeredCapital: numericText,
  employeeCount: employeeCountText,
  parentCompanyIds: z.array(z.string()),
  subsidiaryCompanyIds: z.array(z.string()),
}).refine(
  (value) => !value.parentCompanyIds.some((id) => value.subsidiaryCompanyIds.includes(id)),
  {
    path: ['subsidiaryCompanyIds'],
    message: 'یک شرکت نمی‌تواند همزمان مادر و زیرمجموعه انتخاب شود',
  },
);

type CompanyFormData = z.infer<typeof companyFormSchema>;

function summaryFromCompany(company: Company | CompanySummary | CompanyListItem): CompanySummary {
  return {
    id: company.id,
    legalName: company.legalName,
    brandName: company.brandName,
  };
}

function uniqueCompanies(companies: CompanySummary[]): CompanySummary[] {
  return Array.from(new Map(companies.map((company) => [company.id, company])).values());
}

function getDefaultValues(initialValues?: Partial<Company>): CompanyFormData {
  const ownership = COMPANY_OWNERSHIPS.find(
    (value) => value === initialValues?.ownership,
  );
  const priority = COMPANY_PRIORITIES.find(
    (value) => value === initialValues?.priority,
  );
  const activityStatus = COMPANY_ACTIVITY_STATUSES.find(
    (value) => value === initialValues?.activityStatus,
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
    registrationNumber: initialValues?.registrationNumber ?? '',
    nationalId: initialValues?.nationalId ?? '',
    economicCode: initialValues?.economicCode ?? '',
    establishmentDate: initialValues?.establishmentDate ?? '',
    activityStatus: activityStatus ?? '',
    registeredCapital: initialValues?.registeredCapital != null ? String(initialValues.registeredCapital) : '',
    employeeCount: initialValues?.employeeCount != null ? String(initialValues.employeeCount) : '',
    parentCompanyIds: initialValues?.parentCompanyIds ?? initialValues?.parentCompanies?.map((company) => company.id) ?? [],
    subsidiaryCompanyIds: initialValues?.subsidiaryCompanyIds ?? initialValues?.subsidiaryCompanies?.map((company) => company.id) ?? [],
  };
}

function optionalValue(value?: string): string | undefined {
  return value?.trim() || undefined;
}

function companyLabel(company: CompanySummary): string {
  return company.brandName ? `${company.legalName} (${company.brandName})` : company.legalName;
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
  const [companySearch, setCompanySearch] = useState('');
  const debouncedCompanySearch = useDebouncedValue(companySearch.trim(), 400);
  const companyOptions = useCompanies({
    page: 1,
    limit: 10,
    search: debouncedCompanySearch || undefined,
    archiveStatus: 'ACTIVE',
  });
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

  const currentCompanyId = initialValues?.id;
  const parentIds = useWatch({ control, name: 'parentCompanyIds' }) ?? [];
  const subsidiaryIds = useWatch({ control, name: 'subsidiaryCompanyIds' }) ?? [];
  const relatedOptions = useMemo(() => {
    const searched = companyOptions.data?.data.map(summaryFromCompany) ?? [];
    const initialParents = initialValues?.parentCompanies?.map(summaryFromCompany) ?? [];
    const initialSubsidiaries = initialValues?.subsidiaryCompanies?.map(summaryFromCompany) ?? [];
    return uniqueCompanies([...initialParents, ...initialSubsidiaries, ...searched])
      .filter((company) => company.id !== currentCompanyId);
  }, [companyOptions.data?.data, currentCompanyId, initialValues?.parentCompanies, initialValues?.subsidiaryCompanies]);

  const submit = (data: CompanyFormData) => {
    const normalizedCapital = normalizedDigits(data.registeredCapital ?? '');
    const normalizedEmployeeCount = normalizedDigits(data.employeeCount ?? '');
    const values: CreateCompanyPayload | UpdateCompanyPayload = {
      legalName: data.legalName.trim(),
      brandName: optionalValue(data.brandName),
      industry: optionalValue(data.industry),
      ownership: data.ownership || undefined,
      priority: data.priority || undefined,
      headOfficeCity: optionalValue(data.headOfficeCity),
      website: optionalValue(data.website),
      source: optionalValue(data.source),
      registrationNumber: optionalValue(normalizedDigits(data.registrationNumber ?? '')),
      nationalId: optionalValue(normalizedDigits(data.nationalId ?? '')),
      economicCode: optionalValue(normalizedDigits(data.economicCode ?? '')),
      establishmentDate: data.establishmentDate || undefined,
      activityStatus: data.activityStatus || undefined,
      registeredCapital: normalizedCapital || undefined,
      employeeCount: normalizedEmployeeCount ? Number(normalizedEmployeeCount) : undefined,
      parentCompanyIds: data.parentCompanyIds,
      subsidiaryCompanyIds: data.subsidiaryCompanyIds,
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

      <Typography variant="subtitle1">اطلاعات پایه</Typography>
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
              {(industries.data ?? []).filter(isCatalogItemActive).map((item) => <MenuItem key={item.id} value={item.value}>{getCatalogItemLabel(item)}</MenuItem>)}
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
            <Select {...field} labelId={`${mode}-company-ownership-label`} label="نوع مالکیت">
              <MenuItem value="">انتخاب نشده</MenuItem>
              {COMPANY_OWNERSHIP_OPTIONS.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
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
            <Select {...field} labelId={`${mode}-company-priority-label`} label="اولویت">
              <MenuItem value="">بدون اولویت</MenuItem>
              {COMPANY_PRIORITY_OPTIONS.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
            </Select>
          </FormControl>
        )}
      />

      <Controller
        name="headOfficeCity"
        control={control}
        render={({ field }) => (
          <IranProvinceSelect value={field.value ?? ''} onChange={field.onChange} label="استان دفتر مرکزی" />
        )}
      />
      <TextField label="وب‌سایت" error={Boolean(errors.website)} helperText={errors.website?.message} {...register('website')} />
      <Controller
        name="source"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth disabled={leadSources.isLoading || leadSources.isError} error={leadSources.isError}>
            <InputLabel id={`${mode}-company-source-label`}>منبع جذب</InputLabel>
            <Select {...field} labelId={`${mode}-company-source-label`} label="منبع جذب">
              <MenuItem value="">انتخاب نشده</MenuItem>
              {(leadSources.data ?? []).filter(isCatalogItemActive).map((item) => <MenuItem key={item.id} value={item.value}>{getCatalogItemLabel(item)}</MenuItem>)}
            </Select>
          </FormControl>
        )}
      />
      {leadSources.isError && <Alert severity="error">خطا در دریافت فهرست منابع جذب.</Alert>}

      <Typography variant="subtitle1">اطلاعات ثبتی و حقوقی</Typography>
      <TextField label="شماره ثبت" {...register('registrationNumber')} />
      <TextField label="شناسه ملی" {...register('nationalId')} />
      <TextField label="کد اقتصادی" {...register('economicCode')} />
      <Controller
        name="establishmentDate"
        control={control}
        render={({ field }) => (
          <JalaliDateField label="تاریخ تاسیس" value={field.value} onChange={(value) => field.onChange(value ?? '')} />
        )}
      />
      <Controller
        name="activityStatus"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id={`${mode}-company-activity-status-label`}>وضعیت فعالیت</InputLabel>
            <Select {...field} labelId={`${mode}-company-activity-status-label`} label="وضعیت فعالیت">
              <MenuItem value="">انتخاب نشده</MenuItem>
              {COMPANY_ACTIVITY_STATUS_OPTIONS.map((option) => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
            </Select>
          </FormControl>
        )}
      />
      <TextField
        label="سرمایه ثبتی"
        inputMode="decimal"
        error={Boolean(errors.registeredCapital)}
        helperText={errors.registeredCapital?.message}
        {...register('registeredCapital')}
      />
      <TextField
        label="تعداد پرسنل"
        inputMode="numeric"
        error={Boolean(errors.employeeCount)}
        helperText={errors.employeeCount?.message}
        {...register('employeeCount')}
      />

      <Typography variant="subtitle1">ساختار مالکیتی</Typography>
      <Controller
        name="parentCompanyIds"
        control={control}
        render={({ field }) => (
          <Autocomplete
            multiple
            options={relatedOptions.filter((company) => !subsidiaryIds.includes(company.id))}
            value={relatedOptions.filter((company) => field.value.includes(company.id))}
            loading={companyOptions.isFetching}
            inputValue={companySearch}
            onInputChange={(_, value) => setCompanySearch(value)}
            onChange={(_, value) => field.onChange(value.map((company) => company.id))}
            getOptionLabel={companyLabel}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="شرکت‌های مادر" helperText={errors.parentCompanyIds?.message} error={Boolean(errors.parentCompanyIds)} />
            )}
          />
        )}
      />
      <Controller
        name="subsidiaryCompanyIds"
        control={control}
        render={({ field }) => (
          <Autocomplete
            multiple
            options={relatedOptions.filter((company) => !parentIds.includes(company.id))}
            value={relatedOptions.filter((company) => field.value.includes(company.id))}
            loading={companyOptions.isFetching}
            inputValue={companySearch}
            onInputChange={(_, value) => setCompanySearch(value)}
            onChange={(_, value) => field.onChange(value.map((company) => company.id))}
            getOptionLabel={companyLabel}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="شرکت‌های زیرمجموعه" helperText={errors.subsidiaryCompanyIds?.message} error={Boolean(errors.subsidiaryCompanyIds)} />
            )}
          />
        )}
      />
      {companyOptions.isError && <Alert severity="error">دریافت فهرست شرکت‌ها برای ساختار مالکیتی انجام نشد.</Alert>}

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
