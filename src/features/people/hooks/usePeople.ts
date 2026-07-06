import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { companyQueryKeys } from '@/features/companies/hooks/useCompanies';
import { peopleService } from '../services/people.service';
import type {
  CreatePersonContactPayload,
  CreatePersonPayload,
  CreatePersonSocialPayload,
  GetPeopleParams,
  PeopleDirectoryParams,
  UpdatePersonContactPayload,
  UpdatePersonPayload,
  UpdatePersonSocialPayload,
} from '../types/person.types';

export const peopleQueryKeys = {
  all: ['people'] as const,
  lists: (companyId: string) => [...peopleQueryKeys.all, 'list', companyId] as const,
  list: (params: GetPeopleParams) => [...peopleQueryKeys.lists(params.companyId), params] as const,
  directory: (params: PeopleDirectoryParams) => [...peopleQueryKeys.all, 'directory', params] as const,
  detail: (personId: string) => [...peopleQueryKeys.all, 'detail', personId] as const,
  contacts: (personId: string) => ['person-contacts', personId] as const,
  socials: (personId: string) => ['person-socials', personId] as const,
};

export function usePeopleDirectory(params: PeopleDirectoryParams, enabled = true) {
  return useQuery({ queryKey: peopleQueryKeys.directory(params), queryFn: () => peopleService.getPeopleDirectory(params), placeholderData: keepPreviousData, enabled });
}

export function usePeople(params: GetPeopleParams) {
  return useQuery({
    queryKey: peopleQueryKeys.list(params),
    queryFn: () => peopleService.getPeopleByCompany(params),
    placeholderData: keepPreviousData,
    enabled: Boolean(params.companyId),
  });
}

export function usePerson(personId: string) {
  return useQuery({
    queryKey: peopleQueryKeys.detail(personId),
    queryFn: () => peopleService.getPersonById(personId),
    enabled: Boolean(personId),
  });
}

export function usePersonContacts(personId: string) {
  return useQuery({
    queryKey: peopleQueryKeys.contacts(personId),
    queryFn: () => peopleService.getPersonContacts(personId),
    enabled: Boolean(personId),
  });
}

export function usePersonSocials(personId: string) {
  return useQuery({
    queryKey: peopleQueryKeys.socials(personId),
    queryFn: () => peopleService.getPersonSocials(personId),
    enabled: Boolean(personId),
  });
}

function usePeopleInvalidation(companyId: string) {
  const queryClient = useQueryClient();
  return () => Promise.all([
    queryClient.invalidateQueries({ queryKey: peopleQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: companyQueryKeys.detail(companyId) }),
  ]);
}

export function useCreatePerson(companyId: string) {
  const invalidate = usePeopleInvalidation(companyId);
  return useMutation({
    mutationFn: (payload: CreatePersonPayload) => peopleService.createPerson(payload),
    onSuccess: invalidate,
  });
}

export function useUpdatePerson(companyId: string, personId: string) {
  const queryClient = useQueryClient();
  const invalidate = usePeopleInvalidation(companyId);
  return useMutation({
    mutationFn: (payload: UpdatePersonPayload) => peopleService.updatePerson(personId, payload),
    onSuccess: async () => {
      await invalidate();
      await queryClient.invalidateQueries({ queryKey: peopleQueryKeys.detail(personId) });
    },
  });
}

export function useDeletePerson(companyId: string) {
  const invalidate = usePeopleInvalidation(companyId);
  return useMutation({
    mutationFn: (personId: string) => peopleService.deletePerson(personId),
    onSuccess: invalidate,
  });
}

function usePersonRelationInvalidation(personId: string, relation: 'contacts' | 'socials') {
  const queryClient = useQueryClient();
  const relationKey = relation === 'contacts'
    ? peopleQueryKeys.contacts(personId)
    : peopleQueryKeys.socials(personId);
  return () => Promise.all([
    queryClient.invalidateQueries({ queryKey: peopleQueryKeys.detail(personId) }),
    queryClient.invalidateQueries({ queryKey: relationKey }),
  ]);
}

export function useCreatePersonContact(personId: string) {
  const invalidate = usePersonRelationInvalidation(personId, 'contacts');
  return useMutation({
    mutationFn: (payload: CreatePersonContactPayload) =>
      peopleService.createPersonContact(personId, payload),
    onSuccess: invalidate,
  });
}

export function useUpdatePersonContact(personId: string, contactId: string) {
  const invalidate = usePersonRelationInvalidation(personId, 'contacts');
  return useMutation({
    mutationFn: (payload: UpdatePersonContactPayload) =>
      peopleService.updatePersonContact(personId, contactId, payload),
    onSuccess: invalidate,
  });
}

export function useDeletePersonContact(personId: string) {
  const invalidate = usePersonRelationInvalidation(personId, 'contacts');
  return useMutation({
    mutationFn: (contactId: string) => peopleService.deletePersonContact(personId, contactId),
    onSuccess: invalidate,
  });
}

export function useCreatePersonSocial(personId: string) {
  const invalidate = usePersonRelationInvalidation(personId, 'socials');
  return useMutation({
    mutationFn: (payload: CreatePersonSocialPayload) =>
      peopleService.createPersonSocial(personId, payload),
    onSuccess: invalidate,
  });
}

export function useUpdatePersonSocial(personId: string, socialId: string) {
  const invalidate = usePersonRelationInvalidation(personId, 'socials');
  return useMutation({
    mutationFn: (payload: UpdatePersonSocialPayload) =>
      peopleService.updatePersonSocial(personId, socialId, payload),
    onSuccess: invalidate,
  });
}

export function useDeletePersonSocial(personId: string) {
  const invalidate = usePersonRelationInvalidation(personId, 'socials');
  return useMutation({
    mutationFn: (socialId: string) => peopleService.deletePersonSocial(personId, socialId),
    onSuccess: invalidate,
  });
}
