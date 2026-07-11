import type { PaginatedResult } from '@/lib/apiResponse';

export const notificationTypes = [
  'SYSTEM',
  'TASK_CREATED',
  'TASK_ASSIGNED',
  'TASK_STATUS_CHANGED',
  'TASK_COMPLETED',
  'TASK_RESCHEDULED',
  'OPPORTUNITY_UPDATED',
  'COMMERCIAL_DOCUMENT_UPDATED',
  'PAYMENT_UPDATED',
  'ATTACHMENT_UPLOADED',
] as const;

export type NotificationType = (typeof notificationTypes)[number];

export const notificationPriorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const;

export type NotificationPriority = (typeof notificationPriorities)[number];

export const notificationEntityTypes = [
  'TASK',
  'COMPANY',
  'PERSON',
  'OPPORTUNITY',
  'COMMERCIAL_DOCUMENT',
  'PAYMENT',
  'ATTACHMENT',
] as const;

export type NotificationEntityType = (typeof notificationEntityTypes)[number];

export interface NotificationUserSummary {
  id: string;
  fullName?: string | null;
  email?: string | null;
  role?: string | null;
  team?: string | null;
}

export interface Notification {
  id: string;
  recipientId: string;
  recipient?: NotificationUserSummary | null;
  actorId?: string | null;
  actor?: NotificationUserSummary | null;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body?: string | null;
  entityType?: NotificationEntityType | null;
  entityId?: string | null;
  actionUrl?: string | null;
  metadata?: Record<string, unknown> | null;
  readAt?: string | null;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FindNotificationsParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  priority?: NotificationPriority;
  entityType?: NotificationEntityType;
  entityId?: string;
  status?: 'unread' | 'read' | 'all';
  includeArchived?: boolean | string;
  archivedOnly?: boolean | string;
  search?: string;
}

export interface CreateNotificationPayload {
  recipientIds: string[];
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  body?: string;
  entityType?: NotificationEntityType;
  entityId?: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface ReadAllNotificationsPayload {
  type?: NotificationType;
  entityType?: NotificationEntityType;
  entityId?: string;
}

export interface UnreadCountResponse {
  total: number;
}

export type NotificationPage = PaginatedResult<Notification>;
