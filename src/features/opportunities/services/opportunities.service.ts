import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, unwrapPaginatedApiResponse } from '@/lib/apiResponse';
import type { CompanyOpportunityPayload, Opportunity, OpportunityListParams, OpportunityPage, OpportunityPayload, UpdateOpportunityPayload } from '../types/opportunity.types';

const params = (value: OpportunityListParams) => Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));

export const opportunitiesService = {
  list: async (query: OpportunityListParams): Promise<OpportunityPage> => unwrapPaginatedApiResponse<Opportunity>((await axiosInstance.get<unknown>('/opportunities', { params: params(query) })).data),
  listByCompany: async (companyId: string, query: OpportunityListParams): Promise<OpportunityPage> => unwrapPaginatedApiResponse<Opportunity>((await axiosInstance.get<unknown>(`/companies/${companyId}/opportunities`, { params: params(query) })).data),
  get: async (id: string) => unwrapApiResponse<Opportunity>((await axiosInstance.get<unknown>(`/opportunities/${id}`)).data),
  create: async (payload: OpportunityPayload) => unwrapApiResponse<Opportunity>((await axiosInstance.post<unknown>('/opportunities', payload)).data),
  createForCompany: async (companyId: string, payload: CompanyOpportunityPayload) => unwrapApiResponse<Opportunity>((await axiosInstance.post<unknown>(`/companies/${companyId}/opportunities`, payload)).data),
  update: async (id: string, payload: UpdateOpportunityPayload) => unwrapApiResponse<Opportunity>((await axiosInstance.patch<unknown>(`/opportunities/${id}`, payload)).data),
  changeStage: async (id: string, stageId: string, note?: string) => unwrapApiResponse<Opportunity>((await axiosInstance.patch<unknown>(`/opportunities/${id}/stage`, { stageId, note: note || undefined })).data),
  changeOwner: async (id: string, ownerId: string | null) => unwrapApiResponse<Opportunity>((await axiosInstance.patch<unknown>(`/opportunities/${id}/owner`, { ownerId })).data),
  archive: async (id: string, reason?: string) => unwrapApiResponse<Opportunity>((await axiosInstance.patch<unknown>(`/opportunities/${id}/archive`, { reason: reason || undefined })).data),
  restore: async (id: string) => unwrapApiResponse<Opportunity>((await axiosInstance.patch<unknown>(`/opportunities/${id}/restore`)).data),
};
