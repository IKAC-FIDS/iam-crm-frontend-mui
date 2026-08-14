/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { SuccessEnvelope } from './successEnvelope';
import type { TasksCompletePatch200Data } from './tasksCompletePatch200Data';

export type TasksCompletePatch200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: TasksCompletePatch200Data;
};
