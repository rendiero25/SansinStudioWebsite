interface ButtonEditorProps {
  label?: string;
  value: { text: string; link: string };
  onChange: (value: { text: string; link: string }) => void;
  className?: string;
}

const ButtonEditor = ({
  label = "Button",
  value,
  onChange,
  className,
}: ButtonEditorProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className || ""}`}>
      <label className="text-[13px] font-semibold text-white/70 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex gap-3">
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50">Text</label>
          <input
            type="text"
            className="px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/[0.06]"
            value={value?.text || ""}
            onChange={(e) => onChange({ ...value, text: e.target.value })}
            placeholder="Button text"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-white/50">Link</label>
          <input
            type="text"
            className="px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/[0.06]"
            value={value?.link || ""}
            onChange={(e) => onChange({ ...value, link: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  );
};

export default ButtonEditor;
