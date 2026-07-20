import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useProductCatalog } from '@/features/productCatalog/hooks/useProductCatalog';
import type { ProductCatalogItem } from '@/features/productCatalog/types/productCatalog.types';
import { useCreateOpportunityLineItem, useUpdateOpportunityLineItem } from '../hooks/useOpportunityLineItems';
import type {
  CreateOpportunityLineItemPayload,
  OpportunityLineItem,
  UpdateOpportunityLineItemPayload,
} from '../types/opportunityLineItem.types';
import { calculateLineTotalPreview, formatMoney } from '../utils/money';

export default function OpportunityLineItemFormDialog({
  opportunityId,
  companyId,
  item,
  currency,
  open,
  onClose,
}: {
  opportunityId: string;
  companyId?: string;
  item: OpportunityLineItem | null;
  currency?: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const create = useCreateOpportunityLineItem(opportunityId, companyId);
  const update = useUpdateOpportunityLineItem(opportunityId, companyId);
  const products = useProductCatalog({ page: 1, limit: 100, active: true }, open);
  const [product, setProduct] = useState<ProductCatalogItem | null>(item?.product ?? null);
  const [description, setDescription] = useState(item?.description ?? '');
  const [quantity, setQuantity] = useState(String(item?.quantity ?? '1'));
  const [unitPrice, setUnitPrice] = useState(String(item?.unitPrice ?? item?.product?.inPersonPriceIrr ?? item?.product?.defaultUnitPrice ?? '0'));
  const [discountAmount, setDiscountAmount] = useState(String(item?.discountAmount ?? '0'));
  const [taxAmount, setTaxAmount] = useState(String(item?.taxAmount ?? '0'));
  const [sortOrder, setSortOrder] = useState(String(item?.sortOrder ?? 0));
  const pending = create.isPending || update.isPending;
  const productOptions = products.data?.data ?? [];
  const previewCurrency = product?.currency ?? currency;
  const preview = useMemo(
    () => calculateLineTotalPreview(quantity, unitPrice, discountAmount, taxAmount),
    [discountAmount, quantity, taxAmount, unitPrice],
  );

  const submit = async () => {
    const basePayload: UpdateOpportunityLineItemPayload = {
      description: description.trim() || undefined,
      quantity: quantity.trim(),
      unitPrice: unitPrice.trim() || undefined,
      discountAmount: discountAmount.trim() || undefined,
      taxAmount: taxAmount.trim() || undefined,
      sortOrder: Number(sortOrder) || 0,
    };

    try {
      if (item) await update.mutateAsync({ id: item.id, payload: basePayload });
      else {
        const createPayload: CreateOpportunityLineItemPayload = {
          ...basePayload,
          productId: product?.id,
          quantity: quantity.trim(),
        };
        await create.mutateAsync(createPayload);
      }
      toast.success(item ? 'آیتم فرصت بروزرسانی شد.' : 'آیتم فرصت ایجاد شد.');
      onClose();
    } catch {
      toast.error('ذخیره آیتم فرصت انجام نشد.');
    }
  };

  const valid = Boolean(quantity.trim()) && Number.isFinite(Number(quantity)) && Number.isFinite(Number(sortOrder));

  return (
    <Dialog open={open} onClose={() => !pending && onClose()} fullWidth maxWidth="sm">
      <DialogTitle>{item ? 'ویرایش آیتم فرصت' : 'افزودن آیتم فرصت'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {(create.isError || update.isError) && <Alert severity="error">عملیات آیتم فرصت با خطا مواجه شد.</Alert>}
          <Autocomplete
            options={productOptions}
            value={product}
            loading={products.isFetching}
            disabled={Boolean(item)}
            getOptionLabel={(option) => `${option.code} - ${option.name}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => {
              setProduct(value);
              if (value) {
                setUnitPrice(String(value.inPersonPriceIrr ?? value.defaultUnitPrice ?? '0'));
                if (!description.trim()) setDescription(value.name);
              }
            }}
            renderInput={(params) => <TextField {...params} label="محصول" />}
          />
          <TextField label="شرح" multiline minRows={2} value={description} onChange={(event) => setDescription(event.target.value)} />
          <TextField required label="تعداد" inputMode="decimal" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          <TextField label="قیمت واحد" inputMode="decimal" value={unitPrice} onChange={(event) => setUnitPrice(event.target.value)} />
          <TextField label="تخفیف" inputMode="decimal" value={discountAmount} onChange={(event) => setDiscountAmount(event.target.value)} />
          <TextField label="مالیات" inputMode="decimal" value={taxAmount} onChange={(event) => setTaxAmount(event.target.value)} />
          <TextField required label="ترتیب نمایش" type="number" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} />
          <Typography color="text.secondary">پیش‌نمایش مبلغ: {formatMoney(preview, previewCurrency)}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending}>انصراف</Button>
        <Button variant="contained" onClick={submit} disabled={!valid || pending}>ذخیره</Button>
      </DialogActions>
    </Dialog>
  );
}
