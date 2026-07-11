import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commercialDocumentKeys } from '@/features/commercialDocuments/hooks/useCommercialDocuments';
import { opportunityKeys } from '@/features/opportunities/hooks/useOpportunities';
import { paymentsService } from '../services/payments.service';
import type {
  CancelPaymentPayload,
  CreateOpportunityPaymentPayload,
  MarkPaymentPaidPayload,
  PaymentListParams,
  UpdateOpportunityPaymentPayload,
} from '../types/payment.types';

export const paymentKeys = {
  all: ['payments'] as const,
  list: (opportunityId: string, params?: PaymentListParams) => ['payments', opportunityId, 'list', params] as const,
  detail: (opportunityId: string, paymentId: string) => ['payments', opportunityId, 'detail', paymentId] as const,
};

function useInvalidatePayments(opportunityId: string, companyId?: string) {
  const client = useQueryClient();
  return (paymentId?: string) => Promise.all([
    client.invalidateQueries({ queryKey: ['payments', opportunityId] }),
    paymentId ? client.invalidateQueries({ queryKey: paymentKeys.detail(opportunityId, paymentId) }) : Promise.resolve(),
    client.invalidateQueries({ queryKey: ['commercial-documents', opportunityId] }),
    client.invalidateQueries({ queryKey: commercialDocumentKeys.all }),
    client.invalidateQueries({ queryKey: opportunityKeys.detail(opportunityId) }),
    client.invalidateQueries({ queryKey: opportunityKeys.all }),
    client.invalidateQueries({ queryKey: ['pipeline'] }),
    client.invalidateQueries({ queryKey: ['company-opportunities', companyId] }),
    client.invalidateQueries({ queryKey: ['companies', 'detail', companyId] }),
  ]);
}

export function usePayments(opportunityId: string, params: PaymentListParams = {}, enabled = true) {
  return useQuery({
    queryKey: paymentKeys.list(opportunityId, params),
    queryFn: () => paymentsService.list(opportunityId, params),
    placeholderData: keepPreviousData,
    enabled: enabled && Boolean(opportunityId),
  });
}

export function useCreatePayment(opportunityId: string, companyId?: string) {
  const invalidate = useInvalidatePayments(opportunityId, companyId);
  return useMutation({
    mutationFn: (payload: CreateOpportunityPaymentPayload) => paymentsService.create(opportunityId, payload),
    onSuccess: (data) => invalidate(data.id),
  });
}

export function useUpdatePayment(opportunityId: string, companyId?: string) {
  const invalidate = useInvalidatePayments(opportunityId, companyId);
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOpportunityPaymentPayload }) =>
      paymentsService.update(opportunityId, id, payload),
    onSuccess: (_data, vars) => invalidate(vars.id),
  });
}

export function useMarkPaymentPaid(opportunityId: string, companyId?: string) {
  const invalidate = useInvalidatePayments(opportunityId, companyId);
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: MarkPaymentPaidPayload }) =>
      paymentsService.markPaid(opportunityId, id, payload),
    onSuccess: (_data, vars) => invalidate(vars.id),
  });
}

export function useCancelPayment(opportunityId: string, companyId?: string) {
  const invalidate = useInvalidatePayments(opportunityId, companyId);
  return useMutation({
    mutationFn: ({ id }: { id: string; payload?: CancelPaymentPayload }) =>
      paymentsService.cancel(opportunityId, id),
    onSuccess: (_data, vars) => invalidate(vars.id),
  });
}

export function useDeletePayment(opportunityId: string, companyId?: string) {
  const invalidate = useInvalidatePayments(opportunityId, companyId);
  return useMutation({
    mutationFn: (id: string) => paymentsService.remove(opportunityId, id),
    onSuccess: (_data, id) => invalidate(id),
  });
}
