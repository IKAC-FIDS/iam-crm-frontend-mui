import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, type ApiWrappedResponse } from '@/lib/apiResponse';
import type {
  BoardsDashboardFilters,
  BoardsDashboardResponse,
} from '../types/boardsDashboard.types';

export const boardsDashboardService = {
  getOverview: async (filters: BoardsDashboardFilters = {}): Promise<BoardsDashboardResponse> => {
    const response = await axiosInstance.get<ApiWrappedResponse<BoardsDashboardResponse>>(
      '/dashboard/boards',
      { params: filters },
    );

    return unwrapApiResponse<BoardsDashboardResponse>(response.data);
  },
};
