import { useMemo, useState } from "react";
import CubePlaceholder from "@/components/shared/CubePlaceholder";

const PLACEHOLDER = "https://via.placeholder.com/800x600?text=No+Image";

export default function ProductGallery({ images, name }: { images: string[]; name?: string }) {
  const normalized = useMemo(() => (images.length ? images : [PLACEHOLDER]), [images]);
  const [selected, setSelected] = useState(0);
  const currentImage = normalized[selected] ?? PLACEHOLDER;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-center aspect-square md:min-h-[420px]">
        {currentImage ? (
          <img
            src={currentImage}
            alt={name ?? "Məhsul"}
            className="h-full w-full max-h-[520px] rounded-xl object-contain"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
            }}
          />
        ) : (
        <div className="w-3/5 max-w-[280px]">
          <CubePlaceholder />
        </div>
        )}
      </div>
      {normalized.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {normalized.map((item, idx) => (
            <button
              key={item + idx}
              type="button"
              onClick={() => setSelected(idx)}
              className={`h-14 w-14 overflow-hidden rounded-lg border ${idx === selected ? "border-slate-900" : "border-slate-200"}`}
            >
              <img
                src={item}
                alt={`${name ?? "Məhsul"} ${idx + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER;
                }}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
