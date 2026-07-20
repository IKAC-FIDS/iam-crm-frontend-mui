import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { meetingsService } from '../services/meetings.service';
import type { FindMeetingsParams, Meeting, MeetingPayload, UpdateMeetingPayload } from '../types/meeting.types';

export const meetingKeys = { all: ['meetings'] as const, lists: () => ['meetings', 'list'] as const, list: (p: FindMeetingsParams) => ['meetings', 'list', p] as const, detail: (id: string) => ['meetings', 'detail', id] as const };
function useInvalidateMeetings() { const client = useQueryClient(); return (meeting?: Meeting) => Promise.all([client.invalidateQueries({ queryKey: meetingKeys.all }), client.invalidateQueries({ queryKey: ['companies', 'detail', meeting?.companyId] }), client.invalidateQueries({ queryKey: ['opportunities', 'detail', meeting?.opportunityId] }), client.invalidateQueries({ queryKey: ['notifications'] }), client.invalidateQueries({ queryKey: ['dashboard'] })]); }
export function useMeetings(params: FindMeetingsParams, enabled = true) { return useQuery({ queryKey: meetingKeys.list(params), queryFn: ({ signal }) => meetingsService.list(params, signal), placeholderData: keepPreviousData, enabled }); }
export function useMeeting(id: string, enabled = true) { return useQuery({ queryKey: meetingKeys.detail(id), queryFn: ({ signal }) => meetingsService.get(id, signal), enabled: enabled && Boolean(id) }); }
export function useCreateMeeting() { const invalidate = useInvalidateMeetings(); return useMutation({ mutationFn: (p: MeetingPayload) => meetingsService.create(p), onSuccess: invalidate }); }
export function useUpdateMeeting() { const invalidate = useInvalidateMeetings(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: UpdateMeetingPayload }) => meetingsService.update(id, payload), onSuccess: invalidate }); }
export function useCompleteMeeting() { const invalidate = useInvalidateMeetings(); return useMutation({ mutationFn: ({ id, note }: { id: string; note?: string }) => meetingsService.complete(id, note), onSuccess: invalidate }); }
export function useCancelMeeting() { const invalidate = useInvalidateMeetings(); return useMutation({ mutationFn: ({ id, reason }: { id: string; reason?: string }) => meetingsService.cancel(id, reason), onSuccess: invalidate }); }
export function useAssigneeOptions(search: string, enabled = true) { return useInfiniteQuery({ queryKey: ['meeting-assignee-options', search.trim()], queryFn: ({ pageParam, signal }) => meetingsService.assignees({ search: search.trim() || undefined, page: pageParam, limit: 25 }, signal), initialPageParam: 1, getNextPageParam: (last) => last.meta.hasNext ? last.meta.page + 1 : undefined, enabled, staleTime: 120000 }); }

