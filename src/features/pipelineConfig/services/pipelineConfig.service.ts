import axiosInstance from '@/lib/axios';
import type { PipelineStageConfig, TransitionRule, TransitionRulePayload, UpdatePipelineStagePayload } from '../types/pipelineConfig.types';

function unwrap<T>(payload: T | { data: T }): T {
  return typeof payload === 'object' && payload !== null && 'data' in payload ? payload.data : payload;
}
function list<T>(payload: T[] | { data?: T[]; items?: T[] }): T[] {
  return Array.isArray(payload) ? payload : payload.data ?? payload.items ?? [];
}

export const pipelineConfigService = {
  getStages: async (): Promise<PipelineStageConfig[]> => {
    const response = await axiosInstance.get<PipelineStageConfig[] | { data?: PipelineStageConfig[]; items?: PipelineStageConfig[] }>('/pipeline/stages');
    return list(response.data).sort((a, b) => a.sortOrder - b.sortOrder);
  },
  updateStage: async (id: string, payload: UpdatePipelineStagePayload): Promise<PipelineStageConfig> => {
    const response = await axiosInstance.patch<PipelineStageConfig | { data: PipelineStageConfig }>(`/pipeline/stages/${id}`, payload);
    return unwrap(response.data);
  },
  getTransitionRules: async (): Promise<TransitionRule[]> => {
    const response = await axiosInstance.get<TransitionRule[] | { data?: TransitionRule[]; items?: TransitionRule[] }>('/pipeline/transition-rules');
    return list(response.data);
  },
  createTransitionRule: async (payload: TransitionRulePayload): Promise<TransitionRule> => {
    const response = await axiosInstance.post<TransitionRule | { data: TransitionRule }>('/pipeline/transition-rules', payload);
    return unwrap(response.data);
  },
  updateTransitionRule: async (id: string, payload: TransitionRulePayload): Promise<TransitionRule> => {
    const response = await axiosInstance.patch<TransitionRule | { data: TransitionRule }>(`/pipeline/transition-rules/${id}`, payload);
    return unwrap(response.data);
  },
  deleteTransitionRule: async (id: string): Promise<void> => { await axiosInstance.delete(`/pipeline/transition-rules/${id}`); },
};
