import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, unwrapPaginatedApiResponse, type PaginatedResult } from '@/lib/apiResponse';
import type { AssigneeOption, FindMeetingsParams, Meeting, MeetingPayload, UpdateMeetingPayload } from '../types/meeting.types';

const clean = <T extends object>(value: T) => Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));

export const meetingsService = {
  list: async (params: FindMeetingsParams, signal?: AbortSignal) => unwrapPaginatedApiResponse<Meeting>((await axiosInstance.get('/meetings', { params: clean(params), signal })).data),
  get: async (id: string, signal?: AbortSignal) => unwrapApiResponse<Meeting>((await axiosInstance.get(`/meetings/${id}`, { signal })).data),
  create: async (payload: MeetingPayload) => unwrapApiResponse<Meeting>((await axiosInstance.post('/meetings', clean(payload))).data),
  update: async (id: string, payload: UpdateMeetingPayload) => unwrapApiResponse<Meeting>((await axiosInstance.patch(`/meetings/${id}`, clean(payload))).data),
  complete: async (id: string, completionNote?: string) => unwrapApiResponse<Meeting>((await axiosInstance.patch(`/meetings/${id}/complete`, { completionNote: completionNote?.trim() || undefined })).data),
  cancel: async (id: string, cancellationReason?: string) => unwrapApiResponse<Meeting>((await axiosInstance.patch(`/meetings/${id}/cancel`, { cancellationReason: cancellationReason?.trim() || undefined })).data),
  assignees: async (params: { search?: string; page: number; limit: number; selectedId?: string }, signal?: AbortSignal) => unwrapPaginatedApiResponse<AssigneeOption>((await axiosInstance.get('/users/assignee-options', { params: clean(params), signal })).data) as PaginatedResult<AssigneeOption>,
};

