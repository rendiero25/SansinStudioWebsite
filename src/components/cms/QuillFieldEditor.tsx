import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface QuillFieldEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const QuillFieldEditor = ({
  label,
  value,
  onChange,
  className = "",
  placeholder = "",
}: QuillFieldEditorProps) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
  ];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-[13px] font-semibold text-white/70 uppercase tracking-wider">
        {label}
      </label>
      <div className="quill-editor-container bg-white rounded-lg overflow-hidden">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="text-black"
        />
      </div>
      <style>{`
        .quill-editor-container .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }
        .quill-editor-container .ql-container {
          border: none;
          min-height: 120px;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 15px;
        }
        .quill-editor-container .ql-editor {
          min-height: 120px;
        }
      `}</style>
    </div>
  );
};

export default QuillFieldEditor;
