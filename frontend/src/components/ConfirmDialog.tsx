interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-[60] p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg mb-2">{title}</h3>
        <p className="text-sm text-ink-soft mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-urgent text-white rounded-lg py-2.5 font-semibold text-sm hover:bg-urgent/90 transition-colors"
          >
            {confirmLabel}
          </button>
          <button onClick={onCancel} className="px-4 text-sm text-ink-soft hover:text-ink transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}