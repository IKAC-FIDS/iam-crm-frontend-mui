import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pipelineConfigService } from '../services/pipelineConfig.service';
import type { TransitionRulePayload, UpdatePipelineStagePayload } from '../types/pipelineConfig.types';

export const pipelineConfigQueryKeys = {
  all: ['pipeline-config'] as const,
  stages: () => [...pipelineConfigQueryKeys.all, 'stages'] as const,
  rules: () => [...pipelineConfigQueryKeys.all, 'transition-rules'] as const,
};
export function usePipelineStages(enabled = true) { return useQuery({ queryKey: pipelineConfigQueryKeys.stages(), queryFn: pipelineConfigService.getStages, enabled, staleTime: 60_000 }); }
export function useTransitionRules(enabled = true) { return useQuery({ queryKey: pipelineConfigQueryKeys.rules(), queryFn: pipelineConfigService.getTransitionRules, enabled, staleTime: 60_000 }); }
export function useUpdatePipelineStage() { const client = useQueryClient(); return useMutation({ mutationFn: ({ stage, payload }: { stage: string; payload: UpdatePipelineStagePayload }) => pipelineConfigService.updateStage(stage, payload), onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: pipelineConfigQueryKeys.stages() }), client.invalidateQueries({ queryKey: ['pipeline'] })]) }); }
function useInvalidateRules() { const client = useQueryClient(); return () => client.invalidateQueries({ queryKey: pipelineConfigQueryKeys.rules() }); }
export function useCreateTransitionRule() { const invalidate = useInvalidateRules(); return useMutation({ mutationFn: (payload: TransitionRulePayload) => pipelineConfigService.createTransitionRule(payload), onSuccess: invalidate }); }
export function useUpdateTransitionRule() { const invalidate = useInvalidateRules(); return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: TransitionRulePayload }) => pipelineConfigService.updateTransitionRule(id, payload), onSuccess: invalidate }); }
export function useDeleteTransitionRule() { const invalidate = useInvalidateRules(); return useMutation({ mutationFn: pipelineConfigService.deleteTransitionRule, onSuccess: invalidate }); }
