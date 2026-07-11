import axiosInstance from '@/lib/axios';
import { unwrapApiResponse, unwrapPaginatedApiResponse } from '@/lib/apiResponse';
import type {
  CreateNotificationPayload,
  FindNotificationsParams,
  Notification,
  NotificationPage,
  ReadAllNotificationsPayload,
  UnreadCountResponse,
} from '../types/notification.types';

function cleanObject<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== '')
  ) as Partial<T>;
}

function cleanPayload(payload: CreateNotificationPayload): CreateNotificationPayload {
  const cleaned = cleanObject({
    ...payload,
    title: payload.title.trim(),
    body: payload.body?.trim() || undefined,
    entityId: payload.entityId?.trim() || undefined,
    actionUrl: payload.actionUrl?.trim() || undefined,
  });

  return {
    recipientIds: payload.recipientIds,
    type: payload.type,
    title: String(cleaned.title),
    priority: payload.priority,
    body: cleaned.body as string | undefined,
    entityType: payload.entityType,
    entityId: cleaned.entityId as string | undefined,
    actionUrl: cleaned.actionUrl as string | undefined,
    metadata: payload.metadata,
  };
}

function normalizeUnreadCount(value: unknown): UnreadCountResponse {
  const data = unwrapApiResponse<unknown>(value);
  if (
    typeof data === 'object' &&
    data !== null &&
    'total' in data &&
    typeof (data as { total?: unknown }).total === 'number'
  ) {
    return { total: (data as { total: number }).total };
  }
  return { total: 0 };
}

export const notificationsService = {
  list: async (params: FindNotificationsParams = {}): Promise<NotificationPage> =>
    unwrapPaginatedApiResponse<Notification>(
      (await axiosInstance.get<unknown>('/notifications', { params: cleanObject(params) })).data
    ),
  unreadCount: async (): Promise<UnreadCountResponse> =>
    normalizeUnreadCount((await axiosInstance.get<unknown>('/notifications/unread-count')).data),
  get: async (id: string): Promise<Notification> =>
    unwrapApiResponse<Notification>((await axiosInstance.get<unknown>(`/notifications/${id}`)).data),
  create: async (payload: CreateNotificationPayload): Promise<Notification> =>
    unwrapApiResponse<Notification>((await axiosInstance.post<unknown>('/notifications', cleanPayload(payload))).data),
  markRead: async (id: string): Promise<Notification> =>
    unwrapApiResponse<Notification>((await axiosInstance.patch<unknown>(`/notifications/${id}/read`)).data),
  markUnread: async (id: string): Promise<Notification> =>
    unwrapApiResponse<Notification>((await axiosInstance.patch<unknown>(`/notifications/${id}/unread`)).data),
  readAll: async (payload: ReadAllNotificationsPayload = {}): Promise<void> => {
    await axiosInstance.patch('/notifications/read-all', cleanObject(payload));
  },
  archive: async (id: string): Promise<Notification> =>
    unwrapApiResponse<Notification>((await axiosInstance.patch<unknown>(`/notifications/${id}/archive`)).data),
  unarchive: async (id: string): Promise<Notification> =>
    unwrapApiResponse<Notification>((await axiosInstance.patch<unknown>(`/notifications/${id}/unarchive`)).data),
  remove: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/notifications/${id}`);
  },
};
