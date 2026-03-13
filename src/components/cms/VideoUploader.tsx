import { useState, useRef } from "react";
import { uploadFile, deleteFile } from "../../services/sectionApi";

interface VideoUploaderProps {
  label?: string;
  value?: { url: string; publicId: string } | null;
  onChange: (value: { url: string; publicId: string } | null) => void;
  folder?: string;
}

const VideoUploader = ({
  label = "Video",
  value,
  onChange,
  folder,
}: VideoUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("video/")) return;
    setUploading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90));
    }, 500);

    try {
      const result = await uploadFile(file, folder || "sanxinstudio/videos");
      onChange({ url: result.url, publicId: result.publicId });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 300);
    }
  };

  const handleDelete = async () => {
    if (value?.publicId) {
      try {
        await deleteFile(value.publicId, "video");
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-semibold text-white/70 uppercase tracking-wider">
        {label}
      </label>
      {value?.url ? (
        <div className="rounded-[14px] overflow-hidden border border-white/[0.08] w-fit max-w-[320px]">
          <video
            src={value.url}
            controls
            className="w-full max-h-[160px] block bg-black"
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
          className="flex flex-col items-center justify-center gap-2 py-10 px-5 border-2 border-dashed border-white/10 rounded-[14px] bg-white/[0.02] cursor-pointer transition-all duration-200 hover:border-indigo-500/40 hover:bg-indigo-500/[0.04]"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3 text-white/60 text-[13px]">
              <div className="w-[200px] h-1.5 bg-white/10 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-sm transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>Uploading... {progress}%</span>
            </div>
          ) : (
            <>
              <span className="text-[32px]">🎬</span>
              <span className="text-sm text-white/60">Click to upload video</span>
              <span className="text-xs text-white/30">MP4, WebM (max 50MB)</span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
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

export default VideoUploader;
