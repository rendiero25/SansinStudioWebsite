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
      <div className="cms-section-loading">
        <div className="cms-spinner" />
        <span>Loading {title}...</span>
      </div>
    );
  }

  return (
    <div className="cms-section">
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">{title}</h2>
          <p className="cms-section-subtitle">
            Page: Home • Section: {sectionKey}
          </p>
        </div>
        <div className="cms-section-header-actions">
          {saved && <span className="cms-saved-badge">✓ Saved</span>}
          {error && <span className="cms-error-badge">{error}</span>}
          <button
            className="cms-btn cms-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="cms-section-body">
        {children({ content, updateContent, setContent })}
      </div>
    </div>
  );
};

export default SectionWrapper;
