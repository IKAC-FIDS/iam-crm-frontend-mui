/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { SuccessEnvelope } from './successEnvelope';
import type { TasksStatusPatch200Data } from './tasksStatusPatch200Data';

export type TasksStatusPatch200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: TasksStatusPatch200Data;
};
