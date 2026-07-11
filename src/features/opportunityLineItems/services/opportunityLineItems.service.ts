import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, unwrapPaginatedApiResponse } from '@/lib/apiResponse';
import type {
  CreateOpportunityLineItemPayload,
  OpportunityLineItem,
  UpdateOpportunityLineItemPayload,
} from '../types/opportunityLineItem.types';

function cleanPayload<T extends CreateOpportunityLineItemPayload | UpdateOpportunityLineItemPayload>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== ''),
  ) as T;
}

const base = (opportunityId: string) => `/opportunities/${opportunityId}/line-items`;

export const opportunityLineItemsService = {
  list: async (opportunityId: string): Promise<OpportunityLineItem[]> =>
    unwrapPaginatedApiResponse<OpportunityLineItem>((await axiosInstance.get<unknown>(base(opportunityId))).data).data,
  get: async (opportunityId: string, lineItemId: string): Promise<OpportunityLineItem> =>
    unwrapApiResponse<OpportunityLineItem>((await axiosInstance.get<unknown>(`${base(opportunityId)}/${lineItemId}`)).data),
  create: async (opportunityId: string, payload: CreateOpportunityLineItemPayload): Promise<OpportunityLineItem> =>
    unwrapApiResponse<OpportunityLineItem>(
      (await axiosInstance.post<unknown>(base(opportunityId), cleanPayload(payload))).data,
    ),
  update: async (
    opportunityId: string,
    lineItemId: string,
    payload: UpdateOpportunityLineItemPayload,
  ): Promise<OpportunityLineItem> =>
    unwrapApiResponse<OpportunityLineItem>(
      (await axiosInstance.patch<unknown>(`${base(opportunityId)}/${lineItemId}`, cleanPayload(payload))).data,
    ),
  remove: async (opportunityId: string, lineItemId: string): Promise<void> => {
    await axiosInstance.delete(`${base(opportunityId)}/${lineItemId}`);
  },
};
