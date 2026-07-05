import axiosInstance from '@/lib/axios';
import type { PaginatedResult } from '@/features/companies/types/company.types';
import type { FollowUpActivity, GetDueFollowUpsParams } from '../types/followUp.types';

interface Envelope {
  data?: FollowUpActivity[];
  items?: FollowUpActivity[];
  meta?: Partial<PaginatedResult<FollowUpActivity>['meta']>;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

function normalize(payload: FollowUpActivity[] | Envelope, params: GetDueFollowUpsParams): PaginatedResult<FollowUpActivity> {
  if (Array.isArray(payload)) {
    return { data: payload, meta: { total: payload.length, page: params.page, limit: params.limit, totalPages: Math.max(1, Math.ceil(payload.length / params.limit)) } };
  }
  const data = payload.data ?? payload.items ?? [];
  const total = payload.meta?.total ?? payload.total ?? data.length;
  const page = payload.meta?.page ?? payload.page ?? params.page;
  const limit = payload.meta?.limit ?? payload.limit ?? params.limit;
  const totalPages = payload.meta?.totalPages ?? payload.totalPages ?? Math.max(1, Math.ceil(total / limit));
  return { data, meta: { total, page, limit, totalPages, hasNext: payload.meta?.hasNext ?? page < totalPages, hasPrevious: payload.meta?.hasPrevious ?? page > 1 } };
}

export const followUpsService = {
  getDueFollowUps: async (params: GetDueFollowUpsParams): Promise<PaginatedResult<FollowUpActivity>> => {
    const response = await axiosInstance.get<FollowUpActivity[] | Envelope>('/activities/follow-ups/due', { params });
    return normalize(response.data, params);
  },
};
