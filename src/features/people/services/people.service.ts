import axiosInstance from '@/lib/axios';
import type { PaginatedResult } from '@/features/companies/types/company.types';
import type {
  CreatePersonContactPayload,
  CreatePersonPayload,
  CreatePersonSocialPayload,
  GetPeopleParams,
  Person,
  PersonContact,
  PersonSocial,
  UpdatePersonContactPayload,
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

interface PeopleEnvelope {
  data?: Person[];
  items?: Person[];
  meta?: PageMeta;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

function unwrap<T>(payload: T | { data: T }): T {
  return typeof payload === 'object' && payload !== null && 'data' in payload
    ? payload.data
    : payload;
}

function unwrapList<T>(payload: T[] | { data?: T[]; items?: T[] }): T[] {
  if (Array.isArray(payload)) return payload;
  return payload.data ?? payload.items ?? [];
}

function normalizePeople(
  payload: Person[] | PeopleEnvelope,
  params: GetPeopleParams,
): PaginatedResult<Person> {
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

export const peopleService = {
  getPeopleByCompany: async (params: GetPeopleParams): Promise<PaginatedResult<Person>> => {
    const response = await axiosInstance.get<Person[] | PeopleEnvelope>('/people', { params });
    return normalizePeople(response.data, params);
  },

  getPersonById: async (personId: string): Promise<Person> => {
    const response = await axiosInstance.get<Person | { data: Person }>(`/people/${personId}`);
    return unwrap(response.data);
  },

  createPerson: async (payload: CreatePersonPayload): Promise<Person> => {
    const response = await axiosInstance.post<Person | { data: Person }>('/people', payload);
    return unwrap(response.data);
  },

  updatePerson: async (personId: string, payload: UpdatePersonPayload): Promise<Person> => {
    const response = await axiosInstance.patch<Person | { data: Person }>(
      `/people/${personId}`,
      payload,
    );
    return unwrap(response.data);
  },

  deletePerson: async (personId: string): Promise<void> => {
    await axiosInstance.delete(`/people/${personId}`);
  },

  getPersonContacts: async (personId: string): Promise<PersonContact[]> => {
    const response = await axiosInstance.get<
      PersonContact[] | { data?: PersonContact[]; items?: PersonContact[] }
    >(`/people/${personId}/contacts`);
    return unwrapList(response.data);
  },

  createPersonContact: async (
    personId: string,
    payload: CreatePersonContactPayload,
  ): Promise<PersonContact> => {
    const response = await axiosInstance.post<PersonContact | { data: PersonContact }>(
      `/people/${personId}/contacts`,
      payload,
    );
    return unwrap(response.data);
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
    return unwrap(response.data);
  },

  deletePersonContact: async (personId: string, contactId: string): Promise<void> => {
    await axiosInstance.delete(`/people/${personId}/contacts/${contactId}`);
  },

  getPersonSocials: async (personId: string): Promise<PersonSocial[]> => {
    const response = await axiosInstance.get<
      PersonSocial[] | { data?: PersonSocial[]; items?: PersonSocial[] }
    >(`/people/${personId}/socials`);
    return unwrapList(response.data);
  },

  createPersonSocial: async (
    personId: string,
    payload: CreatePersonSocialPayload,
  ): Promise<PersonSocial> => {
    const response = await axiosInstance.post<PersonSocial | { data: PersonSocial }>(
      `/people/${personId}/socials`,
      payload,
    );
    return unwrap(response.data);
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
    return unwrap(response.data);
  },

  deletePersonSocial: async (personId: string, socialId: string): Promise<void> => {
    await axiosInstance.delete(`/people/${personId}/socials/${socialId}`);
  },
};
