import axiosInstance from '@/lib/axios';
import type {
  CompanySocialChannel,
  CreateCompanySocialChannelPayload,
  UpdateCompanySocialChannelPayload,
} from '../types/companySocialChannel.types';

function unwrap<T>(payload: T | { data: T }): T {
  return typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data : payload;
}

function unwrapList(payload: CompanySocialChannel[] | { data?: CompanySocialChannel[]; items?: CompanySocialChannel[] }) {
  if (Array.isArray(payload)) return payload;
  return payload.data ?? payload.items ?? [];
}

export const companySocialChannelsService = {
  getCompanySocialChannels: async (companyId: string): Promise<CompanySocialChannel[]> => {
    const response = await axiosInstance.get<CompanySocialChannel[] | { data?: CompanySocialChannel[]; items?: CompanySocialChannel[] }>(`/companies/${companyId}/social-channels`);
    return unwrapList(response.data);
  },
  createCompanySocialChannel: async (companyId: string, payload: CreateCompanySocialChannelPayload): Promise<CompanySocialChannel> => {
    const response = await axiosInstance.post<CompanySocialChannel | { data: CompanySocialChannel }>(`/companies/${companyId}/social-channels`, payload);
    return unwrap(response.data);
  },
  updateCompanySocialChannel: async (companyId: string, channelId: string, payload: UpdateCompanySocialChannelPayload): Promise<CompanySocialChannel> => {
    const response = await axiosInstance.patch<CompanySocialChannel | { data: CompanySocialChannel }>(`/companies/${companyId}/social-channels/${channelId}`, payload);
    return unwrap(response.data);
  },
  deleteCompanySocialChannel: async (companyId: string, channelId: string): Promise<void> => {
    await axiosInstance.delete(`/companies/${companyId}/social-channels/${channelId}`);
  },
};
