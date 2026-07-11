import axiosInstance from '@/lib/axios';
import { unwrapApiResponse } from '@/lib/apiResponse';
import type {
  CompanySocialChannel,
  CreateCompanySocialChannelPayload,
  UpdateCompanySocialChannelPayload,
} from '../types/companySocialChannel.types';

function unwrapList(payload: unknown) {
  const value = unwrapApiResponse<unknown>(payload);
  if (Array.isArray(value)) return value as CompanySocialChannel[];
  return value && typeof value === 'object' && 'items' in value && Array.isArray((value as { items?: unknown }).items)
    ? (value as { items: CompanySocialChannel[] }).items
    : [];
}

export const companySocialChannelsService = {
  getCompanySocialChannels: async (companyId: string): Promise<CompanySocialChannel[]> => {
    const response = await axiosInstance.get<CompanySocialChannel[] | { data?: CompanySocialChannel[]; items?: CompanySocialChannel[] }>(`/companies/${companyId}/social-channels`);
    return unwrapList(response.data);
  },
  createCompanySocialChannel: async (companyId: string, payload: CreateCompanySocialChannelPayload): Promise<CompanySocialChannel> => {
    const response = await axiosInstance.post<CompanySocialChannel | { data: CompanySocialChannel }>(`/companies/${companyId}/social-channels`, payload);
    return unwrapApiResponse<CompanySocialChannel>(response.data);
  },
  updateCompanySocialChannel: async (companyId: string, channelId: string, payload: UpdateCompanySocialChannelPayload): Promise<CompanySocialChannel> => {
    const response = await axiosInstance.patch<CompanySocialChannel | { data: CompanySocialChannel }>(`/companies/${companyId}/social-channels/${channelId}`, payload);
    return unwrapApiResponse<CompanySocialChannel>(response.data);
  },
  deleteCompanySocialChannel: async (companyId: string, channelId: string): Promise<void> => {
    await axiosInstance.delete(`/companies/${companyId}/social-channels/${channelId}`);
  },
};
