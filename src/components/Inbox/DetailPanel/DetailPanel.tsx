import { useState } from "react";
import type { ConversationWithContact } from "../../../services/whatsapp.service";
import {
  Check,
  ChevronLeft,
  Circle,
  Hash,
  Loader2,
  MapPin,
  MessageSquare,
  Paperclip,
  Pencil,
  Phone,
  Plus,
  SmilePlus,
  Trash2,
  X,
} from "lucide-react";
import {
  useContactDetail,
  useUpdateContact,
  useAddTag,
  useRemoveTag,
  useUpsertCustomField,
  useRemoveCustomField,
  useAddNote,
  useRemoveNote,
} from "../../../hooks/useDetailPanel";

export const DetailPanel = ({
  contact,
  onBack,
}: {
  contact: ConversationWithContact | null;
  onBack?: () => void;
}) => {
  const contactId = contact?.contact?.id ?? null;
  const conversationId = contact?.conversation?.id ?? null;
  const name = contact?.contact?.name ?? contact?.contact?.phone ?? "Unknown";
  const phone = contact?.contact?.phone ?? "—";

  const { data, isLoading } = useContactDetail(contactId, conversationId);

  const { mutate: updateContact } = useUpdateContact(contactId);
  const { mutate: addTag, isPending: isAddingTag } = useAddTag(contactId);
  const { mutate: removeTag } = useRemoveTag(contactId);
  const { mutate: upsertField, isPending: isAddingField } =
    useUpsertCustomField(contactId);
  const { mutate: removeField } = useRemoveCustomField(contactId);
  const { mutate: addNote, isPending: isAddingNote } = useAddNote(contactId);
  const { mutate: removeNote } = useRemoveNote(contactId);

  const [note, setNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [showAddTag, setShowAddTag] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showAddField, setShowAddField] = useState(false);
  const [fieldKey, setFieldKey] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const tags = data?.tags ?? [];
  const customFields = data?.customFields ?? [];
  const notes = data?.notes ?? [];
  const journey = data?.journey ?? [];

  const detailRows = [
    { icon: <MessageSquare size={13} />, label: "Channel", value: "WhatsApp" },
    {
      icon: <Hash size={13} />,
      label: "ID",
      value: contact?.conversation.id.slice(0, 13) ?? "—",
    },
    { icon: <Phone size={13} />, label: "Phone num..", value: phone },
    { icon: <MapPin size={13} />, label: "Address", value: "—" },
  ];

  const handleSaveName = () => {
    if (editName.trim() && editName.trim() !== name) {
      updateContact({ name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    addTag(
      { label: tagInput.trim() },
      {
        onSuccess: () => {
          setTagInput("");
          setShowAddTag(false);
        },
      },
    );
  };

  const handleAddField = () => {
    if (!fieldKey.trim() || !fieldValue.trim()) return;
    upsertField(
      { key: fieldKey.trim(), value: fieldValue.trim() },
      {
        onSuccess: () => {
          setFieldKey("");
          setFieldValue("");
          setShowAddField(false);
        },
      },
    );
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    addNote(note.trim(), { onSuccess: () => setNote("") });
  };

  if (isLoading) {
    return (
      <aside className="bg-white border-l border-4 border-gray-100 flex items-center justify-center w-full lg:w-68 xl:w-70 shrink-0 h-full">
        <Loader2 size={16} className="animate-spin text-slate-400" />
      </aside>
    );
  }

  return (
    <aside className="bg-white border-l border-4 border-gray-100 flex flex-col overflow-y-auto w-full lg:w-68 xl:w-70 shrink-0 h-full">
      {onBack && (
        <div className="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700"
          >
            <ChevronLeft size={15} />
            <span className="text-sm font-medium">Back to chat</span>
          </button>
        </div>
      )}

      {/* ── Contact Header ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {name.charAt(0).toUpperCase()}
        </div>
        {isEditing ? (
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName();
              if (e.key === "Escape") setIsEditing(false);
            }}
            onBlur={handleSaveName}
            autoFocus
            className="flex-1 text-sm font-semibold text-slate-800 bg-transparent border-b border-violet-400 outline-none"
          />
        ) : (
          <span className="flex-1 text-sm font-semibold text-slate-800">
            {name}
          </span>
        )}
        <button
          onClick={() => {
            setEditName(name);
            setIsEditing(true);
          }}
          className="flex items-center gap-1 text-[12px] text-black hover:text-slate-700"
        >
          <Pencil size={11} /> Edit
        </button>
      </div>

      {/* ── Contact Info ────────────────────────────────────────────────── */}
      <div className="px-4 py-4 rounded-md">
        {detailRows.map((row) => (
          <div key={row.label} className="flex py-2">
            <div className="flex items-center gap-2 w-28 shrink-0">
              <span className="text-slate-700">{row.icon}</span>
              <span className="text-xs text-black">{row.label}</span>
            </div>
            <div className="flex-1 min-w-0 text-xs text-black wrap-break-words">
              {row.value}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 border-b border-slate-100">
        <button className="flex items-center gap-1.5 text-[11px] text-black hover:text-slate-600">
          <Plus size={13} /> Add new attribute
        </button>
      </div>

      {/* ── Tags ────────────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold text-black">Tags</span>
          <button
            onClick={() => setShowAddTag(true)}
            className="text-black hover:text-slate-600"
          >
            <Plus size={13} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-1">
          {tags.map((t) => (
            <span
              key={t.id}
              className="group text-[11px] bg-transparent border border-gray-300 text-slate-600 px-4 py-0.5 rounded-lg font-medium inline-flex items-center gap-1"
            >
              {t.label}
              <button
                onClick={() => removeTag(t.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
              >
                <X size={9} />
              </button>
            </span>
          ))}
        </div>
        {tags.length === 0 && !showAddTag && (
          <p className="text-[10px] text-slate-600">No tags Added</p>
        )}
        {showAddTag && (
          <div className="flex items-center gap-1.5 mt-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTag();
                if (e.key === "Escape") setShowAddTag(false);
              }}
              placeholder="Tag name..."
              autoFocus
              className="flex-1 text-[11px] text-slate-700 placeholder-slate-400 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-400"
            />
            <button
              onClick={handleAddTag}
              disabled={!tagInput.trim() || isAddingTag}
              className="p-1.5 rounded-md bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50"
            >
              {isAddingTag ? (
                <Loader2 size={10} className="animate-spin" />
              ) : (
                <Plus size={10} />
              )}
            </button>
            <button
              onClick={() => {
                setShowAddTag(false);
                setTagInput("");
              }}
              className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100"
            >
              <X size={10} />
            </button>
          </div>
        )}
      </div>

      {/* ── Custom User Fields ──────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-semibold text-black">
            Custom User Fields
          </span>
          <button
            onClick={() => setShowAddField(true)}
            className="text-black hover:text-slate-600"
          >
            <Plus size={13} />
          </button>
        </div>
        {customFields.length > 0 ? (
          <div className="flex flex-col gap-2 mb-1">
            {customFields.map((f) => (
              <div
                key={f.id}
                className="group flex items-center justify-between"
              >
                <div>
                  <p className="text-[10px] text-slate-400">{f.key}</p>
                  <p className="text-[11px] text-black font-medium">
                    {f.value}
                  </p>
                </div>
                <button
                  onClick={() => removeField(f.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          !showAddField && (
            <p className="text-[10px] text-slate-600">No custom field added</p>
          )
        )}
        {showAddField && (
          <div className="flex flex-col gap-1.5 mt-2">
            <input
              value={fieldKey}
              onChange={(e) => setFieldKey(e.target.value)}
              placeholder="Field name"
              autoFocus
              className="text-[11px] text-slate-700 placeholder-slate-400 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-400"
            />
            <input
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddField();
                if (e.key === "Escape") setShowAddField(false);
              }}
              placeholder="Value"
              className="text-[11px] text-slate-700 placeholder-slate-400 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-400"
            />
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAddField}
                disabled={
                  !fieldKey.trim() || !fieldValue.trim() || isAddingField
                }
                className="flex-1 text-[10px] font-medium py-1.5 rounded-md bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50"
              >
                {isAddingField ? "Saving..." : "Add Field"}
              </button>
              <button
                onClick={() => {
                  setShowAddField(false);
                  setFieldKey("");
                  setFieldValue("");
                }}
                className="flex-1 text-[10px] font-medium py-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Notes ───────────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-slate-100">
        <span className="text-[13px] font-semibold text-black block mb-2">
          Notes
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAddNote();
            }
          }}
          placeholder="Write a note..."
          rows={3}
          className="w-full text-[11px] text-slate-700 placeholder-slate-400 focus:outline-none resize-none bg-gray-100 p-2 rounded-lg"
        />
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <button className="text-slate-500">
              <Paperclip size={13} />
            </button>
            <button className="text-slate-500">
              <SmilePlus size={13} />
            </button>
          </div>
          <button
            onClick={handleAddNote}
            disabled={!note.trim() || isAddingNote}
            className="text-[10px] font-medium text-violet-600 hover:text-violet-700 disabled:opacity-50"
          >
            {isAddingNote ? "Saving..." : "Save"}
          </button>
        </div>

        {notes.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {notes.map((n) => (
              <div
                key={n.id}
                className="group bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {n.content}
                  </p>
                  <button
                    onClick={() => removeNote(n.id)}
                    className="opacity-0 group-hover:opacity-100 shrink-0 p-0.5 text-slate-400 hover:text-red-500 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
                <p className="text-[9px] text-slate-400 mt-1">
                  {n.authorName ?? "Unknown"} ·{" "}
                  {new Date(n.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Client Journey ──────────────────────────────────────────────── */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-semibold text-black">
            Client Journey
          </span>
          <button className="text-black hover:text-slate-600">
            <Plus size={13} />
          </button>
        </div>
        {journey.length > 0 ? (
          <div className="flex flex-col items-center">
            {journey.map((event, i) => (
              <div key={event.id} className="flex flex-col items-center">
                {/* Icon */}
                {i === 0 ? (
                  <div className="w-6 h-6 rounded-full bg-violet-100 border-2 border-violet-500 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-violet-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-gray-400" />
                  </div>
                )}

                {/* Text */}
                <p className="text-[10px] font-semibold text-slate-700 mt-1.5 text-center">
                  {event.body}
                </p>
                <p className="text-[10px] text-slate-500 text-center">
                  {new Date(event.sentAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>

                {/* Line + badge */}
                {i < journey.length - 1 && (
                  <div className="flex flex-col items-center my-1">
                    <div className="w-px h-4 bg-gray-300" />
                    {i === 0 && (
                      <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-3 py-0.5 rounded-md my-1">
                        Completed
                      </span>
                    )}
                    <div className="w-px h-4 bg-gray-300" />
                  </div>
                )}

                {/* Last item trailing line */}
                {i === journey.length - 1 && (
                  <div className="w-px h-6 bg-gray-300 mt-1" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
              <Circle size={14} className="text-gray-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              No journey events yet
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
