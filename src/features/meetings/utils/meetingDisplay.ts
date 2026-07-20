import type { ChipProps } from '@mui/material';
import type { MeetingMode, MeetingStatus } from '../types/meeting.types';
export const meetingStatusOptions: { value: MeetingStatus; label: string }[] = [{ value: 'SCHEDULED', label: 'برنامه‌ریزی‌شده' }, { value: 'COMPLETED', label: 'برگزارشده' }, { value: 'CANCELLED', label: 'لغوشده' }];
export const meetingModeOptions: { value: MeetingMode; label: string }[] = [{ value: 'IN_PERSON', label: 'حضوری' }, { value: 'ONLINE', label: 'آنلاین' }, { value: 'HYBRID', label: 'ترکیبی' }];
export const meetingStatusLabel = (v: MeetingStatus) => meetingStatusOptions.find((x) => x.value === v)?.label ?? v;
export const meetingModeLabel = (v: MeetingMode) => meetingModeOptions.find((x) => x.value === v)?.label ?? v;
export const meetingStatusColor = (v: MeetingStatus): ChipProps['color'] => v === 'COMPLETED' ? 'success' : v === 'CANCELLED' ? 'default' : 'primary';
