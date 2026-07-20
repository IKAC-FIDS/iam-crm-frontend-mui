import { useMemo, useState } from 'react';
import { Autocomplete, Button, Stack, TextField } from '@mui/material';
import { useDebouncedValue } from '@/features/companies/hooks/useDebouncedValue';
import { useProductCatalog } from '@/features/productCatalog/hooks/useProductCatalog';
import type { ProductCatalogItem } from '@/features/productCatalog/types/productCatalog.types';

export default function ReportProductMultiAutocomplete({ value, onChange }: { value: string[]; onChange: (ids: string[]) => void }) {
  const [search, setSearch] = useState(''); const [page, setPage] = useState(1); const [known, setKnown] = useState<ProductCatalogItem[]>([]); const debounced = useDebouncedValue(search, 350);
  const query = useProductCatalog({ page, limit: 20, search: debounced || undefined, active: true });
  const options = useMemo(() => { const map = new Map(known.map((x) => [x.id, x])); for (const x of query.data?.data ?? []) map.set(x.id, x); return [...map.values()]; }, [known, query.data]);
  const selected = options.filter((x) => value.includes(x.id));
  return <Stack spacing={1}><Autocomplete multiple options={options} value={selected} loading={query.isFetching} filterOptions={(x) => x} getOptionLabel={(x) => `${x.code} — ${x.name}`} isOptionEqualToValue={(a,b) => a.id === b.id} onInputChange={(_, v, reason) => { if (reason === 'input') { setSearch(v); setPage(1); } }} onChange={(_, items) => { setKnown((old) => [...new Map([...old, ...items].map((x) => [x.id, x])).values()]); onChange(items.map((x) => x.id)); }} renderInput={(params) => <TextField {...params} label="محصولات" helperText={query.isError ? 'دریافت گزینه‌های محصول انجام نشد؛ سایر فیلترها فعال‌اند.' : 'جست‌وجوی محصولات سمت سرور انجام می‌شود.'} error={query.isError} />} />{query.data?.meta.hasNext && <Button size="small" onClick={() => setPage((p) => p + 1)}>نمایش گزینه‌های بیشتر</Button>}</Stack>;
}
