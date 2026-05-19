import { X, Tag, FileText, SlidersHorizontal } from "lucide-react";
import type { WhatsappContact } from "../../../services/whatsapp.service";

interface Props {
  contact: WhatsappContact;
  onClose: () => void;
}

export const ContactDetailModal = ({ contact, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            {contact.profilePicture ? (
              <img
                src={contact.profilePicture}
                alt={contact.name ?? contact.phone}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 font-semibold text-sm flex items-center justify-center uppercase">
                {(contact.name ?? contact.phone).charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-slate-800">
                {contact.name ?? "Unknown"}
              </p>
              <p className="text-xs text-slate-500">{contact.phone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-5">
          {/* Tags */}
          <section>
            <div className="flex items-center gap-1.5 mb-2">
              <Tag size={13} className="text-violet-500" />
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Tags
              </p>
            </div>
            {contact.tags.length === 0 ? (
              <p className="text-xs text-slate-400">No tags</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {contact.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: tag.color ?? "#6b7280" }}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Custom Fields */}
          <section>
            <div className="flex items-center gap-1.5 mb-2">
              <SlidersHorizontal size={13} className="text-violet-500" />
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Custom Fields
              </p>
            </div>
            {contact.customFields.length === 0 ? (
              <p className="text-xs text-slate-400">No custom fields</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {contact.customFields.map((f) => (
                  <div key={f.id} className="bg-slate-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                      {f.key}
                    </p>
                    <p className="text-xs font-medium text-slate-700 mt-0.5 truncate">
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Notes */}
          <section>
            <div className="flex items-center gap-1.5 mb-2">
              <FileText size={13} className="text-violet-500" />
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Notes ({contact.notes.length})
              </p>
            </div>
            {contact.notes.length === 0 ? (
              <p className="text-xs text-slate-400">No notes</p>
            ) : (
              <div className="flex flex-col gap-2">
                {contact.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-slate-50 rounded-lg px-3 py-2.5"
                  >
                    <p className="text-xs text-slate-700">{note.content}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(note.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
