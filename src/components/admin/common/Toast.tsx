import { useEffect } from "react";

export type ToastVariant = "success" | "error";

export default function Toast({
  message,
  variant = "success",
  onClose,
  durationMs = 2600,
}: {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
  durationMs?: number;
}) {
  useEffect(() => {
    const t = window.setTimeout(() => onClose?.(), durationMs);
    return () => window.clearTimeout(t);
  }, [durationMs, onClose]);

  return (
    <div
      role="status"
      className={[
        "fixed right-4 top-4 z-50 rounded-2xl px-4 py-3 shadow-lg border text-sm",
        variant === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800",
      ].join(" ")}
    >
      {message}
    </div>
  );
}

