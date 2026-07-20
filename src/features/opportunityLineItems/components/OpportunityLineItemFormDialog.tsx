import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Alert, Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useProductCatalog } from '@/features/productCatalog/hooks/useProductCatalog';
import type { ProductCatalogItem } from '@/features/productCatalog/types/productCatalog.types';
import { getApiErrorMessage } from '@/lib/apiResponse';
import { useCreateOpportunityLineItem, useUpdateOpportunityLineItem } from '../hooks/useOpportunityLineItems';
import type { CreateOpportunityLineItemPayload, OpportunityLineItem, SalesChannel, UpdateOpportunityLineItemPayload } from '../types/opportunityLineItem.types';
import { calculateLineTotalPreview, formatIrrPrice, formatMoney, toNumberSafe } from '../utils/money';
import { salesChannelLabel, selectableSalesChannels } from '../utils/salesChannel';

type WritableChannel = Exclude<SalesChannel, 'LEGACY_UNKNOWN'>;
export default function OpportunityLineItemFormDialog({ opportunityId, companyId, item, currency, open, onClose }: { opportunityId: string; companyId?: string; item: OpportunityLineItem | null; currency?: string | null; open: boolean; onClose: () => void }) {
  const create = useCreateOpportunityLineItem(opportunityId, companyId); const update = useUpdateOpportunityLineItem(opportunityId, companyId);
  const products = useProductCatalog({ page: 1, limit: 100, active: true }, open);
  const [product, setProduct] = useState<ProductCatalogItem | null>(item?.product ?? null);
  const [channel, setChannel] = useState<SalesChannel>(item?.salesChannel ?? 'IN_PERSON');
  const [description, setDescription] = useState(item?.description ?? ''); const [quantity, setQuantity] = useState(String(item?.quantity ?? '1'));
  const [unitPrice, setUnitPrice] = useState(String(item?.unitPrice ?? item?.product?.inPersonPriceIrr ?? ''));
  const [discountAmount, setDiscountAmount] = useState(String(item?.discountAmount ?? '0')); const [taxAmount, setTaxAmount] = useState(String(item?.taxAmount ?? '0')); const [sortOrder, setSortOrder] = useState(String(item?.sortOrder ?? 0));
  const pending = create.isPending || update.isPending; const options = products.data?.data ?? [];
  const catalogPrice = channel === 'LEGACY_UNKNOWN' ? item?.catalogUnitPriceIrrSnapshot : channel === 'IN_PERSON' ? product?.inPersonPriceIrr : channel === 'DIGIKALA' ? product?.digikalaPriceIrr : null;
  const preview = useMemo(() => calculateLineTotalPreview(quantity, unitPrice, discountAmount, taxAmount), [quantity, unitPrice, discountAmount, taxAmount]);
  const difference = catalogPrice == null ? null : toNumberSafe(unitPrice) - toNumberSafe(catalogPrice); const percent = difference !== null && toNumberSafe(catalogPrice) > 0 ? difference / toNumberSafe(catalogPrice) * 100 : null;
  const chooseChannel = (next: WritableChannel) => { setChannel(next); if (next === 'IN_PERSON' && product) setUnitPrice(String(product.inPersonPriceIrr)); if (next === 'DIGIKALA' && product) setUnitPrice(String(product.digikalaPriceIrr)); if (next === 'OTHER') setUnitPrice(''); };
  const submit = async () => { const payload: UpdateOpportunityLineItemPayload = { description: description.trim() || undefined, quantity: quantity.trim(), unitPrice: unitPrice.trim() || undefined, discountAmount: discountAmount.trim() || undefined, taxAmount: taxAmount.trim() || undefined, sortOrder: Number(sortOrder) || 0 };
    if (item && product?.id !== item.productId) payload.productId = product?.id ?? null;
    if (channel !== 'LEGACY_UNKNOWN') payload.salesChannel = channel;
    try { if (item) await update.mutateAsync({ id: item.id, payload }); else await create.mutateAsync({ ...payload, productId: product?.id, quantity: quantity.trim(), salesChannel: channel as WritableChannel } as CreateOpportunityLineItemPayload); toast.success(item ? 'ردیف فرصت به‌روزرسانی شد.' : 'ردیف فرصت ایجاد شد.'); onClose(); } catch (error) { toast.error(getApiErrorMessage(error, 'ذخیره ردیف فرصت انجام نشد.')); } };
  const valid = Number(quantity) > 0 && Number.isFinite(Number(sortOrder)) && (channel !== 'OTHER' || (unitPrice.trim() !== '' && Number(unitPrice) >= 0));
  return <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="sm"><DialogTitle>{item ? 'ویرایش ردیف فرصت' : 'افزودن ردیف فرصت'}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
    {(create.isError || update.isError) && <Alert severity="error">{getApiErrorMessage(create.error ?? update.error, 'عملیات ردیف فرصت با خطا مواجه شد.')}</Alert>}
    {channel === 'LEGACY_UNKNOWN' && <Alert severity="warning">کانال فروش این ردیف تاریخی مشخص نیست.</Alert>}
    <Autocomplete options={options} value={product} loading={products.isFetching} getOptionLabel={(o) => `${o.code} - ${o.name}`} isOptionEqualToValue={(a, b) => a.id === b.id} onChange={(_, value) => { setProduct(value); if (value) { setChannel('IN_PERSON'); setUnitPrice(String(value.inPersonPriceIrr)); if (!description.trim()) setDescription(value.name); } else { setChannel('OTHER'); setUnitPrice(''); } }} renderInput={(params) => <TextField {...params} label="محصول" />} />
    <TextField select label="کانال فروش" value={channel} onChange={(e) => chooseChannel(e.target.value as WritableChannel)}>{channel === 'LEGACY_UNKNOWN' && <MenuItem value="LEGACY_UNKNOWN" disabled>{salesChannelLabel('LEGACY_UNKNOWN')}</MenuItem>}{selectableSalesChannels.map((x) => <MenuItem key={x.value} value={x.value}>{x.label}</MenuItem>)}</TextField>
    {channel === 'OTHER' ? <Alert severity="info">برای کانال توافقی snapshot قیمت کاتالوگ ثبت نمی‌شود و قیمت واقعی باید صریح وارد شود.</Alert> : <Typography>قیمت کاتالوگ انتخاب‌شده: {catalogPrice == null ? 'ناموجود' : formatIrrPrice(catalogPrice)}</Typography>}
    <TextField label="شرح" multiline minRows={2} value={description} onChange={(e) => setDescription(e.target.value)} /><TextField required label="تعداد" inputMode="decimal" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
    <TextField required={channel === 'OTHER'} label="قیمت واقعی/توافقی این ردیف" inputMode="decimal" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}><Typography>اختلاف مبلغ: {difference === null ? 'ناموجود' : formatIrrPrice(String(difference))}</Typography><Typography>درصد اختلاف: {percent === null || !Number.isFinite(percent) ? 'ناموجود' : `${percent.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}٪`}</Typography></Stack>
    <TextField label="تخفیف" inputMode="decimal" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} /><TextField label="مالیات" inputMode="decimal" value={taxAmount} onChange={(e) => setTaxAmount(e.target.value)} /><TextField required label="ترتیب نمایش" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} /><Typography color="text.secondary">پیش‌نمایش مبلغ: {formatMoney(preview, product?.currency ?? currency)}</Typography>
  </Stack></DialogContent><DialogActions><Button onClick={onClose} disabled={pending}>انصراف</Button><Button variant="contained" onClick={submit} disabled={!valid || pending}>ذخیره</Button></DialogActions></Dialog>;
}
