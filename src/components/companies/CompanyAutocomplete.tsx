import { useState, type HTMLAttributes, type ReactNode, type UIEvent } from 'react';
import { Autocomplete, Box, CircularProgress, ListItemText, TextField } from '@mui/material';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import { useCompanyOptionById, useCompanyOptions } from '@/features/companies/hooks/useCompanies';
import type { CompanyOption } from '@/features/companies/types/company.types';
import { getCompanyLabel } from '@/features/companies/utils/companyOption';

const PAGE_SIZE = 25;

function uniqueOptions(options: CompanyOption[]): CompanyOption[] {
  return Array.from(new Map(options.map((option) => [option.id, option])).values());
}

function secondaryLabel(company: CompanyOption): string | undefined {
  const parts = [
    company.nationalId ? `شناسه ملی: ${company.nationalId}` : '',
    company.registrationNumber ? `شماره ثبت: ${company.registrationNumber}` : '',
  ].filter(Boolean);
  return parts.length ? parts.join(' — ') : undefined;
}

interface CommonProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: ReactNode;
  excludeCompanyId?: string;
  excludeOptionIds?: string[];
  allowClear?: boolean;
  fullWidth?: boolean;
}

interface SingleProps extends CommonProps {
  value: CompanyOption | null;
  onChange: (value: CompanyOption | null) => void;
}

interface MultipleProps extends CommonProps {
  value: CompanyOption[];
  onChange: (value: CompanyOption[]) => void;
}

function useRemoteOptions(selected: CompanyOption[], excludeCompanyId?: string, disabled?: boolean) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const debouncedSearch = useDebouncedValue(inputValue.trim(), 400);
  const query = useCompanyOptions({ search: debouncedSearch, excludeId: excludeCompanyId, limit: PAGE_SIZE }, open && !disabled);
  const selectedId = selected.length === 1 ? selected[0]?.id : undefined;
  const selectedNeedsHydration = Boolean(selectedId && !getCompanyLabel(selected[0]));
  const selectedQuery = useCompanyOptionById(selectedId, selectedNeedsHydration && !disabled);
  const hydratedSelected = selectedNeedsHydration && selectedQuery.data ? [selectedQuery.data] : selected;
  const options = uniqueOptions([...hydratedSelected, ...(query.data?.pages.flatMap((page) => page.data) ?? [])]);
  const onListScroll = (event: UIEvent<HTMLElement>) => {
    const list = event.currentTarget;
    if (list.scrollHeight - list.scrollTop - list.clientHeight < 80 && query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  };
  return { open, setOpen, setInputValue, options, hydratedSelected, query, onListScroll };
}

function renderOption(props: HTMLAttributes<HTMLLIElement>, option: CompanyOption) {
  return <Box component="li" {...props} key={option.id}><ListItemText primary={getCompanyLabel(option)} secondary={secondaryLabel(option)} /></Box>;
}

export function CompanyAutocomplete({ value, onChange, label = 'شرکت', placeholder = 'برای جستجو نام شرکت را وارد کنید', disabled, required, error, helperText, excludeCompanyId, excludeOptionIds = [], allowClear = true, fullWidth = true }: SingleProps) {
  const remote = useRemoteOptions(value ? [value] : [], excludeCompanyId, disabled);
  const options = remote.options.filter((option) => option.id === value?.id || !excludeOptionIds.includes(option.id));
  return <Autocomplete<CompanyOption, false, boolean, false>
    open={remote.open}
    onOpen={() => remote.setOpen(true)}
    onClose={() => remote.setOpen(false)}
    options={options}
    value={remote.hydratedSelected[0] ?? value}
    onInputChange={(_, next, reason) => remote.setInputValue(reason === 'input' ? next : '')}
    onChange={(_, next) => onChange(next)}
    loading={remote.query.isLoading || remote.query.isFetchingNextPage}
    disabled={disabled}
    disableClearable={!allowClear}
    filterOptions={(items) => items}
    getOptionLabel={getCompanyLabel}
    isOptionEqualToValue={(option, selected) => option.id === selected.id}
    noOptionsText={remote.query.isError ? 'خطا در دریافت فهرست شرکت‌ها' : 'شرکتی یافت نشد'}
    loadingText="در حال دریافت شرکت‌ها..."
    renderOption={renderOption}
    slotProps={{ listbox: { onScroll: remote.onListScroll } }}
    renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder} required={required} error={error || remote.query.isError} helperText={remote.query.isError ? 'خطا در دریافت فهرست شرکت‌ها' : helperText} fullWidth={fullWidth} slotProps={{ ...params.slotProps, input: { ...params.slotProps.input, endAdornment: <>{remote.query.isFetching && <CircularProgress color="inherit" size={18} />}{params.slotProps.input.endAdornment}</> } }} />}
  />;
}

export function CompanyMultiAutocomplete({ value, onChange, label = 'شرکت', placeholder = 'برای جستجو نام شرکت را وارد کنید', disabled, required, error, helperText, excludeCompanyId, excludeOptionIds = [], fullWidth = true }: MultipleProps) {
  const remote = useRemoteOptions(value, excludeCompanyId, disabled);
  const selectedIds = new Set(value.map((option) => option.id));
  const options = remote.options.filter((option) => selectedIds.has(option.id) || !excludeOptionIds.includes(option.id));
  return <Autocomplete<CompanyOption, true>
    multiple
    open={remote.open}
    onOpen={() => remote.setOpen(true)}
    onClose={() => remote.setOpen(false)}
    options={options}
    value={value}
    onInputChange={(_, next, reason) => remote.setInputValue(reason === 'input' ? next : '')}
    onChange={(_, next) => onChange(next)}
    loading={remote.query.isLoading || remote.query.isFetchingNextPage}
    disabled={disabled}
    filterOptions={(items) => items}
    getOptionLabel={getCompanyLabel}
    isOptionEqualToValue={(option, selected) => option.id === selected.id}
    noOptionsText={remote.query.isError ? 'خطا در دریافت فهرست شرکت‌ها' : 'شرکتی یافت نشد'}
    loadingText="در حال دریافت شرکت‌ها..."
    renderOption={renderOption}
    slotProps={{ listbox: { onScroll: remote.onListScroll } }}
    renderInput={(params) => <TextField {...params} label={label} placeholder={placeholder} required={required} error={error || remote.query.isError} helperText={remote.query.isError ? 'خطا در دریافت فهرست شرکت‌ها' : helperText} fullWidth={fullWidth} slotProps={{ ...params.slotProps, input: { ...params.slotProps.input, endAdornment: <>{remote.query.isFetching && <CircularProgress color="inherit" size={18} />}{params.slotProps.input.endAdornment}</> } }} />}
  />;
}
