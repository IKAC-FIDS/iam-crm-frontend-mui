import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useOwnerOptions } from '@/features/admin/users/hooks/useAdminUsers';
import { useCompanies } from '@/features/companies/hooks/useCompanies';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import { useOpportunities } from '@/features/opportunities/hooks/useOpportunities';
import { usePeople } from '@/features/people/hooks/usePeople';
import JalaliDateField from '@/shared/components/JalaliDateField';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useCreateTask, useUpdateTask } from '../hooks/useTasks';
import { taskPriorityOptions, taskStatusOptions } from '../utils/taskDisplay';
import type { CompanyListItem } from '@/features/companies/types/company.types';
import type { Opportunity } from '@/features/opportunities/types/opportunity.types';
import type { Person } from '@/features/people/types/person.types';
import type { CreateTaskPayload, Task, TaskPriority, TaskStatus } from '../types/task.types';

type CompanyOption = Pick<CompanyListItem, 'id' | 'legalName' | 'brandName'>;
type OpportunityOption = Pick<Opportunity, 'id' | 'title' | 'company'> & { companyId?: string | null };
type PersonOption = Pick<Person, 'id' | 'fullName' | 'title' | 'jobTitle'>;

function companyLabel(company?: CompanyOption | null): string {
  if (!company) return '';
  return company.brandName || company.legalName || 'شرکت';
}

function opportunityLabel(opportunity?: OpportunityOption | null): string {
  return opportunity?.title || 'فرصت';
}

function personLabel(person?: PersonOption | null): string {
  if (!person) return '';
  const role = person.jobTitle || person.title;
  return role ? `${person.fullName} - ${role}` : person.fullName;
}

function addSelectedOption<T extends { id: string }>(options: T[], selected: T | null): T[] {
  if (!selected || options.some((item) => item.id === selected.id)) return options;
  return [selected, ...options];
}

export default function TaskFormDialog({
  task,
  contextOpportunityId,
  contextOpportunityTitle,
  contextCompanyId,
  contextCompanyName,
  lockOpportunity = false,
  lockCompany = false,
  open,
  onClose,
}: {
  task?: Task | null;
  contextOpportunityId?: string;
  contextOpportunityTitle?: string;
  contextCompanyId?: string;
  contextCompanyName?: string;
  lockOpportunity?: boolean;
  lockCompany?: boolean;
  open: boolean;
  onClose: () => void;
}) {
  const create = useCreateTask();
  const update = useUpdateTask();
  const owners = useOwnerOptions(open);
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'TODO');
  const [priority, setPriority] = useState<TaskPriority>((task?.priority as TaskPriority | undefined) ?? 'MEDIUM');
  const [dueAt, setDueAt] = useState(task?.dueAt ?? '');
  const [reminderAt, setReminderAt] = useState(task?.reminderAt ?? '');
  const [assignedToId, setAssignedToId] = useState(task?.assignedToId ?? '');
  const initialCompany = task?.company
    ? { id: task.company.id, legalName: task.company.legalName || 'شرکت', brandName: task.company.brandName ?? undefined }
    : contextCompanyId
      ? { id: contextCompanyId, legalName: contextCompanyName || 'شرکت جاری' }
      : null;
  const initialOpportunity = task?.opportunity
    ? { id: task.opportunity.id, title: task.opportunity.title || 'فرصت', companyId: task.opportunity.companyId ?? contextCompanyId, company: initialCompany ?? undefined }
    : contextOpportunityId
      ? { id: contextOpportunityId, title: contextOpportunityTitle || 'فرصت جاری', companyId: contextCompanyId, company: initialCompany ?? undefined }
      : null;
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(initialCompany);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityOption | null>(initialOpportunity);
  const [selectedPerson, setSelectedPerson] = useState<PersonOption | null>(
    task?.person ? { id: task.person.id, fullName: task.person.fullName || 'مخاطب', title: task.person.title ?? undefined } : null,
  );
  const [companySearch, setCompanySearch] = useState('');
  const [opportunitySearch, setOpportunitySearch] = useState('');
  const debouncedCompanySearch = useDebouncedValue(companySearch.trim(), 400);
  const debouncedOpportunitySearch = useDebouncedValue(opportunitySearch.trim(), 400);
  const selectedCompanyId = selectedCompany?.id ?? '';
  const selectedOpportunityId = selectedOpportunity?.id ?? '';
  const companyOptionsQuery = useCompanies({ page: 1, limit: 20, search: debouncedCompanySearch || undefined });
  const opportunityOptionsQuery = useOpportunities(
    { page: 1, limit: 20, search: debouncedOpportunitySearch || undefined, companyId: selectedCompanyId || undefined },
    open && !lockOpportunity,
  );
  const peopleQuery = usePeople({ companyId: selectedCompanyId, page: 1, limit: 100 });
  const companyOptions = useMemo(
    () => addSelectedOption(companyOptionsQuery.data?.data ?? [], selectedCompany),
    [companyOptionsQuery.data?.data, selectedCompany],
  );
  const opportunityOptions = useMemo(
    () => addSelectedOption(opportunityOptionsQuery.data?.data ?? [], selectedOpportunity)
      .filter((item) => !selectedCompanyId || !item.companyId || item.companyId === selectedCompanyId),
    [opportunityOptionsQuery.data?.data, selectedCompanyId, selectedOpportunity],
  );
  const peopleOptions = useMemo(
    () => addSelectedOption(peopleQuery.data?.data ?? [], selectedPerson),
    [peopleQuery.data?.data, selectedPerson],
  );
  const pending = create.isPending || update.isPending;

  const selectCompany = (company: CompanyOption | null) => {
    setSelectedCompany(company);
    setSelectedPerson(null);
    if (selectedOpportunity?.companyId && company?.id && selectedOpportunity.companyId !== company.id) setSelectedOpportunity(null);
  };

  const selectOpportunity = (opportunity: OpportunityOption | null) => {
    setSelectedOpportunity(opportunity);
    if (opportunity?.companyId && !lockCompany) {
      setSelectedCompany(opportunity.company
        ? { id: opportunity.companyId, legalName: opportunity.company.legalName, brandName: opportunity.company.brandName ?? undefined }
        : { id: opportunity.companyId, legalName: companyLabel(selectedCompany) || 'شرکت فرصت' });
      setSelectedPerson(null);
    }
  };

  const payload = (): CreateTaskPayload => ({
    title: title.trim(),
    description: description.trim() || undefined,
    status: task ? status : undefined,
    priority,
    dueAt: dueAt || undefined,
    reminderAt: reminderAt || undefined,
    assignedToId: assignedToId || undefined,
    companyId: selectedCompanyId || undefined,
    opportunityId: selectedOpportunityId || undefined,
    personId: selectedPerson?.id || undefined,
  });

  const submit = async () => {
    try {
      if (task) await update.mutateAsync({ id: task.id, payload: payload() });
      else await create.mutateAsync(payload());
      toast.success(task ? 'کار بروزرسانی شد.' : 'کار ایجاد شد.');
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'ذخیره کار انجام نشد.'));
    }
  };

  return (
    <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{task ? 'ویرایش کار' : 'ایجاد کار'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {(create.isError || update.isError) && <Alert severity="error">عملیات کار با خطا مواجه شد.</Alert>}
          <TextField required label="عنوان کار" value={title} onChange={(event) => setTitle(event.target.value)} />
          <TextField label="توضیحات" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
          {(lockCompany || lockOpportunity) && (
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1.5 }}>
              {lockCompany && <Typography variant="body2">شرکت: {companyLabel(selectedCompany) || contextCompanyName || 'شرکت جاری'}</Typography>}
              {lockOpportunity && <Typography variant="body2">فرصت: {opportunityLabel(selectedOpportunity) || contextOpportunityTitle || 'فرصت جاری'}</Typography>}
            </Box>
          )}
          {!lockCompany && (
            <Autocomplete
              options={companyOptions}
              value={selectedCompany}
              loading={companyOptionsQuery.isFetching}
              inputValue={companySearch}
              onInputChange={(_, value) => setCompanySearch(value)}
              onChange={(_, value) => selectCompany(value)}
              getOptionLabel={companyLabel}
              isOptionEqualToValue={(item, value) => item.id === value.id}
              renderInput={(params) => <TextField {...params} label="شرکت" placeholder="انتخاب شرکت" />}
            />
          )}
          {!lockOpportunity && (
            <Autocomplete
              options={opportunityOptions}
              value={selectedOpportunity}
              loading={opportunityOptionsQuery.isFetching}
              inputValue={opportunitySearch}
              onInputChange={(_, value) => setOpportunitySearch(value)}
              onChange={(_, value) => selectOpportunity(value)}
              getOptionLabel={opportunityLabel}
              isOptionEqualToValue={(item, value) => item.id === value.id}
              renderInput={(params) => <TextField {...params} label="فرصت" placeholder={selectedCompanyId ? 'فرصت‌های شرکت انتخاب‌شده' : 'انتخاب فرصت'} />}
            />
          )}
          <Autocomplete
            options={peopleOptions}
            value={selectedPerson}
            loading={peopleQuery.isFetching}
            disabled={!selectedCompanyId && !selectedPerson}
            onChange={(_, value) => setSelectedPerson(value)}
            getOptionLabel={personLabel}
            isOptionEqualToValue={(item, value) => item.id === value.id}
            renderInput={(params) => <TextField {...params} label="مخاطب" placeholder={selectedCompanyId ? 'انتخاب مخاطب' : 'ابتدا شرکت را انتخاب کنید'} />}
          />
          {task && (
            <TextField select label="وضعیت" value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
              {taskStatusOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
            </TextField>
          )}
          <TextField select label="اولویت" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
            {taskPriorityOptions.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}
          </TextField>
          <JalaliDateField label="موعد انجام" includeTime value={dueAt} onChange={(next) => setDueAt(next ?? '')} />
          <JalaliDateField label="زمان یادآوری" includeTime value={reminderAt} onChange={(next) => setReminderAt(next ?? '')} />
          {owners.isError && <Alert severity="warning">دریافت فهرست کاربران انجام نشد؛ انتخاب مسئول در دسترس نیست.</Alert>}
          <TextField select label="مسئول" value={assignedToId} disabled={owners.isError} onChange={(event) => setAssignedToId(event.target.value)}>
            <MenuItem value="">پیش‌فرض سیستم</MenuItem>
            {(owners.data ?? []).map((user) => <MenuItem key={user.id} value={user.id}>{user.fullName} - {user.email}</MenuItem>)}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={!title.trim() || pending}>ذخیره</Button>
      </DialogActions>
    </Dialog>
  );
}
