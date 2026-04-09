import { Loader2, TriangleAlert } from "lucide-react";

interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal = ({
  title,
  message,
  confirmLabel = "Confirm",
  isLoading = false,
  variant = "danger",
  onConfirm,
  onCancel,
}: Props) => {
  const iconBg = variant === "danger" ? "bg-red-100" : "bg-amber-100";
  const iconColor = variant === "danger" ? "text-red-600" : "text-amber-600";
  const btnClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-amber-500 hover:bg-amber-600 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex flex-col items-center text-center gap-3 mb-6">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}
          >
            <TriangleAlert size={22} className={iconColor} />
          </div>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="btn-outline flex-1 py-2.5 rounded-lg text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer ${btnClass}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
