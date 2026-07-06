import axiosInstance from '@/lib/axios';
import type { CreatePipelineStagePayload, PipelineStageConfig, ReorderStagesPayload, TransitionRule, TransitionRulePayload, UpdatePipelineStagePayload } from '../types/pipelineConfig.types';
const unwrap = (payload: unknown): unknown => typeof payload === 'object' && payload !== null && 'data' in payload ? (payload as { data: unknown }).data : payload;
const list = (payload: unknown): unknown[] => { const data = unwrap(payload); if (Array.isArray(data)) return data; return data && typeof data === 'object' && 'items' in data && Array.isArray((data as { items: unknown }).items) ? (data as { items: unknown[] }).items : []; };
const stage = (item: unknown): PipelineStageConfig => { const r = item as Record<string, unknown>; return { id: String(r.id), code: String(r.code), label: String(r.label ?? r.code), description: r.description == null ? null : String(r.description), sortOrder: Number(r.sortOrder ?? 0), color: r.color == null ? null : String(r.color), isActive: Boolean(r.isActive), isTerminal: Boolean(r.isTerminal), terminalType: r.terminalType as PipelineStageConfig['terminalType'], isDefault: Boolean(r.isDefault), createdAt: r.createdAt == null ? undefined : String(r.createdAt), updatedAt: r.updatedAt == null ? undefined : String(r.updatedAt) }; };
const ref = (value: unknown) => { if (!value || typeof value !== 'object') return undefined; const r = value as Record<string, unknown>; return { id: String(r.id), code: String(r.code), label: String(r.label ?? r.code) }; };
const rule = (item: unknown): TransitionRule => { const r = item as Record<string, unknown>; const from = ref(r.fromStage); const to = ref(r.toStage); return { id: String(r.id), fromStageId: r.fromStageId == null ? from?.id ?? null : String(r.fromStageId), toStageId: String(r.toStageId ?? to?.id), fromStage: from ?? null, toStage: to, role: r.role == null ? null : r.role as TransitionRule['role'], allowed: Boolean(r.isAllowed ?? r.allowed) }; };
const transitionPayload = (p: TransitionRulePayload) => ({ fromStageId: p.fromStageId ?? null, toStageId: p.toStageId, role: p.role ?? null, isAllowed: p.allowed });
export const pipelineConfigService = {
  getStages: async () => list((await axiosInstance.get('/admin/pipeline/stages')).data).map(stage).sort((a, b) => a.sortOrder - b.sortOrder),
  getStage: async (id: string) => stage(unwrap((await axiosInstance.get(`/admin/pipeline/stages/${id}`)).data)),
  createStage: async (payload: CreatePipelineStagePayload) => stage(unwrap((await axiosInstance.post('/admin/pipeline/stages', payload)).data)),
  updateStage: async (id: string, payload: UpdatePipelineStagePayload) => stage(unwrap((await axiosInstance.patch(`/admin/pipeline/stages/${id}`, payload)).data)),
  deactivateStage: async (id: string, replacementStageId?: string) => stage(unwrap((await axiosInstance.delete(`/admin/pipeline/stages/${id}`, { params: { replacementStageId } })).data)),
  reorderStages: async (payload: ReorderStagesPayload) => list((await axiosInstance.patch('/admin/pipeline/stages/reorder', payload)).data).map(stage),
  getTransitionRules: async () => list((await axiosInstance.get('/admin/pipeline/transitions')).data).map(rule),
  createTransitionRule: async (payload: TransitionRulePayload) => rule(unwrap((await axiosInstance.post('/admin/pipeline/transitions', transitionPayload(payload))).data)),
  updateTransitionRule: async (id: string, payload: TransitionRulePayload) => rule(unwrap((await axiosInstance.patch(`/admin/pipeline/transitions/${id}`, transitionPayload(payload))).data)),
  deleteTransitionRule: async (id: string) => { await axiosInstance.delete(`/admin/pipeline/transitions/${id}`); },
};
