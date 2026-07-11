import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications.service';
import type {
  CreateNotificationPayload,
  FindNotificationsParams,
  Notification,
  ReadAllNotificationsPayload,
} from '../types/notification.types';

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  lists: () => ['notifications', 'list'] as const,
  list: (params: FindNotificationsParams) => ['notifications', 'list', params] as const,
  detail: (id: string) => ['notifications', 'detail', id] as const,
  unreadCount: () => ['notifications', 'unread-count'] as const,
};

function useInvalidateNotifications() {
  const client = useQueryClient();
  return (id?: string) => Promise.all([
    client.invalidateQueries({ queryKey: notificationQueryKeys.lists() }),
    client.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount() }),
    id ? client.invalidateQueries({ queryKey: notificationQueryKeys.detail(id) }) : Promise.resolve(),
  ]);
}

export function useNotifications(params: FindNotificationsParams, enabled = true) {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => notificationsService.list(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useUnreadNotificationCount(enabled = true) {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: notificationsService.unreadCount,
    enabled,
    refetchInterval: 60_000,
  });
}

export function useNotification(id: string, enabled = true) {
  return useQuery({
    queryKey: notificationQueryKeys.detail(id),
    queryFn: () => notificationsService.get(id),
    enabled: enabled && Boolean(id),
  });
}

export function useCreateNotification() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (payload: CreateNotificationPayload) => notificationsService.create(payload),
    onSuccess: (data) => invalidate(data.id),
  });
}

export function useMarkNotificationRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (notification: Notification) => notificationsService.markRead(notification.id),
    onSuccess: (data, notification) => invalidate(data?.id ?? notification.id),
  });
}

export function useMarkNotificationUnread() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (notification: Notification) => notificationsService.markUnread(notification.id),
    onSuccess: (data, notification) => invalidate(data?.id ?? notification.id),
  });
}

export function useReadAllNotifications() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (payload?: ReadAllNotificationsPayload) => notificationsService.readAll(payload),
    onSuccess: () => invalidate(),
  });
}

export function useArchiveNotification() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (notification: Notification) => notificationsService.archive(notification.id),
    onSuccess: (data, notification) => invalidate(data?.id ?? notification.id),
  });
}

export function useUnarchiveNotification() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (notification: Notification) => notificationsService.unarchive(notification.id),
    onSuccess: (data, notification) => invalidate(data?.id ?? notification.id),
  });
}

export function useDeleteNotification() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (notification: Notification) => notificationsService.remove(notification.id),
    onSuccess: (_data, notification) => invalidate(notification.id),
  });
}
