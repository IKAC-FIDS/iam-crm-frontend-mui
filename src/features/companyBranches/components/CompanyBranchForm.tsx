import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, Button, Stack, TextField } from '@mui/material';
import IranProvinceSelect from '@/shared/components/IranProvinceSelect';
import type {
  CompanyBranch,
  CreateCompanyBranchPayload,
  UpdateCompanyBranchPayload,
} from '../types/companyBranch.types';

interface CompanyBranchFormProps {
  mode: 'create' | 'edit';
  initialValues?: Partial<CompanyBranch>;
  isSubmitting?: boolean;
  errorMessage?: string;
  onSubmit: (values: CreateCompanyBranchPayload | UpdateCompanyBranchPayload) => Promise<void> | void;
  onCancel?: () => void;
}

const branchFormSchema = z.object({
  name: z.string(),
  city: z.string(),
  address: z.string(),
  phone: z.string(),
}).refine(
  (values) => Boolean(
    values.name.trim() || values.city.trim() || values.address.trim() || values.phone.trim()
  ),
  { message: 'حداقل یکی از فیلدهای شعبه باید وارد شود.', path: ['name'] },
);

type FormData = z.infer<typeof branchFormSchema>;

function getValues(value?: Partial<CompanyBranch>): FormData {
  return {
    name: value?.name ?? '',
    city: value?.city ?? '',
    address: value?.address ?? '',
    phone: value?.phone ?? '',
  };
}

function optional(value: string): string | undefined {
  return value.trim() || undefined;
}

export default function CompanyBranchForm({
  mode,
  initialValues,
  isSubmitting = false,
  errorMessage,
  onSubmit,
  onCancel,
}: CompanyBranchFormProps) {
  const { control, handleSubmit, register, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: getValues(initialValues),
  });

  useEffect(() => reset(getValues(initialValues)), [initialValues, reset]);

  const submit = (data: FormData) => onSubmit({
    name: optional(data.name),
    city: optional(data.city),
    address: optional(data.address),
    phone: optional(data.phone),
  });

  return (
    <Stack component="form" onSubmit={handleSubmit(submit)} spacing={2} sx={{ pt: 1 }}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <TextField
        autoFocus
        label="نام شعبه"
        error={Boolean(errors.name)}
        helperText={errors.name?.message}
        {...register('name')}
      />
      <Controller
        name="city"
        control={control}
        render={({ field }) => (
          <IranProvinceSelect
            value={field.value}
            onChange={field.onChange}
            label="استان شعبه"
            disabled={isSubmitting}
          />
        )}
      />
      <TextField label="آدرس" multiline minRows={3} {...register('address')} />
      <TextField label="تلفن" {...register('phone')} />
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        {onCancel && <Button onClick={onCancel} disabled={isSubmitting}>انصراف</Button>}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'در حال ثبت...' : mode === 'create' ? 'افزودن شعبه' : 'ذخیره تغییرات'}
        </Button>
      </Stack>
    </Stack>
  );
}
