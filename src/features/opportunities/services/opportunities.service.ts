import axiosInstance from '@/lib/axios';
import type { CompanyOpportunityPayload, Opportunity, OpportunityListParams, OpportunityPage, OpportunityPayload, UpdateOpportunityPayload } from '../types/opportunity.types';

const params = (value: OpportunityListParams) => Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));
const unwrap = <T,>(value: T | { data: T }): T => typeof value === 'object' && value !== null && 'data' in value ? value.data : value;

export const opportunitiesService = {
  list: async (query: OpportunityListParams) => (await axiosInstance.get<OpportunityPage>('/opportunities', { params: params(query) })).data,
  listByCompany: async (companyId: string, query: OpportunityListParams) => (await axiosInstance.get<OpportunityPage>(`/companies/${companyId}/opportunities`, { params: params(query) })).data,
  get: async (id: string) => unwrap((await axiosInstance.get<Opportunity | { data: Opportunity }>(`/opportunities/${id}`)).data),
  create: async (payload: OpportunityPayload) => unwrap((await axiosInstance.post<Opportunity | { data: Opportunity }>('/opportunities', payload)).data),
  createForCompany: async (companyId: string, payload: CompanyOpportunityPayload) => unwrap((await axiosInstance.post<Opportunity | { data: Opportunity }>(`/companies/${companyId}/opportunities`, payload)).data),
  update: async (id: string, payload: UpdateOpportunityPayload) => unwrap((await axiosInstance.patch<Opportunity | { data: Opportunity }>(`/opportunities/${id}`, payload)).data),
  changeStage: async (id: string, stageId: string, note?: string) => unwrap((await axiosInstance.patch<Opportunity | { data: Opportunity }>(`/opportunities/${id}/stage`, { stageId, note: note || undefined })).data),
  changeOwner: async (id: string, ownerId: string | null) => unwrap((await axiosInstance.patch<Opportunity | { data: Opportunity }>(`/opportunities/${id}/owner`, { ownerId })).data),
  archive: async (id: string, reason?: string) => unwrap((await axiosInstance.patch<Opportunity | { data: Opportunity }>(`/opportunities/${id}/archive`, { reason: reason || undefined })).data),
  restore: async (id: string) => unwrap((await axiosInstance.patch<Opportunity | { data: Opportunity }>(`/opportunities/${id}/restore`)).data),
};
