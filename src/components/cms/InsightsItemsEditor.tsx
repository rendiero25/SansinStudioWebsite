import { useState } from "react";
import ImageUploader from "./ImageUploader";
import type { InsightCategory } from "./InsightCategoriesEditor";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const generateId = () => Math.random().toString(36).substring(2, 10);

const INPUT_CLASS =
  "px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/[0.06]";

export interface InsightItem {
  id: string;
  title: string;
  date: string;
  categoryIds?: string[];
  image: { url: string; publicId: string } | null;
  description: string;
  keywords: string[];
}

interface InsightsItemsEditorProps {
  insights: InsightItem[];
  onChange: (insights: InsightItem[]) => void;
  availableCategories: InsightCategory[];
  availableKeywords?: string[];
}

const InsightsItemsEditor = ({
  insights = [],
  onChange,
  availableCategories = [],
  availableKeywords = [],
}: InsightsItemsEditorProps) => {
  const [editingInsightId, setEditingInsightId] = useState<string | null>(null);

  const getFormattedDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = String(hours).padStart(2, '0');
    
    return `${day}/${month}/${year} | ${strHours}.${minutes} ${ampm}`;
  };

  const handleAddInsight = () => {
    const newInsight: InsightItem = {
      id: generateId(),
      title: "",
      date: getFormattedDate(),
      categoryIds: [],
      image: null,
      description: "",
      keywords: [],
    };
    onChange([...insights, newInsight]);
    setEditingInsightId(newInsight.id);
  };

  const handleUpdateInsight = (
    id: string,
    key: keyof InsightItem,
    value: unknown,
  ) => {
    onChange(insights.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
  };

  const handleDeleteInsight = (id: string) => {
    onChange(insights.filter((p) => p.id !== id));
    if (editingInsightId === id) setEditingInsightId(null);
  };

  const handleMoveInsight = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === insights.length - 1) return;
    const newInsights = [...insights];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    [newInsights[index], newInsights[swapIdx]] = [newInsights[swapIdx], newInsights[index]];
    onChange(newInsights);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[13px] font-semibold text-white/70 uppercase tracking-wider">
          Insight Posts ({insights.length})
        </label>
        <button
          type="button"
          className="px-6 py-2 text-[15px] border-none rounded-[10px] font-semibold font-[IBM_Plex_Sans,sans-serif] cursor-pointer inline-flex items-center gap-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-[0_2px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)]"
          onClick={handleAddInsight}
        >
          + Add Post
        </button>
      </div>

      {insights.length === 0 ? (
        <div className="py-8 text-center text-white/30 text-sm border border-dashed border-white/[0.08] rounded-xl">
          No insight posts added yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {insights.map((insight, index) => (
            <div
              key={insight.id}
              className={`bg-white/[0.03] border rounded-xl overflow-hidden transition-colors duration-200 ${
                editingInsightId === insight.id
                  ? "border-indigo-500/30"
                  : "border-white/[0.06]"
              }`}
            >
              <div className="flex items-center gap-3 py-3.5 px-4">
                <span className="text-xs text-white/25 font-semibold min-w-7">
                  #{index + 1}
                </span>
                <span className="flex-1 text-sm text-white/80 font-medium truncate pr-4">
                  {insight.title || "Untitled Post"}
                </span>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
                    onClick={() => handleMoveInsight(index, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
                    onClick={() => handleMoveInsight(index, "down")}
                    disabled={index === insights.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-white/[0.08] hover:text-white"
                    onClick={() =>
                      setEditingInsightId(
                        editingInsightId === insight.id ? null : insight.id,
                      )
                    }
                  >
                    ✏️
                  </button>
                  <button
                     type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-red-500/15 hover:text-red-500"
                    onClick={() => handleDeleteInsight(insight.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {editingInsightId === insight.id && (
                <div className="px-4 pb-4 flex flex-col gap-6 border-t border-white/[0.04] pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50">
                        Post Title
                      </label>
                      <input
                        type="text"
                        className={INPUT_CLASS}
                        value={insight.title}
                        onChange={(e) =>
                          handleUpdateInsight(
                            insight.id,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. 10 Best UI Practices"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50 flex justify-between items-center">
                        <span>Date & Time</span>
                        <button 
                          onClick={() => handleUpdateInsight(insight.id, "date", getFormattedDate())} 
                          className="text-indigo-400 hover:text-indigo-300 text-[10px]"
                        >
                          Reset to Current
                        </button>
                      </label>
                      <input
                        type="text"
                        className={INPUT_CLASS}
                        value={insight.date}
                        onChange={(e) =>
                          handleUpdateInsight(
                            insight.id,
                            "date",
                            e.target.value,
                          )
                        }
                        placeholder="dd/mm/yyyy | 00.00 am"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-white/50">
                      Categories{" "}
                      <span className="text-[10px] text-white/30 ml-1">
                        (Pulled from Section 1)
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map((cat) => {
                        const isSelected = (insight.categoryIds || []).includes(cat.id);

                        return (
                          <label
                            key={cat.id}
                            className={`cursor-pointer px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-2 ${
                              isSelected
                                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                                : "bg-white/[0.04] border-white/10 text-white/60 hover:bg-white/[0.08]"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isSelected}
                              onChange={(e) => {
                                const currentIds = insight.categoryIds || [];
                                let newIds;
                                if (e.target.checked) {
                                  newIds = [...new Set([...currentIds, cat.id])];
                                } else {
                                  newIds = currentIds.filter((id) => id !== cat.id);
                                }
                                handleUpdateInsight(insight.id, "categoryIds", newIds);
                              }}
                            />
                            {cat.categoryName}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <hr className="border-white/[0.06] w-full" />

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-xs font-medium text-white/50 flex justify-between items-center">
                         <span>Post Keywords</span>
                         <span className="text-[10px] text-white/30">
                           (Add custom or pick from Section 1 below)
                         </span>
                       </label>
                       
                       {availableKeywords.length > 0 ? (
                         <div className="flex flex-wrap gap-1.5 mb-2">
                           {availableKeywords.map((kw) => {
                             const isSelected = (insight.keywords || []).includes(kw);
                             return (
                               <button
                                 key={kw}
                                 type="button"
                                 onClick={() => {
                                   const current = insight.keywords || [];
                                   let newKeywords;
                                   if (isSelected) {
                                     newKeywords = current.filter(k => k !== kw);
                                   } else {
                                     newKeywords = [...current, kw];
                                   }
                                   handleUpdateInsight(insight.id, "keywords", newKeywords);
                                 }}
                                 className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                                   isSelected
                                     ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                                     : "bg-white/[0.04] border-white/10 text-white/40 hover:bg-white/[0.08]"
                                 }`}
                               >
                                 {kw}
                               </button>
                             );
                           })}
                         </div>
                       ) : (
                         <p className="text-[11px] text-white/20 italic">
                           No global keywords defined in Section 1.
                         </p>
                       )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50">
                        Post Thumbnail/Image
                      </label>
                      <ImageUploader
                        label=""
                        value={insight.image}
                        onChange={(val) =>
                          handleUpdateInsight(insight.id, "image", val)
                        }
                        folder="sanxinstudio/insights"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50">
                        Content / Description
                      </label>
                      <div className="bg-white text-black rounded-lg overflow-hidden">
                        <ReactQuill
                          theme="snow"
                          value={insight.description}
                          onChange={(content: string) =>
                            handleUpdateInsight(
                              insight.id,
                              "description",
                              content,
                            )
                          }
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, 3, false] }],
                              ["bold", "italic", "underline", "strike", "blockquote"],
                              [{ list: "ordered" }, { list: "bullet" }],
                              ["link"],
                              ["clean"],
                            ],
                          }}
                          placeholder="Write your insight content here..."
                          className="min-h-[250px]"
                        />
                      </div>
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

export default InsightsItemsEditor;
