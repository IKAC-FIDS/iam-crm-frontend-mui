import type { ChipProps } from '@mui/material/Chip';
import { formatJalaliDateTime } from '@/shared/utils/jalaliDate';
import type {
  Notification,
  NotificationEntityType,
  NotificationPriority,
  NotificationType,
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

export function formatNotificationDate(value?: string | null): string {
  return formatJalaliDateTime(value);
}
