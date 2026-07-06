import type { UserRole } from '@/features/admin/users/types/adminUser.types';
export type TerminalType = 'WON' | 'LOST' | 'ON_HOLD' | 'NONE';
export interface PipelineStageConfig { id: string; code: string; label: string; description?: string | null; sortOrder: number; color?: string | null; isActive: boolean; isTerminal: boolean; terminalType?: TerminalType | null; isDefault: boolean; createdAt?: string; updatedAt?: string }
export interface CreatePipelineStagePayload { code: string; label: string; description?: string; sortOrder?: number; color?: string; isActive?: boolean; isTerminal?: boolean; terminalType?: TerminalType; isDefault?: boolean }
export type UpdatePipelineStagePayload = Omit<CreatePipelineStagePayload, 'code'>;
export interface TransitionStageRef { id: string; code: string; label: string }
export interface TransitionRule { id: string; fromStageId?: string | null; toStageId: string; fromStage?: TransitionStageRef | null; toStage?: TransitionStageRef; role?: UserRole | null; allowed: boolean }
export interface TransitionRulePayload { fromStageId?: string | null; toStageId: string; role?: UserRole | null; allowed: boolean }
export interface ReorderStagesPayload { items: Array<{ id: string; sortOrder: number }> }
