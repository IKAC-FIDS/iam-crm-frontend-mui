import { useEffect } from 'react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import IranProvinceSelect from '@/shared/components/IranProvinceSelect';
import { useUpdateCompany } from '../hooks/useCompanies';
import { COMPANY_PRIORITIES, companyPriorityLabels } from '../types/company.types';
import type { Company, UpdateCompanyPayload } from '../types/company.types';

interface EditCompanyDialogProps {
  company: Company;
  open: boolean;
  onClose: () => void;
}

interface ApiErrorBody {
  message?: string;
}

const editCompanySchema = z.object({
  legalName: z.string().trim().min(1, 'نام حقوقی الزامی است'),
  brandName: z.string(),
  industry: z.string(),
  priority: z.enum(COMPANY_PRIORITIES).or(z.literal('')),
  headOfficeCity: z.string(),
  website: z.string(),
  source: z.string(),
});

type EditCompanyFormData = z.infer<typeof editCompanySchema>;

function getValues(company: Company): EditCompanyFormData {
  return {
    legalName: company.legalName,
    brandName: company.brandName ?? '',
    industry: company.industry ?? '',
    priority:
      company.priority && COMPANY_PRIORITIES.some((value) => value === company.priority)
        ? (company.priority as EditCompanyFormData['priority'])
        : '',
    headOfficeCity: company.headOfficeCity ?? '',
    website: company.website ?? '',
    source: company.source ?? '',
  };
}

export default function EditCompanyDialog({ company, open, onClose }: EditCompanyDialogProps) {
  const updateCompany = useUpdateCompany(company.id);
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<EditCompanyFormData>({
    resolver: zodResolver(editCompanySchema),
    defaultValues: getValues(company),
  });

  useEffect(() => {
    if (open) reset(getValues(company));
  }, [company, open, reset]);

  const handleClose = () => {
    if (updateCompany.isPending) return;
    updateCompany.reset();
    onClose();
  };

  const onSubmit = async (data: EditCompanyFormData) => {
    const payload: UpdateCompanyPayload = {
      legalName: data.legalName.trim(),
      brandName: data.brandName.trim(),
      industry: data.industry.trim(),
      priority: data.priority || undefined,
      headOfficeCity: data.headOfficeCity.trim(),
      website: data.website.trim(),
      source: data.source.trim(),
    };

    try {
      await updateCompany.mutateAsync(payload);
      toast.success('اطلاعات شرکت بروزرسانی شد.');
      onClose();
    } catch {
      // خطای API در خود فرم نمایش داده می‌شود.
    }
  };

  const errorMessage = axios.isAxiosError<ApiErrorBody>(updateCompany.error)
    ? updateCompany.error.response?.data?.message
    : undefined;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>ویرایش اطلاعات شرکت</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          id="edit-company-form"
          onSubmit={handleSubmit(onSubmit)}
          spacing={2}
          sx={{ pt: 1 }}
        >
          {updateCompany.isError && (
            <Alert severity="error">
              {errorMessage || 'بروزرسانی شرکت با خطا مواجه شد.'}
            </Alert>
          )}
          <TextField
            required
            label="نام حقوقی"
            error={Boolean(errors.legalName)}
            helperText={errors.legalName?.message}
            {...register('legalName')}
          />
          <TextField label="نام برند" {...register('brandName')} />
          <TextField label="صنعت" {...register('industry')} />
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="edit-company-priority-label">اولویت</InputLabel>
                <Select {...field} labelId="edit-company-priority-label" label="اولویت">
                  <MenuItem value="">بدون اولویت</MenuItem>
                  {COMPANY_PRIORITIES.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {companyPriorityLabels[priority]}
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
                value={field.value}
                onChange={field.onChange}
                label="استان دفتر مرکزی"
              />
            )}
          />
          <TextField label="وب‌سایت" {...register('website')} />
          <TextField label="منبع" {...register('source')} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={updateCompany.isPending}>انصراف</Button>
        <Button
          type="submit"
          form="edit-company-form"
          variant="contained"
          disabled={updateCompany.isPending}
        >
          {updateCompany.isPending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
