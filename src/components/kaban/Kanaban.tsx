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
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import type { ConversationWithContact } from "../../services/whatsapp.service";
import type { Stage } from "../Inbox/StageDropdown/StageDropdown";
import { KanbanColumn } from "./KanbanColumn/KanbanColumn";
import { KanbanCard } from "./KanbanColumn/KanbanCard";

const STAGE_CONFIG = [
  {
    id: "new_lead" as Stage,
    label: "New Lead",
    accent: "#7364FF",
    glow: "#7364FF",
  },
  {
    id: "contacted" as Stage,
    label: "Contacted",
    accent: "#3B82F6",
    glow: "#3B82F6",
  },
  {
    id: "proposal_sent" as Stage,
    label: "Proposal Sent",
    accent: "#8B5CF6",
    glow: "#8B5CF6",
  },
  {
    id: "application_submitted" as Stage,
    label: "Application Submitted",
    accent: "#10B981",
    glow: "#10B981",
  },
  { id: "won" as Stage, label: "Won", accent: "#14B8A6", glow: "#14B8A6" },
  { id: "lost" as Stage, label: "Lost", accent: "#EF4444", glow: "#EF4444" },
];

const fetchKanban = async (): Promise<ConversationWithContact[]> => {
  const { data } = await api.get("/leads/kanban");
  return data.data;
};

const patchStage = async (conversationId: string, stage: Stage) => {
  const { data } = await api.patch(
    `/leads/conversations/${conversationId}/stage`,
    { stage },
  );
  return data.data;
};

const Kanban = () => {
  const qc = useQueryClient();
  const [activeItem, setActiveItem] = useState<ConversationWithContact | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const {
    data: rawItems = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["kanban-conversations"],
    queryFn: fetchKanban,
    refetchInterval: 20000,
  });

  const { mutate: updateStage } = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: Stage }) =>
      patchStage(id, stage),
    onMutate: async ({ id, stage }) => {
      await qc.cancelQueries({ queryKey: ["kanban-conversations"] });
      const prev = qc.getQueryData<ConversationWithContact[]>([
        "kanban-conversations",
      ]);
      qc.setQueryData<ConversationWithContact[]>(
        ["kanban-conversations"],
        (old = []) =>
          old.map((item) =>
            item.conversation.id === id
              ? { ...item, conversation: { ...item.conversation, stage } }
              : item,
          ),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["kanban-conversations"], ctx.prev);
      toast.error("Failed to update stage");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["kanban-conversations"] });
      qc.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
    },
  });

  // ── Fix 1: proper Record init (no cast error) ─────────────────────────────
  const grouped = useMemo(() => {
    const map: Record<Stage, ConversationWithContact[]> = {
      new_lead: [],
      contacted: [],
      proposal_sent: [],
      application_submitted: [],
      won: [],
      lost: [],
    };

    for (const item of rawItems) {
      // ── Fix 2: skip null stage — don't default to new_lead ────────────────
      const stage = (item.conversation as any).stage as
        | Stage
        | null
        | undefined;
      if (stage && map[stage]) {
        map[stage].push(item);
      }
    }
    return map;
  }, [rawItems]);

  const handleDragStart = (e: DragStartEvent) => {
    const item = rawItems.find((i) => i.conversation.id === e.active.id);
    setActiveItem(item ?? null);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = e;
    if (!over) return;

    const toStage = STAGE_CONFIG.find((s) => s.id === over.id)?.id;
    if (!toStage) return;

    const currentStage = (
      rawItems.find((i) => i.conversation.id === active.id)?.conversation as any
    )?.stage as Stage | null;

    if (currentStage === toStage) return;

    updateStage({ id: active.id as string, stage: toStage });
  };

  const stageTotal = STAGE_CONFIG.reduce(
    (sum, s) => sum + (grouped[s.id]?.length ?? 0),
    0,
  );
  const unstagedCount = rawItems.length - stageTotal;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="shrink-0 px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-800">Kanban</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create and manage WhatsApp broadcast campaigns
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
          <button className="btn-primary text-sm px-4 py-2">
            Add a new contact
          </button>
        </div>
      </div>

      {/* Board */}
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
              {STAGE_CONFIG.map((stage) => (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  items={grouped[stage.id] ?? []}
                />
              ))}
            </div>

            <DragOverlay dropAnimation={null}>
              {activeItem && <KanbanCard item={activeItem} isDragOverlay />}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default Kanban;
