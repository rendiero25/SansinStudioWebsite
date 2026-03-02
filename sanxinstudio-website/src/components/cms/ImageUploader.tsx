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
    <div className="cms-field">
      <label className="cms-label">{label}</label>
      {value?.url ? (
        <div className="cms-image-preview">
          <img src={value.url} alt={label} />
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
          className={`cms-upload-zone ${dragActive ? "active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="cms-upload-loading">
              <div className="cms-spinner" />
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <span className="cms-upload-icon">📁</span>
              <span className="cms-upload-text">
                Drag & drop image here or click to browse
              </span>
              <span className="cms-upload-hint">
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
