export function SkeletonCard() {
  return <div className="h-28 rounded-2xl bg-slate-200 animate-pulse" />;
}

export function SkeletonImage({ className = "h-10 w-10" }: { className?: string }) {
  return <div className={`${className} rounded-md bg-slate-200 animate-pulse`} />;
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="grid grid-cols-6 gap-3">
            <div className="h-4 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 rounded bg-slate-200 animate-pulse col-span-2" />
            <div className="h-4 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 rounded bg-slate-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
