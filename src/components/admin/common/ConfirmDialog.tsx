import { motion, AnimatePresence } from "framer-motion";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
              <h3 className="font-sora text-lg text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{message}</p>
              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  onClick={onCancel}
                  type="button"
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Ləğv et
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  type="button"
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                >
                  Bəli, sil
                </button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
