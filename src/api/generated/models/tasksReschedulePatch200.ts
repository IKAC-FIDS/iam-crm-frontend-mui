/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { SuccessEnvelope } from './successEnvelope';
import type { TasksReschedulePatch200Data } from './tasksReschedulePatch200Data';

export type TasksReschedulePatch200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: TasksReschedulePatch200Data;
};
