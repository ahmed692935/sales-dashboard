import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Paperclip,
  SmilePlus,
  SquarePen,
  Type,
  Send,
  MessageSquare,
  Info,
  ChevronLeft,
  Loader2,
  Image,
  FileText,
  Music,
  X,
} from "lucide-react";
import type { ConversationWithContact } from "../../../services/whatsapp.service";
import {
  useMessages,
  useSendMessage,
  useUploadAndSendMedia,
  useAssignConversation,
  useUnassignConversation,
  useUpdateStage,
} from "../../../hooks/useWhatsapp";
import { MessageBubble } from "../MessageBubble/MessageBubble";
import { AssigneeDropdown } from "../AssignedDropdown/AssignedDropdown";
import ConfirmationModal from "../../global/ConfirmModal/ConfirmModal";
import { StageDropdown, type Stage } from "../StageDropdown/StageDropdown";

interface ChatViewProps {
  conversationId: string | null;
  contact: ConversationWithContact | null;
  onBack?: () => void;
  onShowDetail?: () => void;
}

interface PendingFile {
  file: File;
  previewUrl: string | null;
  type: "image" | "video" | "audio" | "document";
}

function resolveFileType(file: File): PendingFile["type"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "document";
}

function buildPreviewUrl(file: File): string | null {
  const t = resolveFileType(file);
  if (t === "image" || t === "video") return URL.createObjectURL(file);
  return null;
}

// ─── Attachment Menu ──────────────────────────────────────────────────────────

const AttachmentMenu = ({
  onSelect,
  onClose,
}: {
  onSelect: (type: "media" | "document" | "audio") => void;
  onClose: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const items = [
    {
      label: "Photos & Videos",
      icon: <Image size={16} />,
      value: "media" as const,
    },
    {
      label: "Document",
      icon: <FileText size={16} />,
      value: "document" as const,
    },
    { label: "Audio", icon: <Music size={16} />, value: "audio" as const },
  ];

  return (
    <div
      ref={ref}
      className="absolute bottom-12 left-0 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 w-44 z-20"
    >
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => {
            onSelect(item.value);
            onClose();
          }}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span className="text-violet-500">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
};

// ─── Media Preview Strip ──────────────────────────────────────────────────────

const MediaPreview = ({
  pending,
  caption,
  onCaptionChange,
  onRemove,
  onSend,
  isSending,
}: {
  pending: PendingFile;
  caption: string;
  onCaptionChange: (v: string) => void;
  onRemove: () => void;
  onSend: () => void;
  isSending: boolean;
}) => (
  <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 flex flex-col gap-2.5">
    <div className="flex items-start gap-3">
      <div className="relative shrink-0">
        {pending.type === "image" && pending.previewUrl ? (
          <img
            src={pending.previewUrl}
            alt="preview"
            className="w-16 h-16 rounded-lg object-cover border border-slate-200"
          />
        ) : pending.type === "video" && pending.previewUrl ? (
          <video
            src={pending.previewUrl}
            className="w-16 h-16 rounded-lg object-cover border border-slate-200"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg border border-slate-200 bg-white flex flex-col items-center justify-center gap-1">
            {pending.type === "audio" ? (
              <Music size={20} className="text-violet-500" />
            ) : (
              <FileText size={20} className="text-violet-500" />
            )}
            <span className="text-[9px] text-slate-400 px-1 truncate w-full text-center">
              {pending.file.name.split(".").pop()?.toUpperCase()}
            </span>
          </div>
        )}
        <button
          onClick={onRemove}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-600 text-white flex items-center justify-center"
        >
          <X size={10} />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-700 truncate">
          {pending.file.name}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {(pending.file.size / 1024).toFixed(0)} KB
        </p>
        {pending.type !== "audio" && (
          <input
            type="text"
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            placeholder="Add a caption..."
            className="mt-2 w-full text-xs text-slate-700 placeholder-slate-400 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-400"
          />
        )}
      </div>

      <button
        onClick={onSend}
        disabled={isSending}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors disabled:opacity-50"
      >
        {isSending ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Send size={12} />
        )}
        Send
      </button>
    </div>
  </div>
);

// ─── Chat View ────────────────────────────────────────────────────────────────

export const ChatView = ({
  conversationId,
  contact,
  onBack,
  onShowDetail,
}: ChatViewProps) => {
  const [messageText, setMessageText] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [caption, setCaption] = useState("");
  const [pendingAssignee, setPendingAssignee] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const { data: messages = [], isLoading } = useMessages(conversationId);
  const { mutate: sendMessage, isPending: isSending } =
    useSendMessage(conversationId);
  const { mutate: sendMedia, isPending: isSendingMedia } =
    useUploadAndSendMedia(conversationId);
  const { mutate: assign, isPending: isAssigning } =
    useAssignConversation(conversationId);
  const { mutate: unassign } = useUnassignConversation(conversationId);
  const { mutate: updateStage, isPending: isUpdatingStage } =
    useUpdateStage(conversationId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendText = () => {
    if (!messageText.trim() || !conversationId) return;
    sendMessage(messageText, { onSuccess: () => setMessageText("") });
  };

  const handleAttachSelect = (type: "media" | "document" | "audio") => {
    if (type === "media") mediaInputRef.current?.click();
    else if (type === "document") documentInputRef.current?.click();
    else audioInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile({
      file,
      previewUrl: buildPreviewUrl(file),
      type: resolveFileType(file),
    });
    setCaption("");
    e.target.value = "";
  };

  const handleSendMedia = () => {
    if (!pendingFile || !conversationId) return;
    sendMedia(
      { file: pendingFile.file, caption: caption || undefined },
      {
        onSuccess: () => {
          setPendingFile(null);
          setCaption("");
        },
      },
    );
  };

  const handleRemovePending = () => {
    if (pendingFile?.previewUrl) URL.revokeObjectURL(pendingFile.previewUrl);
    setPendingFile(null);
    setCaption("");
  };

  const handleConfirmAssign = () => {
    assign(pendingAssignee?.id ?? null, {
      onSuccess: () => setPendingAssignee(null),
    });
  };

  const contactName =
    contact?.contact?.name ?? contact?.contact?.phone ?? "Unknown";
  const contactPhone = contact?.contact?.phone ?? "";
  const currentStage = ((contact?.conversation as any)?.stage as Stage) ?? null;
  const isBusy = isSending || isSendingMedia;

  const headerButtons = (
    <>
      <StageDropdown
        value={currentStage}
        onSelect={(stage) => updateStage(stage)}
        disabled={isUpdatingStage}
      />
      <AssigneeDropdown
        assignedUser={contact?.assignedUser ?? null}
        onSelect={(user) => {
          if (user === null) unassign();
          else setPendingAssignee(user);
        }}
      />
      <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap">
        Open <ChevronDown size={11} />
      </button>
    </>
  );

  if (!conversationId) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gray-50 border-4 border-gray-100">
        <div className="text-center">
          <MessageSquare size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Select a conversation</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col border-4 border-gray-100 overflow-hidden bg-white min-w-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            {onBack && (
              <button
                onClick={onBack}
                className="md:hidden mt-0.5 text-slate-500 hover:text-slate-700 shrink-0"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-800 whitespace-nowrap">
                {contactName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{contactPhone}</p>
              <span className="inline-block mt-1 text-[10px] bg-teal-100 text-teal-700 font-semibold px-2 py-0.5 rounded-full">
                whatsapp
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="hidden md:flex items-center gap-1.5">
              {headerButtons}
            </div>
            {onShowDetail && (
              <button
                onClick={onShowDetail}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <Info size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex md:hidden items-center gap-1.5 mt-2 overflow-x-auto">
          {headerButtons}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 bg-gray-100 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full gap-2 text-slate-400">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-slate-400">
              No messages yet. Say hello!
            </p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
        )}
        <div ref={bottomRef} />
      </div>

      {pendingFile && (
        <MediaPreview
          pending={pendingFile}
          caption={caption}
          onCaptionChange={setCaption}
          onRemove={handleRemovePending}
          onSend={handleSendMedia}
          isSending={isSendingMedia}
        />
      )}

      <input
        ref={mediaInputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <input
        ref={documentInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,application/*,text/plain"
        onChange={handleFileChange}
      />
      <input
        ref={audioInputRef}
        type="file"
        className="hidden"
        accept="audio/*"
        onChange={handleFileChange}
      />

      {/* Input bar */}
      <div className="border-t border-slate-200 bg-white shrink-0">
        <div className="px-4 pt-3 pb-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSendText()
            }
            placeholder="Type a message"
            className="w-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent"
          />
        </div>
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setShowAttachMenu((v) => !v)}
              disabled={isBusy}
              className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
            >
              <Paperclip size={16} />
            </button>
            {showAttachMenu && (
              <AttachmentMenu
                onSelect={handleAttachSelect}
                onClose={() => setShowAttachMenu(false)}
              />
            )}
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <SmilePlus size={16} />
            </button>
            <button className="hidden sm:block text-slate-400 hover:text-slate-600 transition-colors">
              <SquarePen size={16} />
            </button>
            <button className="hidden sm:block text-slate-400 hover:text-slate-600 transition-colors">
              <Type size={16} />
            </button>
          </div>
          <button
            onClick={handleSendText}
            disabled={isBusy || !messageText.trim()}
            className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Send size={13} />
            )}
            Send
          </button>
        </div>
      </div>

      {pendingAssignee && (
        <ConfirmationModal
          variant="warning"
          title="Assign Conversation"
          message={`Assign this conversation to ${pendingAssignee.name}?`}
          confirmLabel="Assign"
          isLoading={isAssigning}
          onConfirm={handleConfirmAssign}
          onCancel={() => setPendingAssignee(null)}
        />
      )}
    </main>
  );
};
