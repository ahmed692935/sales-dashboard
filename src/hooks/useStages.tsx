import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  stagesService,
  type CreateStageDto,
  type UpdateStageDto,
} from "../services/stages.service";

const STAGES_KEY = ["stages"];

export function useStages() {
  return useQuery({
    queryKey: STAGES_KEY,
    queryFn: stagesService.list,
  });
}

export function useStageById(id: string | null) {
  return useQuery({
    queryKey: [...STAGES_KEY, id],
    queryFn: () => stagesService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateStageDto) => stagesService.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAGES_KEY }),
  });
}

export function useUpdateStageDef() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...dto }: UpdateStageDto & { id: string }) =>
      stagesService.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAGES_KEY }),
  });
}

export function useReorderStages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (stageIds: string[]) => stagesService.reorder(stageIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAGES_KEY }),
  });
}

export function useDeleteStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => stagesService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STAGES_KEY });
      qc.invalidateQueries({ queryKey: ["kanban-conversations"] });
    },
  });
}
