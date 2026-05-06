import CubePlaceholder from "@/components/shared/CubePlaceholder";

export default function ProductGallery() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 md:p-12 flex items-center justify-center aspect-square md:aspect-auto md:min-h-[500px]">
      <div className="w-3/5 max-w-[280px]">
        <CubePlaceholder />
      </div>
    </div>
  );
}
