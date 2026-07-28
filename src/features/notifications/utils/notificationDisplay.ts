import type { ChipProps } from '@mui/material/Chip';
import { formatUserJalaliDate, formatUserJalaliDateTime, formatUserTime } from '@/shared/utils/jalaliDate';
import type {
  Notification,
  NotificationEntityType,
  NotificationPriority,
  NotificationType,
  MeetingReminderMetadata,
} from '../types/notification.types';

export const notificationTypeOptions: { value: NotificationType; label: string }[] = [
  { value: 'SYSTEM', label: 'سیستمی' },
  { value: 'TASK_CREATED', label: 'ایجاد کار' },
  { value: 'TASK_ASSIGNED', label: 'ارجاع کار' },
  { value: 'TASK_STATUS_CHANGED', label: 'تغییر وضعیت کار' },
  { value: 'TASK_COMPLETED', label: 'تکمیل کار' },
  { value: 'TASK_RESCHEDULED', label: 'تغییر زمان‌بندی کار' },
  { value: 'OPPORTUNITY_UPDATED', label: 'بروزرسانی فرصت' },
  { value: 'COMMERCIAL_DOCUMENT_UPDATED', label: 'بروزرسانی سند تجاری' },
  { value: 'PAYMENT_UPDATED', label: 'بروزرسانی پرداخت' },
  { value: 'ATTACHMENT_UPLOADED', label: 'بارگذاری پیوست' },
  { value: 'MEETING_REMINDER', label: 'یادآوری جلسه' },
];

export const notificationPriorityOptions: { value: NotificationPriority; label: string }[] = [
  { value: 'LOW', label: 'کم' },
  { value: 'NORMAL', label: 'عادی' },
  { value: 'HIGH', label: 'زیاد' },
  { value: 'URGENT', label: 'فوری' },
];

export const notificationEntityTypeOptions: { value: NotificationEntityType; label: string }[] = [
  { value: 'TASK', label: 'کار' },
  { value: 'COMPANY', label: 'شرکت' },
  { value: 'PERSON', label: 'شخص' },
  { value: 'OPPORTUNITY', label: 'فرصت' },
  { value: 'COMMERCIAL_DOCUMENT', label: 'سند تجاری' },
  { value: 'PAYMENT', label: 'پرداخت' },
  { value: 'ATTACHMENT', label: 'پیوست' },
  { value: 'MEETING', label: 'جلسه' },
];

export function getNotificationTypeLabel(type: NotificationType): string {
  return notificationTypeOptions.find((item) => item.value === type)?.label ?? type;
}

export function getNotificationPriorityLabel(priority: NotificationPriority): string {
  return notificationPriorityOptions.find((item) => item.value === priority)?.label ?? priority;
}

export function getNotificationPriorityColor(priority: NotificationPriority): ChipProps['color'] {
  if (priority === 'URGENT') return 'error';
  if (priority === 'HIGH') return 'warning';
  if (priority === 'LOW') return 'default';
  return 'primary';
}

export function getNotificationEntityTypeLabel(entityType?: NotificationEntityType | null): string {
  if (!entityType) return 'بدون ارتباط';
  return notificationEntityTypeOptions.find((item) => item.value === entityType)?.label ?? entityType;
}

export function isUnread(notification: Notification): boolean {
  return !notification.readAt;
}

export function isArchived(notification: Notification): boolean {
  return Boolean(notification.archivedAt);
}

export function getNotificationStatusLabel(notification: Notification): string {
  if (isArchived(notification)) return 'بایگانی‌شده';
  return isUnread(notification) ? 'خوانده‌نشده' : 'خوانده‌شده';
}

export function formatNotificationDate(value?: string | null, organizationTimeZone?: string): string {
  return formatUserJalaliDateTime(value, { organizationTimeZone });
}

function stringValue(value: unknown): string | undefined { return typeof value === 'string' && value.trim() ? value.trim() : undefined; }
function validInstant(value?: string): value is string { return Boolean(value && !Number.isNaN(new Date(value).getTime())); }
export function getMeetingReminderMetadata(value: unknown): MeetingReminderMetadata | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const metadata: MeetingReminderMetadata = {
    meetingTitle: stringValue(source.meetingTitle), meetingStartAt: stringValue(source.meetingStartAt), meetingEndAt: stringValue(source.meetingEndAt),
    reminderAt: source.reminderAt === null ? null : stringValue(source.reminderAt), organizationTimeZone: stringValue(source.organizationTimeZone),
  };
  return Object.values(metadata).some((item) => item !== undefined) ? metadata : null;
}
export function getNotificationOrganizationTimeZone(notification: Notification): string | undefined { return getMeetingReminderMetadata(notification.metadata)?.organizationTimeZone; }

const historicalIsoPattern = /\d{4}-\d{2}-\d{2}T[^\s،]+Z?/i;
function reminderTitle(notification: Notification, metadata: MeetingReminderMetadata | null): string {
  return metadata?.meetingTitle || notification.body?.match(/جلسه\s*[«"]([^»"]+)[»"]/)?.[1] || notification.title.replace(/^یادآوری\s*(?:جلسه)?[:：\s-]*/u, '').trim() || 'جلسه';
}
function reminderSentence(title: string, instant?: string, organizationTimeZone?: string): string {
  if (!validInstant(instant)) return `جلسه «${title}» به‌زودی برگزار می‌شود.`;
  const options = { organizationTimeZone };
  return `جلسه «${title}» در ${formatUserJalaliDate(instant, options)} ساعت ${formatUserTime(instant, options)} برگزار می‌شود.`;
}
export function getNotificationDisplayBody(notification: Notification): string | null {
  if (notification.type !== 'MEETING_REMINDER') return notification.body ?? null;
  const metadata = getMeetingReminderMetadata(notification.metadata);
  const title = reminderTitle(notification, metadata);
  if (validInstant(metadata?.meetingStartAt)) return reminderSentence(title, metadata.meetingStartAt, metadata.organizationTimeZone);
  const historical = notification.body?.match(historicalIsoPattern)?.[0];
  if (validInstant(historical)) return reminderSentence(title, historical, metadata?.organizationTimeZone);
  if (historical || notification.body?.includes('T') && notification.body?.includes('Z')) return reminderSentence(title);
  return notification.body?.trim() || reminderSentence(title);
}
