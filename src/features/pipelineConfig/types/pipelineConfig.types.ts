import type { PipelineStage } from '@/features/companies/types/company.types';
import type { UserRole } from '@/features/admin/users/types/adminUser.types';

export interface PipelineStageConfig {
  id: string;
  code: PipelineStage | string;
  label: string;
  description?: string | null;
  sortOrder: number;
  color?: string | null;
  isActive: boolean;
  isTerminal: boolean;
}

export interface UpdatePipelineStagePayload {
  label: string;
  description?: string;
  sortOrder: number;
  color?: string;
  isActive: boolean;
  isTerminal: boolean;
}

export interface TransitionRule {
  id: string;
  fromStage: PipelineStage | string;
  toStage: PipelineStage | string;
  role: UserRole | string;
  allowed: boolean;
}

export interface TransitionRulePayload {
  fromStage: PipelineStage;
  toStage: PipelineStage;
  role: UserRole;
  allowed: boolean;
}
