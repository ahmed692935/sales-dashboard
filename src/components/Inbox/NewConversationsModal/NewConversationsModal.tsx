import { useState } from "react";
import { useInitiateConversation } from "../../../hooks/useWhatsapp";
import { Loader2, X } from "lucide-react";

export const NewConversationModal = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (id: string) => void;
}) => {
  const { mutate: initiate, isPending } = useInitiateConversation();
  const [form, setForm] = useState({
    phone: "",
    name: "",
    body: "",
    templateName: "",
  });
  const [useTemplate, setUseTemplate] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone) return;
    if (useTemplate && !form.templateName) return;
    if (!useTemplate && !form.body) return;

    initiate(
      {
        phone: form.phone,
        body: form.body,
        name: form.name || undefined,
        templateName: useTemplate ? form.templateName : undefined,
      },
      {
        onSuccess: (data) => {
          onSuccess(data.conversation.id);
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-slate-800">
            New conversation
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Phone number <span className="text-red-400">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="923001234567"
                className="input text-sm"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Country code, no + or spaces
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Contact name{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input text-sm"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Auto-filled on first reply if left blank
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <input
              type="checkbox"
              id="useTemplate"
              checked={useTemplate}
              onChange={(e) => setUseTemplate(e.target.checked)}
              className="rounded border-slate-300 cursor-pointer"
            />
            <label
              htmlFor="useTemplate"
              className="text-xs text-amber-700 cursor-pointer"
            >
              Use template message (required for new contacts)
            </label>
          </div>

          {useTemplate ? (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Template name
              </label>
              <input
                name="templateName"
                value={form.templateName}
                onChange={handleChange}
                placeholder="e.g. hello_world"
                className="input text-sm"
                required={useTemplate}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Must match an approved template in your WhatsApp Manager
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Message
              </label>
              <textarea
                name="body"
                value={form.body}
                onChange={handleChange as any}
                placeholder="Type your message..."
                rows={3}
                className="input text-sm resize-none"
                required={!useTemplate}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Free-form only works if the contact messaged you in the last
                24hrs
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1 py-2.5 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary flex-1 py-2.5 rounded-lg text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Sending...
                </>
              ) : (
                "Send message"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
