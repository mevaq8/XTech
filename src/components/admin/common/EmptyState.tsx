import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export default function EmptyState({
  text,
  action,
  icon: Icon = Inbox,
}: {
  text: string;
  action?: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <Icon className="mx-auto mb-3 h-8 w-8 text-slate-400" />
      <p className="text-sm text-slate-600">{text}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
