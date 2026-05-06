import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import { SkeletonImage } from "@/components/admin/common/Skeleton";

interface UploadItem {
  file?: File;
  url: string;
}

export default function ImageUploader({
  label,
  multiple = false,
  items,
  onChange,
  required = false,
}: {
  label: string;
  multiple?: boolean;
  items: UploadItem[];
  onChange: (next: UploadItem[]) => void;
  required?: boolean;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const mapped = acceptedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      if (multiple) {
        onChange([...items, ...mapped]);
      } else {
        onChange(mapped.slice(0, 1));
      }
    },
    [items, multiple, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: { "image/*": [] },
  });

  return (
    <div>
      <label className="mb-1.5 block text-sm text-slate-700">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      <div
        {...getRootProps()}
        className={`rounded-2xl border border-dashed p-4 text-center cursor-pointer ${
          isDragActive ? "border-slate-500 bg-slate-100" : "border-slate-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-2 h-5 w-5 text-slate-500" />
        <p className="text-sm text-slate-600">Şəkli sürükləyib buraxın və ya seçin</p>
      </div>
      <div className={`mt-3 grid gap-2 ${multiple ? "grid-cols-3 sm:grid-cols-5" : "grid-cols-1"}`}>
        {items.map((item, index) => (
          <div key={item.url + index} className="relative">
            {!item.url ? <SkeletonImage className="h-24 w-full" /> : null}
            <img src={item.url} alt="Ön baxış" className="h-24 w-full rounded-lg object-cover border border-slate-200" />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { UploadItem };
