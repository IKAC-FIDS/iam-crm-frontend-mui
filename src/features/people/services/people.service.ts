import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, unwrapPaginatedApiResponse } from '@/lib/apiResponse';
import type { PaginatedResult } from '@/features/companies/types/company.types';
import type {
  CreatePersonContactPayload,
  CreatePersonEducationHistoryPayload,
  CreatePersonEmploymentHistoryPayload,
  CreatePersonEmploymentPositionPayload,
  CreatePersonPayload,
  CreatePersonSocialPayload,
  DirectoryPerson,
  GetPeopleParams,
  Person,
  PersonContact,
  PersonEducationHistory,
  PersonEmploymentHistory,
  PersonEmploymentPosition,
  PersonSocial,
  PeopleDirectoryParams,
  UpdatePersonContactPayload,
  UpdatePersonEducationHistoryPayload,
  UpdatePersonEmploymentHistoryPayload,
  UpdatePersonEmploymentPositionPayload,
  UpdatePersonPayload,
  UpdatePersonSocialPayload,
} from '../types/person.types';

interface PageMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

interface PeopleEnvelope<T = Person> {
  data?: T[];
  items?: T[];
  meta?: PageMeta;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

function unwrapList<T>(payload: unknown): T[] {
  const value = unwrapApiResponse<unknown>(payload);
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === 'object' && 'items' in value && Array.isArray((value as { items?: unknown }).items)) {
    return (value as { items: T[] }).items;
  }
  return [];
}

function normalizePeople<T>(
  payload: T[] | PeopleEnvelope<T>,
  params: { page: number; limit: number },
): PaginatedResult<T> {
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
  const totalPages =
    payload.meta?.totalPages ?? payload.totalPages ?? Math.max(1, Math.ceil(total / limit));

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

function cleanParams(params: PeopleDirectoryParams): Record<string, string | number | boolean> {
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== '')) as Record<string, string | number | boolean>;
}

export const peopleService = {
  getPeopleDirectory: async (params: PeopleDirectoryParams): Promise<PaginatedResult<DirectoryPerson>> => {
    const response = await axiosInstance.get<PeopleEnvelope<DirectoryPerson>>('/people/directory', {
      params: cleanParams(params),
    });
    return normalizePeople(unwrapPaginatedApiResponse<DirectoryPerson>(response.data), params);
  },

  getPeopleByCompany: async (params: GetPeopleParams): Promise<PaginatedResult<Person>> => {
    const response = await axiosInstance.get<Person[] | PeopleEnvelope>('/people', { params });
    return normalizePeople(unwrapPaginatedApiResponse<Person>(response.data), params);
  },

  getPersonById: async (personId: string): Promise<Person> => {
    const response = await axiosInstance.get<Person | { data: Person }>(`/people/${personId}`);
    return unwrapApiResponse<Person>(response.data);
  },

  createPerson: async (payload: CreatePersonPayload): Promise<Person> => {
    const response = await axiosInstance.post<Person | { data: Person }>('/people', payload);
    return unwrapApiResponse<Person>(response.data);
  },

  updatePerson: async (personId: string, payload: UpdatePersonPayload): Promise<Person> => {
    const response = await axiosInstance.patch<Person | { data: Person }>(
      `/people/${personId}`,
      payload,
    );
    return unwrapApiResponse<Person>(response.data);
  },

  deletePerson: async (personId: string): Promise<void> => {
    await axiosInstance.delete(`/people/${personId}`);
  },

  getPersonContacts: async (personId: string): Promise<PersonContact[]> => {
    const response = await axiosInstance.get<
      PersonContact[] | { data?: PersonContact[]; items?: PersonContact[] }
    >(`/people/${personId}/contacts`);
    return unwrapList<PersonContact>(response.data);
  },

  createPersonContact: async (
    personId: string,
    payload: CreatePersonContactPayload,
  ): Promise<PersonContact> => {
    const response = await axiosInstance.post<PersonContact | { data: PersonContact }>(
      `/people/${personId}/contacts`,
      payload,
    );
    return unwrapApiResponse<PersonContact>(response.data);
  },

  updatePersonContact: async (
    personId: string,
    contactId: string,
    payload: UpdatePersonContactPayload,
  ): Promise<PersonContact> => {
    const response = await axiosInstance.patch<PersonContact | { data: PersonContact }>(
      `/people/${personId}/contacts/${contactId}`,
      payload,
    );
    return unwrapApiResponse<PersonContact>(response.data);
  },

  deletePersonContact: async (personId: string, contactId: string): Promise<void> => {
    await axiosInstance.delete(`/people/${personId}/contacts/${contactId}`);
  },

  getPersonSocials: async (personId: string): Promise<PersonSocial[]> => {
    const response = await axiosInstance.get<
      PersonSocial[] | { data?: PersonSocial[]; items?: PersonSocial[] }
    >(`/people/${personId}/socials`);
    return unwrapList<PersonSocial>(response.data);
  },

  createPersonSocial: async (
    personId: string,
    payload: CreatePersonSocialPayload,
  ): Promise<PersonSocial> => {
    const response = await axiosInstance.post<PersonSocial | { data: PersonSocial }>(
      `/people/${personId}/socials`,
      payload,
    );
    return unwrapApiResponse<PersonSocial>(response.data);
  },

  updatePersonSocial: async (
    personId: string,
    socialId: string,
    payload: UpdatePersonSocialPayload,
  ): Promise<PersonSocial> => {
    const response = await axiosInstance.patch<PersonSocial | { data: PersonSocial }>(
      `/people/${personId}/socials/${socialId}`,
      payload,
    );
    return unwrapApiResponse<PersonSocial>(response.data);
  },

  deletePersonSocial: async (personId: string, socialId: string): Promise<void> => {
    await axiosInstance.delete(`/people/${personId}/socials/${socialId}`);
  },

  listPersonEmploymentHistory: async (personId: string): Promise<PersonEmploymentHistory[]> => {
    const response = await axiosInstance.get(`/people/${personId}/employment-history`);
    return unwrapList<PersonEmploymentHistory>(response.data);
  },

  createPersonEmploymentHistory: async (
    personId: string,
    payload: CreatePersonEmploymentHistoryPayload,
  ): Promise<PersonEmploymentHistory> => {
    const response = await axiosInstance.post(`/people/${personId}/employment-history`, payload);
    return unwrapApiResponse<PersonEmploymentHistory>(response.data);
  },

  updatePersonEmploymentHistory: async (
    personId: string,
    employmentId: string,
    payload: UpdatePersonEmploymentHistoryPayload,
  ): Promise<PersonEmploymentHistory> => {
    const response = await axiosInstance.patch(
      `/people/${personId}/employment-history/${employmentId}`,
      payload,
    );
    return unwrapApiResponse<PersonEmploymentHistory>(response.data);
  },

  deletePersonEmploymentHistory: async (personId: string, employmentId: string): Promise<void> => {
    await axiosInstance.delete(`/people/${personId}/employment-history/${employmentId}`);
  },

  createPersonEmploymentPosition: async (
    personId: string,
    employmentId: string,
    payload: CreatePersonEmploymentPositionPayload,
  ): Promise<PersonEmploymentPosition> => {
    const response = await axiosInstance.post(
      `/people/${personId}/employment-history/${employmentId}/positions`,
      payload,
    );
    return unwrapApiResponse<PersonEmploymentPosition>(response.data);
  },

  updatePersonEmploymentPosition: async (
    personId: string,
    employmentId: string,
    positionId: string,
    payload: UpdatePersonEmploymentPositionPayload,
  ): Promise<PersonEmploymentPosition> => {
    const response = await axiosInstance.patch(
      `/people/${personId}/employment-history/${employmentId}/positions/${positionId}`,
      payload,
    );
    return unwrapApiResponse<PersonEmploymentPosition>(response.data);
  },

  deletePersonEmploymentPosition: async (
    personId: string,
    employmentId: string,
    positionId: string,
  ): Promise<void> => {
    await axiosInstance.delete(
      `/people/${personId}/employment-history/${employmentId}/positions/${positionId}`,
    );
  },

  listPersonEducationHistory: async (personId: string): Promise<PersonEducationHistory[]> => {
    const response = await axiosInstance.get(`/people/${personId}/education-history`);
    return unwrapList<PersonEducationHistory>(response.data);
  },

  createPersonEducationHistory: async (
    personId: string,
    payload: CreatePersonEducationHistoryPayload,
  ): Promise<PersonEducationHistory> => {
    const response = await axiosInstance.post(`/people/${personId}/education-history`, payload);
    return unwrapApiResponse<PersonEducationHistory>(response.data);
  },

  updatePersonEducationHistory: async (
    personId: string,
    educationId: string,
    payload: UpdatePersonEducationHistoryPayload,
  ): Promise<PersonEducationHistory> => {
    const response = await axiosInstance.patch(
      `/people/${personId}/education-history/${educationId}`,
      payload,
    );
    return unwrapApiResponse<PersonEducationHistory>(response.data);
  },

  deletePersonEducationHistory: async (personId: string, educationId: string): Promise<void> => {
    await axiosInstance.delete(`/people/${personId}/education-history/${educationId}`);
  },
};
