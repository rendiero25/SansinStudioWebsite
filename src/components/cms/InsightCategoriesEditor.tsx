import { useState } from "react";

const generateId = () => Math.random().toString(36).substring(2, 10);

const INPUT_CLASS =
  "px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/[0.06]";

export interface InsightCategory {
  id: string;
  categoryName: string;
}

interface InsightCategoriesEditorProps {
  categories: InsightCategory[];
  onChange: (categories: InsightCategory[]) => void;
}

const InsightCategoriesEditor = ({
  categories = [],
  onChange,
}: InsightCategoriesEditorProps) => {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );

  const handleAddCategory = () => {
    const newCategory: InsightCategory = {
      id: generateId(),
      categoryName: "",
    };
    onChange([...categories, newCategory]);
    setEditingCategoryId(newCategory.id);
  };

  const handleUpdateCategory = (
    id: string,
    key: keyof InsightCategory,
    value: unknown,
  ) => {
    onChange(categories.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  };

  const handleDeleteCategory = (id: string) => {
    onChange(categories.filter((c) => c.id !== id));
    if (editingCategoryId === id) setEditingCategoryId(null);
  };

  const handleMoveCategory = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === categories.length - 1) return;
    const newCats = [...categories];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    [newCats[index], newCats[swapIdx]] = [newCats[swapIdx], newCats[index]];
    onChange(newCats);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[13px] font-semibold text-white/70 uppercase tracking-wider">
          Categories ({categories.length})
        </label>
        <button
          type="button"
          className="px-6 py-2 text-[15px] border-none rounded-[10px] font-semibold font-[IBM_Plex_Sans,sans-serif] cursor-pointer inline-flex items-center gap-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-[0_2px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)]"
          onClick={handleAddCategory}
        >
          + Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="py-8 text-center text-white/30 text-sm border border-dashed border-white/[0.08] rounded-xl">
          No categories added yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className={`bg-white/[0.03] border rounded-xl overflow-hidden transition-colors duration-200 ${
                editingCategoryId === cat.id
                  ? "border-indigo-500/30"
                  : "border-white/[0.06]"
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 py-3.5 px-4">
                <span className="text-xs text-white/25 font-semibold min-w-7">
                  #{index + 1}
                </span>
                <span className="flex-1 text-sm text-white/80 font-medium">
                  {cat.categoryName || "Untitled Category"}
                </span>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
                    onClick={() => handleMoveCategory(index, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
                    onClick={() => handleMoveCategory(index, "down")}
                    disabled={index === categories.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-white/[0.08] hover:text-white"
                    onClick={() =>
                      setEditingCategoryId(
                        editingCategoryId === cat.id ? null : cat.id,
                      )
                    }
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-red-500/15 hover:text-red-500"
                    onClick={() => handleDeleteCategory(cat.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Category Content */}
              {editingCategoryId === cat.id && (
                <div className="px-4 pb-4 flex flex-col gap-5 border-t border-white/[0.04] pt-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50">
                        Category Name
                      </label>
                      <input
                        type="text"
                        className={INPUT_CLASS}
                        value={cat.categoryName}
                        onChange={(e) =>
                          handleUpdateCategory(
                            cat.id,
                            "categoryName",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Technology"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightCategoriesEditor;
