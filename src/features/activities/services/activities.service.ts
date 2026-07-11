import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, unwrapPaginatedApiResponse } from '@/lib/apiResponse';
import type { PaginatedResult } from '@/features/companies/types/company.types';
import type {
  Activity,
  CreateActivityPayload,
  GetActivitiesParams,
  UpdateActivityPayload,
} from '../types/activity.types';

interface PageMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

interface ActivitiesEnvelope {
  data?: Activity[];
  items?: Activity[];
  meta?: PageMeta;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

function normalizeActivities(
  payload: Activity[] | ActivitiesEnvelope,
  params: GetActivitiesParams,
): PaginatedResult<Activity> {
  if (Array.isArray(payload)) {
    return {
      data: payload,
      meta: {
        total: payload.length,
        page: params.page,
        limit: params.limit,
        totalPages: Math.max(1, Math.ceil(payload.length / params.limit)),
      },
    };
  }

  const data = payload.data ?? payload.items ?? [];
  const total = payload.meta?.total ?? payload.total ?? data.length;
  const page = payload.meta?.page ?? payload.page ?? params.page;
  const limit = payload.meta?.limit ?? payload.limit ?? params.limit;
  const totalPages = payload.meta?.totalPages
    ?? payload.totalPages
    ?? Math.max(1, Math.ceil(total / limit));

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: payload.meta?.hasNext ?? page < totalPages,
      hasPrevious: payload.meta?.hasPrevious ?? page > 1,
    },
  };
}

export const activitiesService = {
  getActivitiesByCompany: async (
    params: GetActivitiesParams,
  ): Promise<PaginatedResult<Activity>> => {
    const response = await axiosInstance.get<Activity[] | ActivitiesEnvelope>('/activities', {
      params,
    });
    return normalizeActivities(unwrapPaginatedApiResponse<Activity>(response.data), params);
  },

  createActivity: async (payload: CreateActivityPayload): Promise<Activity> => {
    const response = await axiosInstance.post<Activity | { data: Activity }>(
      '/activities',
      payload,
    );
    return unwrapApiResponse<Activity>(response.data);
  },

  updateActivity: async (activityId: string, payload: UpdateActivityPayload): Promise<Activity> => {
    const response = await axiosInstance.patch<Activity | { data: Activity }>(
      `/activities/${activityId}`,
      payload,
    );
    return unwrapApiResponse<Activity>(response.data);
  },
};
