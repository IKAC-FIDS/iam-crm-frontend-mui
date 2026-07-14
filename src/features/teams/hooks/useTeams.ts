import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminUserQueryKeys } from '@/features/admin/users/hooks/useAdminUsers';
import { isForbiddenError } from '@/lib/apiResponse';
import { teamsService } from '../services/teams.service';
import { isTeamActive } from '../types/team.types';
import type { CreateTeamPayload, FindTeamsParams, Team, UpdateTeamPayload } from '../types/team.types';

export const teamQueryKeys = {
  all: ['teams'] as const,
  list: (params: FindTeamsParams = {}) => [...teamQueryKeys.all, 'list', params] as const,
  active: ['teams', 'active'] as const,
  members: (teamId: string) => [...teamQueryKeys.all, teamId, 'members'] as const,
};

function retryUnlessForbidden(failureCount: number, error: unknown) {
  return !isForbiddenError(error) && failureCount < 1;
}

function useInvalidateTeams() {
  const client = useQueryClient();
  return (team?: Team) =>
    Promise.all([
      client.invalidateQueries({ queryKey: teamQueryKeys.all }),
      client.invalidateQueries({ queryKey: adminUserQueryKeys.all }),
      team?.id ? client.invalidateQueries({ queryKey: teamQueryKeys.members(team.id) }) : Promise.resolve(),
    ]);
}

export function useTeams(params: FindTeamsParams = {}, enabled = true) {
  return useQuery({
    queryKey: teamQueryKeys.list(params),
    queryFn: () => teamsService.list(params),
    enabled,
    retry: retryUnlessForbidden,
  });
}

export function useActiveTeams(enabled = true) {
  return useQuery({
    queryKey: teamQueryKeys.active,
    queryFn: async () => (await teamsService.list({ includeInactive: true })).filter(isTeamActive),
    enabled,
    retry: retryUnlessForbidden,
  });
}

export function useCreateTeam() {
  const invalidate = useInvalidateTeams();
  return useMutation({
    mutationFn: (payload: CreateTeamPayload) => teamsService.create(payload),
    onSuccess: (data) => invalidate(data),
  });
}

export function useUpdateTeam() {
  const invalidate = useInvalidateTeams();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTeamPayload }) => teamsService.update(id, payload),
    onSuccess: (data) => invalidate(data),
  });
}

export function useActivateTeam() {
  const invalidate = useInvalidateTeams();
  return useMutation({
    mutationFn: (team: Team) => teamsService.activate(team.id),
    onSuccess: (data) => invalidate(data),
  });
}

export function useDeactivateTeam() {
  const invalidate = useInvalidateTeams();
  return useMutation({
    mutationFn: (team: Team) => teamsService.deactivate(team.id),
    onSuccess: (data) => invalidate(data),
  });
}

export function useTeamMembers(teamId: string, enabled = true) {
  return useQuery({
    queryKey: teamQueryKeys.members(teamId),
    queryFn: () => teamsService.listMembers(teamId),
    enabled: enabled && Boolean(teamId),
    retry: retryUnlessForbidden,
  });
}

export function useAddTeamMember(teamId: string) {
  const invalidate = useInvalidateTeams();
  return useMutation({
    mutationFn: (userId: string) => teamsService.addMember(teamId, userId),
    onSuccess: () => invalidate({ id: teamId } as Team),
  });
}

export function useRemoveTeamMember(teamId: string) {
  const invalidate = useInvalidateTeams();
  return useMutation({
    mutationFn: (userId: string) => teamsService.removeMember(teamId, userId),
    onSuccess: () => invalidate({ id: teamId } as Team),
  });
}
