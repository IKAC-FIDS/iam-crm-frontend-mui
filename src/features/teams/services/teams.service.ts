import axiosInstance from '@/lib/axios';
import { unwrapApiResponse } from '@/lib/apiResponse';
import type {
  CreateTeamPayload,
  FindTeamsParams,
  Team,
  TeamMember,
  UpdateTeamPayload,
} from '../types/team.types';

function cleanObject<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== '')
  ) as Partial<T>;
}

function list<T>(payload: unknown): T[] {
  const data = unwrapApiResponse<unknown>(payload);
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object' && 'items' in data && Array.isArray((data as { items?: unknown }).items)) {
    return (data as { items: T[] }).items;
  }
  return [];
}

function cleanPayload<T extends CreateTeamPayload | UpdateTeamPayload>(payload: T): T {
  return cleanObject({
    ...payload,
    name: payload.name?.trim(),
    code: payload.code?.trim(),
    managerId: payload.managerId?.trim(),
    description: payload.description?.trim(),
  }) as T;
}

export const teamsService = {
  list: async (params: FindTeamsParams = {}): Promise<Team[]> => {
    const response = await axiosInstance.get<unknown>('/teams', { params: cleanObject(params) });
    return list<Team>(response.data);
  },
  create: async (payload: CreateTeamPayload): Promise<Team> => {
    const response = await axiosInstance.post<unknown>('/teams', cleanPayload(payload));
    return unwrapApiResponse<Team>(response.data);
  },
  update: async (id: string, payload: UpdateTeamPayload): Promise<Team> => {
    const response = await axiosInstance.patch<unknown>(`/teams/${id}`, cleanPayload(payload));
    return unwrapApiResponse<Team>(response.data);
  },
  activate: async (id: string): Promise<Team> => {
    const response = await axiosInstance.patch<unknown>(`/teams/${id}/activate`);
    return unwrapApiResponse<Team>(response.data);
  },
  deactivate: async (id: string): Promise<Team> => {
    const response = await axiosInstance.patch<unknown>(`/teams/${id}/deactivate`);
    return unwrapApiResponse<Team>(response.data);
  },
  listMembers: async (teamId: string): Promise<TeamMember[]> => {
    const response = await axiosInstance.get<unknown>(`/teams/${teamId}/members`);
    return list<TeamMember>(response.data);
  },
  addMember: async (teamId: string, userId: string): Promise<TeamMember> => {
    const response = await axiosInstance.post<unknown>(`/teams/${teamId}/members`, { userId });
    return unwrapApiResponse<TeamMember>(response.data);
  },
  removeMember: async (teamId: string, userId: string): Promise<void> => {
    await axiosInstance.delete(`/teams/${teamId}/members/${userId}`);
  },
};
