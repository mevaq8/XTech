import CubePlaceholder from "@/components/shared/CubePlaceholder";

export default function ProductGallery({ image, name }: { image?: string | null; name?: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 md:p-12 flex items-center justify-center aspect-square md:aspect-auto md:min-h-[500px]">
      {image ? (
        <img src={image} alt={name ?? "Məhsul"} className="h-full w-full max-h-[520px] rounded-xl object-contain" />
      ) : (
        <div className="w-3/5 max-w-[280px]">
          <CubePlaceholder />
        </div>
      )}
    </div>
  );
}
