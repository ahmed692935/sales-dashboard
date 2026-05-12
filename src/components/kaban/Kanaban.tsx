import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw, Plus } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import type { ConversationWithContact } from "../../services/whatsapp.service";
import {
  useStages,
  useCreateStage,
  useUpdateStageDef,
  useDeleteStage,
} from "../../hooks/useStages";
import { KanbanColumn } from "./KanbanColumn/KanbanColumn";
import { KanbanCard } from "./KanbanColumn/KanbanCard";
import { AddStageModal } from "./AddLeadStageModal/AddLeadStageModal";

const fetchKanban = async (): Promise<ConversationWithContact[]> => {
  const { data } = await api.get("/leads/kanban");
  return data.data;
};

const patchStage = async (conversationId: string, stage: string) => {
  const { data } = await api.patch(
    `/leads/conversations/${conversationId}/stage`,
    { stage },
  );
  return data.data;
};

const Kanban = () => {
  const qc = useQueryClient();

  const [activeItem, setActiveItem] =
    useState<ConversationWithContact | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const { data: stages = [], isLoading: stagesLoading } = useStages();
  const { mutate: createStage, isPending: isCreating } = useCreateStage();
  const { mutate: updateStageDef } = useUpdateStageDef();
  const { mutate: deleteStage } = useDeleteStage();

  const {
    data: rawItems = [],
    isLoading: itemsLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["kanban-conversations"],
    queryFn: fetchKanban,
    refetchInterval: 20000,
  });

  const stageMap = useMemo(() => {
    return new Map(stages.map((s) => [s.id, s]));
  }, [stages]);

  const { mutate: updateConvStage } = useMutation({
    mutationFn: ({ id, stageId }: { id: string; stageId: string }) =>
      patchStage(id, stageId),

    onMutate: async ({ id, stageId }) => {
      await qc.cancelQueries({ queryKey: ["kanban-conversations"] });

      const prev = qc.getQueryData<ConversationWithContact[]>([
        "kanban-conversations",
      ]);

      qc.setQueryData<ConversationWithContact[]>(
        ["kanban-conversations"],
        (old = []) =>
          old.map((item) =>
            item.conversation.id === id
              ? {
                  ...item,
                  conversation: {
                    ...item.conversation,
                    stage: stageId,
                  },
                }
              : item,
          ),
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(["kanban-conversations"], ctx.prev);
      }
      toast.error("Failed to update stage");
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["kanban-conversations"] });
      qc.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
    },
  });

  const grouped = useMemo(() => {
    const map: Record<string, ConversationWithContact[]> = {};

    for (const stage of stages) {
      map[stage.slug] = [];
    }

    for (const item of rawItems) {
      const stageId = item.conversation.stage;
      if (!stageId) continue;

      const stage = stageMap.get(stageId);
      if (!stage) continue;

      map[stage.slug].push(item);
    }

    return map;
  }, [rawItems, stages, stageMap]);

  const handleDragStart = (e: DragStartEvent) => {
    const item = rawItems.find((i) => i.conversation.id === e.active.id);
    setActiveItem(item ?? null);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveItem(null);

    const { active, over } = e;
    if (!over) return;

    const toStageSlug = over.id as string;

    const targetStage = stages.find((s) => s.slug === toStageSlug);
    if (!targetStage) return;

    const currentStageId =
      rawItems.find((i) => i.conversation.id === active.id)?.conversation
        .stage ?? null;

    if (currentStageId === targetStage.id) return;

    updateConvStage({
      id: active.id as string,
      stageId: targetStage.id,
    });
  };

  const handleRenameStage = (stageId: string, newName: string) => {
    updateStageDef(
      { id: stageId, name: newName },
      { onError: () => toast.error("Failed to rename stage") },
    );
  };

  const handleDeleteStage = (stageId: string) => {
    deleteStage(stageId, {
      onSuccess: () => toast.success("Stage deleted"),
      onError: () => toast.error("Failed to delete stage"),
    });
  };

  const handleAddStage = (name: string, color: string) => {
    createStage(
      { name, color },
      {
        onSuccess: () => {
          setShowAddModal(false);
          toast.success("Stage created");
        },
        onError: () => toast.error("Failed to create stage"),
      },
    );
  };

  const stageTotal = stages.reduce(
    (sum, s) => sum + (grouped[s.slug]?.length ?? 0),
    0,
  );

  const unstagedCount = rawItems.length - stageTotal;
  const isLoading = stagesLoading || itemsLoading;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="shrink-0 px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-800">Kanban</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Drag contacts between stages to manage your pipeline
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unstagedCount > 0 && (
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              {unstagedCount} unstaged
            </span>
          )}

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-sm px-4 py-2"
          >
            <Plus size={14} />
            Add new Stage
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading pipeline...</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 items-start min-w-max h-full">
              {stages.map((stage) => (
                <KanbanColumn
                  key={stage.id}
                  stage={{
                    id: stage.slug,
                    stageId: stage.id,
                    label: stage.name,
                    accent: stage.color,
                    glow: stage.color,
                  }}
                  items={grouped[stage.slug] ?? []}
                  onRename={(newName) =>
                    handleRenameStage(stage.id, newName)
                  }
                  onDelete={() => handleDeleteStage(stage.id)}
                />
              ))}
            </div>

            <DragOverlay dropAnimation={null}>
              {activeItem && <KanbanCard item={activeItem} isDragOverlay />}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      <AddStageModal
        isOpen={showAddModal}
        isLoading={isCreating}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleAddStage}
      />
    </div>
  );
};

export default Kanban;