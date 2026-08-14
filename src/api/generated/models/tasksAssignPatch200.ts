/**
 * AUTO-GENERATED FILE.
 * DO NOT EDIT MANUALLY.
 * Source: contracts/backend/openapi.json.
 */
import type { SuccessEnvelope } from './successEnvelope';
import type { TasksAssignPatch200Data } from './tasksAssignPatch200Data';

export type TasksAssignPatch200 = SuccessEnvelope & {
  /** Explicit public response payload; never a published Prisma model. */
  data: TasksAssignPatch200Data;
};
