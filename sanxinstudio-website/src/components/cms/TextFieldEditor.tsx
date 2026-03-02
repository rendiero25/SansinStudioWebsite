interface TextFieldEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const TextFieldEditor = ({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
  rows = 3,
  className,
}: TextFieldEditorProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      <label className="text-[13px] font-semibold text-white/70 uppercase tracking-wider">
        {label}
      </label>
      {multiline ? (
        <textarea
          className="px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border resize-y min-h-[80px] leading-relaxed focus:border-indigo-500/50 focus:bg-white/[0.06]"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          className="px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/[0.06]"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default TextFieldEditor;
