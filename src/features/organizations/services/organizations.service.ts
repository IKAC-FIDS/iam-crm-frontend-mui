import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, type ApiWrappedResponse } from '@/lib/apiResponse';
import type { CurrentOrganizationResponse } from '../types/organization.types';

export const organizationsService = {
  getCurrent: async (): Promise<CurrentOrganizationResponse> => {
    const response = await axiosInstance.get<ApiWrappedResponse<CurrentOrganizationResponse>>(
      '/organizations/current'
    );
    return unwrapApiResponse<CurrentOrganizationResponse>(response.data);
  },
};
