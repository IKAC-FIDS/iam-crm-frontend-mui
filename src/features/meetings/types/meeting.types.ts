import type { PaginatedResult } from '@/lib/apiResponse';

export type MeetingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type MeetingMode = 'IN_PERSON' | 'ONLINE' | 'HYBRID';

export interface MeetingUser { id: string; fullName: string; email?: string | null; role?: string | null; teamId?: string | null }
export interface MeetingPerson { id: string; fullName: string; title?: string | null; companyId: string }
export interface Meeting {
  id: string; companyId: string; opportunityId?: string | null; title: string; agenda?: string | null; description?: string | null;
  mode: MeetingMode; location?: string | null; meetingUrl?: string | null; startAt: string; endAt: string; reminderAt?: string | null;
  status: MeetingStatus; organizerId: string; organizer?: MeetingUser; company?: { id: string; legalName: string; brandName?: string | null };
  opportunity?: { id: string; title: string; companyId: string } | null; assignees?: { userId: string; user: MeetingUser }[];
  attendees?: { personId: string; person: MeetingPerson }[]; completionNote?: string | null; completedAt?: string | null; completedBy?: MeetingUser | null;
  cancellationReason?: string | null; cancelledAt?: string | null; cancelledBy?: MeetingUser | null; createdAt: string; updatedAt: string;
}

export interface FindMeetingsParams {
  page: number; limit: number; search?: string; companyId?: string; opportunityId?: string; organizerId?: string; assignedUserId?: string;
  attendeePersonId?: string; status?: MeetingStatus; mode?: MeetingMode; dateFrom?: string; dateTo?: string; upcoming?: boolean; past?: boolean; mine?: boolean;
}
export interface MeetingPayload {
  companyId: string; opportunityId?: string; title: string; agenda?: string; description?: string; mode: MeetingMode; location?: string;
  meetingUrl?: string; startAt: string; endAt: string; reminderAt?: string; assigneeUserIds?: string[]; attendeePersonIds?: string[];
}
export type UpdateMeetingPayload = Partial<MeetingPayload>;
export interface AssigneeOption extends MeetingUser { team?: { id: string; name: string } | null }
export type MeetingPage = PaginatedResult<Meeting>;

