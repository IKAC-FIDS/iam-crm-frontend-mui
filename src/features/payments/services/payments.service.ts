import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, unwrapPaginatedApiResponse } from '@/lib/apiResponse';
import type {
  CreateOpportunityPaymentPayload,
  MarkPaymentPaidPayload,
  OpportunityPayment,
  PaymentListParams,
  PaymentPage,
  UpdateOpportunityPaymentPayload,
} from '../types/payment.types';

const base = (opportunityId: string) => `/opportunities/${opportunityId}/payments`;

const cleanParams = (value: PaymentListParams) =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));

function cleanPayload<T extends CreateOpportunityPaymentPayload | UpdateOpportunityPaymentPayload | MarkPaymentPaidPayload>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== ''),
  ) as T;
}

export const paymentsService = {
  list: async (opportunityId: string, query: PaymentListParams = {}): Promise<PaymentPage> =>
    unwrapPaginatedApiResponse<OpportunityPayment>(
      (await axiosInstance.get<unknown>(base(opportunityId), { params: cleanParams(query) })).data,
    ),
  get: async (opportunityId: string, paymentId: string): Promise<OpportunityPayment> =>
    unwrapApiResponse<OpportunityPayment>((await axiosInstance.get<unknown>(`${base(opportunityId)}/${paymentId}`)).data),
  create: async (opportunityId: string, payload: CreateOpportunityPaymentPayload): Promise<OpportunityPayment> =>
    unwrapApiResponse<OpportunityPayment>((await axiosInstance.post<unknown>(base(opportunityId), cleanPayload(payload))).data),
  update: async (opportunityId: string, paymentId: string, payload: UpdateOpportunityPaymentPayload): Promise<OpportunityPayment> =>
    unwrapApiResponse<OpportunityPayment>((await axiosInstance.patch<unknown>(`${base(opportunityId)}/${paymentId}`, cleanPayload(payload))).data),
  markPaid: async (opportunityId: string, paymentId: string, payload: MarkPaymentPaidPayload): Promise<OpportunityPayment> =>
    unwrapApiResponse<OpportunityPayment>((await axiosInstance.patch<unknown>(`${base(opportunityId)}/${paymentId}/mark-paid`, cleanPayload(payload))).data),
  cancel: async (opportunityId: string, paymentId: string): Promise<OpportunityPayment> =>
    unwrapApiResponse<OpportunityPayment>((await axiosInstance.patch<unknown>(`${base(opportunityId)}/${paymentId}/cancel`)).data),
  remove: async (opportunityId: string, paymentId: string): Promise<void> => {
    await axiosInstance.delete(`${base(opportunityId)}/${paymentId}`);
  },
};
