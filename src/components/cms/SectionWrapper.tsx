import { useState, useEffect, useCallback, type ReactNode } from "react";
import { getSection, updateSection } from "../../services/sectionApi";

interface SectionWrapperProps {
  page: string;
  sectionKey: string;
  title: string;
  children: (props: {
    content: Record<string, unknown>;
    updateContent: (key: string, value: unknown) => void;
    setContent: (content: Record<string, unknown>) => void;
  }) => ReactNode;
}

const SectionWrapper = ({
  page,
  sectionKey,
  title,
  children,
}: SectionWrapperProps) => {
  const [content, setContentState] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const fetchContent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSection(page, sectionKey);
      setContentState(data.content || {});
    } catch (err) {
      console.error("Failed to load section:", err);
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [page, sectionKey]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateContent = (key: string, value: unknown) => {
    setContentState((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const setContent = (newContent: Record<string, unknown>) => {
    setContentState(newContent);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateSection(page, sectionKey, content);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-5 gap-4 text-white/50 text-sm">
        <div className="w-7 h-7 border-3 border-white/10 border-t-purple-400 rounded-full animate-spin" />
        <span>Loading {title}...</span>
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <div className="flex justify-between items-start gap-4 mb-8 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold text-white m-0 mb-1 tracking-tight">{title}</h2>
          <p className="text-[13px] text-white/35 m-0">
            Page: Home • Section: {sectionKey}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {saved && (
            <span className="py-1.5 px-3.5 bg-green-500/12 border border-green-500/25 rounded-lg text-green-500 text-[13px] font-medium animate-[fadeIn_0.2s_ease]">
              ✓ Saved
            </span>
          )}
          {error && (
            <span className="py-1.5 px-3.5 bg-red-500/12 border border-red-500/25 rounded-lg text-red-500 text-[13px] font-medium">
              {error}
            </span>
          )}
          <button
            className="px-6 py-2 border-none rounded-[10px] text-[15px] font-semibold font-[IBM_Plex_Sans,sans-serif] cursor-pointer transition-all duration-150 inline-flex items-center gap-1.5 whitespace-nowrap bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-[0_2px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {children({ content, updateContent, setContent })}
      </div>
    </div>
  );
};

export default SectionWrapper;
