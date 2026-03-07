import { useState } from "react";

const INPUT_CLASS =
  "px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/[0.06]";

interface KeywordsEditorProps {
  label: string;
  keywords: string[];
  onChange: (keywords: string[]) => void;
  placeholder?: string;
}

const KeywordsEditor = ({
  label,
  keywords = [],
  onChange,
  placeholder = "Add a keyword...",
}: KeywordsEditorProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      onChange([...keywords, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (keywordToRemove: string) => {
    onChange(keywords.filter((kw) => kw !== keywordToRemove));
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          className={INPUT_CLASS}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="shrink-0 px-4 py-3 bg-white/10 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 rounded-[10px] text-white text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          Add Keyword
        </button>
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {keywords.map((kw, index) => (
            <div
              key={`${kw}-${index}`}
              className="group flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/80 transition-colors hover:bg-white/10 hover:border-white/20"
            >
              <span>{kw}</span>
              <button
                type="button"
                onClick={() => handleRemove(kw)}
                className="w-4 h-4 flex items-center justify-center rounded-full bg-white/10 text-white/40 hover:bg-red-500/80 hover:text-white transition-colors cursor-pointer"
                aria-label={`Remove ${kw}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordsEditor;
