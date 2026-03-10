import { useState, useRef } from "react";
import { uploadFile, deleteFile } from "../../services/sectionApi";

interface ImageUploaderProps {
  label?: string;
  value?: { url: string; publicId: string } | null;
  onChange: (value: { url: string; publicId: string } | null) => void;
  folder?: string;
}

const ImageUploader = ({
  label = "Image",
  value,
  onChange,
  folder,
}: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const result = await uploadFile(file, folder || "sanxinstudio/images");
      onChange({ url: result.url, publicId: result.publicId });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (value?.publicId) {
      try {
        await deleteFile(value.publicId, "image");
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
    onChange(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-semibold text-white/70 uppercase tracking-wider">
        {label}
      </label>
      {value?.url ? (
        <div className="relative rounded-[14px] overflow-hidden border border-white/[0.08]">
          <img
            src={value.url}
            alt={label}
            className="w-full max-h-[300px] object-cover block"
          />
          <div className="flex gap-2 p-3 bg-black/60">
            <button
              type="button"
              className="py-[7px] px-3.5 text-xs border-none rounded-[10px] font-semibold font-[IBM_Plex_Sans,sans-serif] cursor-pointer transition-all duration-150 inline-flex items-center gap-1.5 whitespace-nowrap bg-white/[0.06] text-white/80 border border-white/12 hover:bg-white/10"
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </button>
            <button
              type="button"
              className="py-[7px] px-3.5 text-xs border-none rounded-[10px] font-semibold font-[IBM_Plex_Sans,sans-serif] cursor-pointer transition-all duration-150 inline-flex items-center gap-1.5 whitespace-nowrap bg-red-500/12 text-red-500 border border-red-500/20 hover:bg-red-500/20"
              onClick={handleDelete}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center gap-2 py-10 px-5 border-2 border-dashed rounded-[14px] cursor-pointer transition-all duration-200 ${
            dragActive
              ? "border-indigo-500/40 bg-indigo-500/[0.04]"
              : "border-white/10 bg-white/[0.02] hover:border-indigo-500/40 hover:bg-indigo-500/[0.04]"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3 text-white/60 text-[13px]">
              <div className="w-7 h-7 border-3 border-white/10 border-t-purple-400 rounded-full animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <span className="text-[32px]">📁</span>
              <span className="text-sm text-white/60">
                Drag & drop image here or click to browse
              </span>
              <span className="text-xs text-white/30">
                JPG, PNG, WebP, SVG (max 10MB)
              </span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default ImageUploader;
