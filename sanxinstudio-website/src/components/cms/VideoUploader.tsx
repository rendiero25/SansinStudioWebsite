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

    // Simulate progress since Cloudinary doesn't stream progress via server
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
    <div className="cms-field">
      <label className="cms-label">{label}</label>
      {value?.url ? (
        <div className="cms-video-preview">
          <video src={value.url} controls />
          <div className="cms-image-actions">
            <button
              type="button"
              className="cms-btn cms-btn-sm cms-btn-outline"
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </button>
            <button
              type="button"
              className="cms-btn cms-btn-sm cms-btn-danger"
              onClick={handleDelete}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className="cms-upload-zone"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="cms-upload-loading">
              <div className="cms-progress-bar">
                <div
                  className="cms-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>Uploading... {progress}%</span>
            </div>
          ) : (
            <>
              <span className="cms-upload-icon">🎬</span>
              <span className="cms-upload-text">Click to upload video</span>
              <span className="cms-upload-hint">MP4, WebM (max 50MB)</span>
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
