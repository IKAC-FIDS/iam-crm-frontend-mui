import axios from 'axios';
import axiosInstance from '@/lib/axios';
import { unwrapApiResponse } from '@/lib/apiResponse';
import type {
  CallCard,
  CallCardSuggestion,
  UpsertCallCardPayload,
} from '../types/callCard.types';

export const callCardsService = {
  getCallCard: async (companyId: string): Promise<CallCard | null> => {
    try {
      const response = await axiosInstance.get<CallCard | { data: CallCard | null }>(
        `/companies/${companyId}/call-card`,
      );
      if (!response.data) return null;
      return unwrapApiResponse<CallCard | null>(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  },

  suggestCallCard: async (companyId: string): Promise<CallCardSuggestion> => {
    const response = await axiosInstance.get<CallCardSuggestion | { data: CallCardSuggestion }>(
      `/companies/${companyId}/call-card/suggest`,
    );
    return unwrapApiResponse<CallCardSuggestion>(response.data);
  },

  upsertCallCard: async (
    companyId: string,
    payload: UpsertCallCardPayload,
  ): Promise<CallCard> => {
    const response = await axiosInstance.put<CallCard | { data: CallCard }>(
      `/companies/${companyId}/call-card`,
      payload,
    );
    return unwrapApiResponse<CallCard>(response.data);
  },
};
