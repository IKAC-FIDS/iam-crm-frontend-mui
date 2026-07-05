import axios from 'axios';
import axiosInstance from '@/lib/axios';
import type {
  CallCard,
  CallCardSuggestion,
  UpsertCallCardPayload,
} from '../types/callCard.types';

function unwrap<T>(payload: T | { data: T }): T {
  return typeof payload === 'object' && payload !== null && 'data' in payload
    ? payload.data
    : payload;
}

export const callCardsService = {
  getCallCard: async (companyId: string): Promise<CallCard | null> => {
    try {
      const response = await axiosInstance.get<CallCard | { data: CallCard | null }>(
        `/companies/${companyId}/call-card`,
      );
      if (!response.data) return null;
      return unwrap(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null;
      throw error;
    }
  },

  suggestCallCard: async (companyId: string): Promise<CallCardSuggestion> => {
    const response = await axiosInstance.get<CallCardSuggestion | { data: CallCardSuggestion }>(
      `/companies/${companyId}/call-card/suggest`,
    );
    return unwrap(response.data);
  },

  upsertCallCard: async (
    companyId: string,
    payload: UpsertCallCardPayload,
  ): Promise<CallCard> => {
    const response = await axiosInstance.put<CallCard | { data: CallCard }>(
      `/companies/${companyId}/call-card`,
      payload,
    );
    return unwrap(response.data);
  },
};
