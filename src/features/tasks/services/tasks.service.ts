import axiosInstance from '@/lib/axios';
import { unwrapApiResponse } from '@/lib/apiResponse';
import { tasksDelete, tasksGet } from '@/api/generated/endpoints';
import type { TasksGetParams } from '@/api/generated/models';
import type {
  AssignTaskPayload,
  ChangeTaskStatusPayload,
  CompleteTaskPayload,
  CreateTaskPayload,
  FindTasksParams,
  RescheduleTaskPayload,
  Task,
  TaskPage,
  UpdateTaskPayload,
} from '../types/task.types';

const cleanParams = (value: FindTasksParams) =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''));

const generatedListParams = (value: FindTasksParams): { generated: TasksGetParams; transport: Record<string, unknown> } => {
  const transport = cleanParams(value);
  if (value.overdueOnly !== undefined) transport.overdueOnly = String(value.overdueOnly);
  return {
    generated: {
      page: value.page,
      limit: value.limit,
      assignedToId: value.assignedToId,
      createdById: value.createdById,
      companyId: value.companyId,
      personId: value.personId,
      opportunityId: value.opportunityId,
      commercialDocumentId: value.commercialDocumentId,
      paymentId: value.paymentId,
      dueFrom: value.dueFrom,
      dueTo: value.dueTo,
      search: value.search,
      overdueOnly: value.overdueOnly === undefined ? undefined : String(value.overdueOnly),
    },
    transport,
  };
};

function cleanPayload<T extends CreateTaskPayload | UpdateTaskPayload | ChangeTaskStatusPayload | AssignTaskPayload | CompleteTaskPayload | RescheduleTaskPayload>(payload: T): T {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined && value !== '')) as T;
}

export const tasksService = {
  list: async (params: FindTasksParams = {}): Promise<TaskPage> => {
    const query = generatedListParams(params);
    return tasksGet(query.generated, { params: query.transport }).then((response) => ({ data: response.data, meta: response.meta }));
  },
  get: async (id: string): Promise<Task> =>
    unwrapApiResponse<Task>((await axiosInstance.get<unknown>(`/tasks/${id}`)).data),
  create: async (payload: CreateTaskPayload): Promise<Task> =>
    unwrapApiResponse<Task>((await axiosInstance.post<unknown>('/tasks', cleanPayload(payload))).data),
  update: async (id: string, payload: UpdateTaskPayload): Promise<Task> =>
    unwrapApiResponse<Task>((await axiosInstance.patch<unknown>(`/tasks/${id}`, cleanPayload(payload))).data),
  changeStatus: async (id: string, payload: ChangeTaskStatusPayload): Promise<Task> =>
    unwrapApiResponse<Task>((await axiosInstance.patch<unknown>(`/tasks/${id}/status`, cleanPayload(payload))).data),
  assign: async (id: string, payload: AssignTaskPayload): Promise<Task> =>
    unwrapApiResponse<Task>((await axiosInstance.patch<unknown>(`/tasks/${id}/assign`, cleanPayload(payload))).data),
  complete: async (id: string, payload: CompleteTaskPayload): Promise<Task> =>
    unwrapApiResponse<Task>((await axiosInstance.patch<unknown>(`/tasks/${id}/complete`, cleanPayload(payload))).data),
  reschedule: async (id: string, payload: RescheduleTaskPayload): Promise<Task> =>
    unwrapApiResponse<Task>((await axiosInstance.patch<unknown>(`/tasks/${id}/reschedule`, cleanPayload(payload))).data),
  remove: async (id: string): Promise<void> => {
    await tasksDelete(id);
  },
};
