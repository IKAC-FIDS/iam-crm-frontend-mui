import type { GridValidRowModel } from '@mui/x-data-grid';
import type { Priority } from '@/features/companies/types/company.types';
import { getPriorityLabel } from '@/features/companies/utils/companyDisplay';
import { formatJalaliDateTime } from '@/shared/utils/jalaliDate';
import type { Task, TaskStatus } from '../types/task.types';

export const taskStatusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'انجام‌نشده' },
  { value: 'IN_PROGRESS', label: 'در حال انجام' },
  { value: 'DONE', label: 'انجام‌شده' },
  { value: 'CANCELLED', label: 'لغوشده' },
];

export const taskPriorityOptions: { value: Priority; label: string }[] = [
  { value: 'LOW', label: 'کم' },
  { value: 'MEDIUM', label: 'متوسط' },
  { value: 'HIGH', label: 'زیاد' },
  { value: 'STRATEGIC', label: 'راهبردی' },
];

export function getTaskStatusLabel(status?: TaskStatus | string | null): string {
  return taskStatusOptions.find((item) => item.value === status)?.label ?? '—';
}

export function getTaskStatusColor(status?: TaskStatus | string | null): 'default' | 'primary' | 'success' | 'warning' {
  if (status === 'IN_PROGRESS') return 'primary';
  if (status === 'DONE') return 'success';
  if (status === 'CANCELLED') return 'default';
  return 'warning';
}

export function getTaskPriorityLabel(priority?: Priority | string | null): string {
  return getPriorityLabel(priority);
}

export function getTaskPriorityColor(priority?: Priority | string | null): 'default' | 'primary' | 'secondary' | 'warning' | 'error' {
  if (priority === 'STRATEGIC') return 'error';
  if (priority === 'HIGH') return 'warning';
  if (priority === 'MEDIUM') return 'secondary';
  if (priority === 'LOW') return 'primary';
  return 'default';
}

export function formatTaskDate(value?: string | null): string {
  return formatJalaliDateTime(value);
}

export function isTaskOverdue(task: Task): boolean {
  if (!task.dueAt || task.status === 'DONE' || task.status === 'CANCELLED') return false;
  return new Date(task.dueAt).getTime() < Date.now();
}

export function getTaskLinkedEntityLabel(task: Task): string {
  if (task.opportunity) return task.opportunity.title || 'فرصت';
  if (task.company) return task.company.brandName || task.company.legalName || 'شرکت';
  if (task.person) return task.person.fullName || 'شخص';
  if (task.commercialDocument) return task.commercialDocument.title || task.commercialDocument.number || 'سند تجاری';
  if (task.payment) return `پرداخت ${task.payment.currency ?? ''} ${task.payment.amount ?? ''}`.trim();
  return '—';
}

export function taskRowClassName(params: GridValidRowModel): string {
  return isTaskOverdue(params.row as Task) ? 'task-overdue-row' : '';
}
