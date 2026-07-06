import axiosInstance from '@/lib/axios';
import type { PipelineStageConfig, TransitionRule, TransitionRulePayload, UpdatePipelineStagePayload } from '../types/pipelineConfig.types';

function unwrap(payload: unknown): unknown {
  return typeof payload === 'object' && payload !== null && 'data' in payload
    ? (payload as { data: unknown }).data
    : payload;
}

function list(payload: unknown): unknown[] {
  const data = unwrap(payload);
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'items' in data && Array.isArray((data as { items: unknown }).items)) {
    return (data as { items: unknown[] }).items;
  }
  return [];
}

function normalizeStageConfig(item: unknown): PipelineStageConfig {
  const raw = item as Record<string, unknown>;
  return {
    id: String(raw.id),
    code: String(raw.code ?? raw.stage),
    label: String(raw.label ?? raw.stage ?? raw.code),
    description: raw.description == null ? null : String(raw.description),
    sortOrder: Number(raw.sortOrder ?? 0),
    color: raw.color == null ? null : String(raw.color),
    isActive: Boolean(raw.isActive),
    isTerminal: Boolean(raw.isTerminal),
  };
}

function normalizeTransitionRule(item: unknown): TransitionRule {
  const raw = item as Record<string, unknown>;
  return {
    id: String(raw.id),
    fromStage: String(raw.fromStage),
    toStage: String(raw.toStage),
    role: String(raw.role),
    allowed: Boolean(raw.allowed ?? raw.isAllowed),
  };
}

function transitionPayload(payload: TransitionRulePayload) {
  return { fromStage: payload.fromStage, toStage: payload.toStage, role: payload.role, isAllowed: payload.allowed };
}

export const pipelineConfigService = {
  getStages: async (): Promise<PipelineStageConfig[]> => {
    const response = await axiosInstance.get('/admin/pipeline/stages');
    return list(response.data).map(normalizeStageConfig).sort((a, b) => a.sortOrder - b.sortOrder);
  },
  updateStage: async (stage: string, payload: UpdatePipelineStagePayload): Promise<PipelineStageConfig> => {
    const response = await axiosInstance.patch(`/admin/pipeline/stages/${stage}`, payload);
    return normalizeStageConfig(unwrap(response.data));
  },
  getTransitionRules: async (): Promise<TransitionRule[]> => {
    const response = await axiosInstance.get('/admin/pipeline/transitions');
    return list(response.data).map(normalizeTransitionRule);
  },
  createTransitionRule: async (payload: TransitionRulePayload): Promise<TransitionRule> => {
    const response = await axiosInstance.post('/admin/pipeline/transitions', transitionPayload(payload));
    return normalizeTransitionRule(unwrap(response.data));
  },
  updateTransitionRule: async (id: string, payload: TransitionRulePayload): Promise<TransitionRule> => {
    const response = await axiosInstance.patch(`/admin/pipeline/transitions/${id}`, transitionPayload(payload));
    return normalizeTransitionRule(unwrap(response.data));
  },
  deleteTransitionRule: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/admin/pipeline/transitions/${id}`);
  },
};
