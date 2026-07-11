import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { opportunityKeys } from '@/features/opportunities/hooks/useOpportunities';
import { tasksService } from '../services/tasks.service';
import type {
  AssignTaskPayload,
  ChangeTaskStatusPayload,
  CompleteTaskPayload,
  CreateTaskPayload,
  FindTasksParams,
  RescheduleTaskPayload,
  Task,
  UpdateTaskPayload,
} from '../types/task.types';

export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => ['tasks', 'list'] as const,
  list: (params: FindTasksParams) => ['tasks', 'list', params] as const,
  detail: (id: string) => ['tasks', 'detail', id] as const,
};

function useInvalidateTasks() {
  const client = useQueryClient();
  return (task?: Task, taskId?: string) => Promise.all([
    client.invalidateQueries({ queryKey: taskQueryKeys.lists() }),
    taskId ? client.invalidateQueries({ queryKey: taskQueryKeys.detail(taskId) }) : Promise.resolve(),
    task?.opportunityId ? client.invalidateQueries({ queryKey: opportunityKeys.detail(task.opportunityId) }) : Promise.resolve(),
    task?.companyId ? client.invalidateQueries({ queryKey: ['companies', 'detail', task.companyId] }) : Promise.resolve(),
    client.invalidateQueries({ queryKey: opportunityKeys.all }),
    client.invalidateQueries({ queryKey: ['pipeline'] }),
  ]);
}

export function useTasks(params: FindTasksParams, enabled = true) {
  return useQuery({
    queryKey: taskQueryKeys.list(params),
    queryFn: () => tasksService.list(params),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useTask(id: string, enabled = true) {
  return useQuery({ queryKey: taskQueryKeys.detail(id), queryFn: () => tasksService.get(id), enabled: enabled && Boolean(id) });
}

export function useCreateTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({ mutationFn: (payload: CreateTaskPayload) => tasksService.create(payload), onSuccess: (data) => invalidate(data, data.id) });
}

export function useUpdateTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) => tasksService.update(id, payload), onSuccess: (data, vars) => invalidate(data, vars.id) });
}

export function useChangeTaskStatus() {
  const invalidate = useInvalidateTasks();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: ChangeTaskStatusPayload }) => tasksService.changeStatus(id, payload), onSuccess: (data, vars) => invalidate(data, vars.id) });
}

export function useAssignTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: AssignTaskPayload }) => tasksService.assign(id, payload), onSuccess: (data, vars) => invalidate(data, vars.id) });
}

export function useCompleteTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: CompleteTaskPayload }) => tasksService.complete(id, payload), onSuccess: (data, vars) => invalidate(data, vars.id) });
}

export function useRescheduleTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: RescheduleTaskPayload }) => tasksService.reschedule(id, payload), onSuccess: (data, vars) => invalidate(data, vars.id) });
}

export function useDeleteTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({ mutationFn: (task: Task) => tasksService.remove(task.id), onSuccess: (_data, task) => invalidate(task, task.id) });
}
