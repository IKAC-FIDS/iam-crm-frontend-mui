import { useState } from 'react';
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useOwnerOptions } from '@/features/admin/users/hooks/useAdminUsers';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { COMPANY_PRIORITY_OPTIONS, type Priority } from '@/features/companies/types/company.types';
import { useCatalog } from '@/features/catalogs/hooks/useCatalogs';
import {
  getCatalogItemLabel,
  isCatalogItemActive,
} from '@/features/catalogs/types/catalog.types';
import { usePeople } from '@/features/people/hooks/usePeople';
import type { Person } from '@/features/people/types/person.types';
import type { PipelineStageConfig } from '@/features/pipelineConfig/types/pipelineConfig.types';
import type { CompanyOpportunityPayload, Opportunity } from '../types/opportunity.types';

interface OpportunityFormProps {
  opportunity?: Opportunity | null;
  companyId: string;
  stages: PipelineStageConfig[];
  onChange: (value: CompanyOpportunityPayload) => void;
}

function numberOrUndefined(value: string): number | undefined {
  return value === '' ? undefined : Number(value);
}

function personLabel(person: Person | NonNullable<Opportunity['primaryContact']>): string {
  const title = 'jobTitle' in person ? person.jobTitle ?? person.title : person.title;
  const details = [title, person.department].filter(Boolean).join('، ');
  return details ? `${person.fullName} (${details})` : person.fullName;
}

function getInitialValue(opportunity?: Opportunity | null): CompanyOpportunityPayload {
  return {
    title: opportunity?.title ?? '',
    description: opportunity?.description ?? undefined,
    stageId: opportunity?.stageId,
    priority: (opportunity?.priority as Priority | undefined) ?? 'MEDIUM',
    estimatedValue: opportunity?.estimatedValue == null ? undefined : Number(opportunity.estimatedValue),
    expectedCloseDate: opportunity?.expectedCloseDate ?? undefined,
    sourceOptionId: opportunity?.sourceOptionId ?? opportunity?.sourceOption?.id ?? undefined,
    opportunitySource: opportunity?.opportunitySource ?? undefined,
    source: opportunity?.source ?? undefined,
    primaryContactId: opportunity?.primaryContactId ?? opportunity?.primaryContact?.id ?? undefined,
    probability: opportunity?.probability ?? undefined,
    competitor: opportunity?.competitor ?? undefined,
  };
}

export default function OpportunityForm({
  opportunity,
  companyId,
  stages,
  onChange,
}: OpportunityFormProps) {
  const [value, setValue] = useState<CompanyOpportunityPayload>(() => getInitialValue(opportunity));
  const owners = useOwnerOptions(!opportunity);
  const sourceQuery = useCatalog('lookupOptions', true, { group: 'opportunity-sources' });
  const peopleQuery = usePeople({ companyId, page: 1, limit: 100 });

  const sourceOptions = (() => {
    const options = (sourceQuery.data ?? []).filter(isCatalogItemActive);
    if (!opportunity?.sourceOption || options.some((item) => item.id === opportunity.sourceOption?.id)) {
      return options;
    }
    return [
      ...options,
      {
        id: opportunity.sourceOption.id,
        value: opportunity.sourceOption.code,
        label: opportunity.sourceOption.label,
        isActive: true,
      },
    ];
  })();

  const peopleOptions = (() => {
    const options = peopleQuery.data?.data ?? [];
    if (!opportunity?.primaryContact || options.some((item) => item.id === opportunity.primaryContact?.id)) {
      return options;
    }
    return [...options, opportunity.primaryContact as Person];
  })();

  const update = (next: Partial<CompanyOpportunityPayload>) => {
    const merged = { ...value, ...next };
    setValue(merged);
    onChange(merged);
  };

  return (
    <Stack spacing={2} sx={{ pt: 1 }}>
      {!stages.length && <Alert severity="warning">هیچ مرحله فعال پایپ‌لاین دریافت نشد.</Alert>}

      <TextField
        required
        label="عنوان فرصت"
        value={value.title}
        onChange={(event) => update({ title: event.target.value })}
      />

      {!opportunity && (
        <FormControl disabled={owners.isLoading || owners.isError}>
          <InputLabel id="opportunity-owner">مسئول فرصت</InputLabel>
          <Select
            labelId="opportunity-owner"
            label="مسئول فرصت"
            value={value.ownerId ?? ''}
            onChange={(event) => update({ ownerId: event.target.value || undefined })}
          >
            <MenuItem value="">مسئول پیش‌فرض</MenuItem>
            {(owners.data ?? []).map((owner) => (
              <MenuItem key={owner.id} value={owner.id}>{owner.fullName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {!opportunity && (
        <FormControl>
          <InputLabel id="opportunity-stage">مرحله فروش</InputLabel>
          <Select
            labelId="opportunity-stage"
            label="مرحله فروش"
            value={value.stageId ?? ''}
            onChange={(event) => update({ stageId: event.target.value || undefined })}
          >
            <MenuItem value="">مرحله پیش‌فرض</MenuItem>
            {stages.map((stage) => (
              <MenuItem key={stage.id} value={stage.id}>{stage.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <FormControl>
        <InputLabel id="opportunity-priority">اولویت</InputLabel>
        <Select
          labelId="opportunity-priority"
          label="اولویت"
          value={value.priority ?? 'MEDIUM'}
          onChange={(event) => update({ priority: event.target.value as Priority })}
        >
          {COMPANY_PRIORITY_OPTIONS.map((priority) => (
            <MenuItem key={priority.value} value={priority.value}>{priority.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="ارزش تخمینی فرصت"
        type="number"
        slotProps={{ htmlInput: { min: 0 } }}
        value={value.estimatedValue ?? ''}
        onChange={(event) => update({ estimatedValue: numberOrUndefined(event.target.value) })}
      />

      <JalaliDateField
        label="تاریخ پیش‌بینی‌شده بستن فرصت"
        value={value.expectedCloseDate ?? ''}
        onChange={(next) => update({ expectedCloseDate: next })}
      />

      <FormControl disabled={sourceQuery.isLoading || sourceQuery.isError}>
        <InputLabel id="opportunity-source">منبع ایجاد فرصت</InputLabel>
        <Select
          labelId="opportunity-source"
          label="منبع ایجاد فرصت"
          value={value.sourceOptionId ?? ''}
          onChange={(event) => update({
            sourceOptionId: event.target.value || undefined,
            opportunitySource: undefined,
            source: undefined,
          })}
        >
          <MenuItem value="">انتخاب نشده</MenuItem>
          {sourceOptions.map((item) => (
            <MenuItem key={item.id} value={item.id}>{getCatalogItemLabel(item)}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl disabled={!companyId || peopleQuery.isLoading || peopleQuery.isError}>
        <InputLabel id="opportunity-primary-contact">مخاطب اصلی</InputLabel>
        <Select
          labelId="opportunity-primary-contact"
          label="مخاطب اصلی"
          value={value.primaryContactId ?? ''}
          onChange={(event) => update({ primaryContactId: event.target.value || undefined })}
        >
          <MenuItem value="">انتخاب نشده</MenuItem>
          {peopleOptions.map((person) => (
            <MenuItem key={person.id} value={person.id}>{personLabel(person)}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="احتمال موفقیت"
        type="number"
        slotProps={{ htmlInput: { min: 0, max: 100 } }}
        value={value.probability ?? ''}
        onChange={(event) => update({ probability: numberOrUndefined(event.target.value) })}
        helperText="درصد بین ۰ تا ۱۰۰"
      />

      <TextField
        label="رقیب احتمالی"
        value={value.competitor ?? ''}
        onChange={(event) => update({ competitor: event.target.value || undefined })}
      />

      <TextField
        label="شرح نیازمندی / توضیحات فرصت"
        multiline
        minRows={2}
        value={value.description ?? ''}
        onChange={(event) => update({ description: event.target.value || undefined })}
      />

      {sourceQuery.isError && <Alert severity="warning">دریافت منابع ایجاد فرصت با خطا مواجه شد.</Alert>}
      {peopleQuery.isError && <Alert severity="warning">دریافت مخاطبان شرکت با خطا مواجه شد.</Alert>}
      {!sourceQuery.isLoading && !sourceQuery.isError && sourceOptions.length === 0 && (
        <Alert severity="info">هنوز منبع ایجاد فرصتی تعریف نشده است. از بخش کتابخانه‌ها، گزینه‌های پایه، گروه منابع ایجاد فرصت را تکمیل کنید.</Alert>
      )}
    </Stack>
  );
}
