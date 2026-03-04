import { useState } from "react";
import ImageUploader from "./ImageUploader";

const generateId = () => Math.random().toString(36).substring(2, 10);

const INPUT_CLASS =
  "px-4 py-3 bg-white/4 border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/6";

const TEXTAREA_CLASS = `${INPUT_CLASS} resize-y min-h-[80px] leading-relaxed`;

export interface ProcessDetail {
  id: string;
  detailTitle: string;
  detailDesc: string;
  detailIcon: { url: string; publicId: string } | null;
  detailKeywords: string;
}

export interface Process {
  id: string;
  processTitle: string;
  details: ProcessDetail[];
}

interface WorksProcessEditorProps {
  processes: Process[];
  onChange: (processes: Process[]) => void;
}

const WorksProcessEditor = ({
  processes = [],
  onChange,
}: WorksProcessEditorProps) => {
  const [editingProcessId, setEditingProcessId] = useState<string | null>(null);

  const handleAddProcess = () => {
    const newProcess: Process = {
      id: generateId(),
      processTitle: "",
      details: [],
    };
    onChange([...processes, newProcess]);
    setEditingProcessId(newProcess.id);
  };

  const handleUpdateProcess = (
    id: string,
    key: keyof Process,
    value: unknown,
  ) => {
    onChange(processes.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
  };

  const handleDeleteProcess = (id: string) => {
    onChange(processes.filter((p) => p.id !== id));
    if (editingProcessId === id) setEditingProcessId(null);
  };

  const handleMoveProcess = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === processes.length - 1) return;
    const newProcs = [...processes];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    [newProcs[index], newProcs[swapIdx]] = [newProcs[swapIdx], newProcs[index]];
    onChange(newProcs);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[13px] font-semibold text-white/70 uppercase tracking-wider">
          Processes ({processes.length})
        </label>
        <button
          type="button"
          className="py-[7px] px-3.5 text-xs border-none rounded-[10px] font-semibold font-[IBM_Plex_Sans,sans-serif] cursor-pointer inline-flex items-center gap-1.5 bg-linear-to-br from-indigo-500 to-purple-500 text-white shadow-[0_2px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)]"
          onClick={handleAddProcess}
        >
          + Add Process
        </button>
      </div>

      {processes.length === 0 ? (
        <div className="py-8 text-center text-white/30 text-sm border border-dashed border-white/8 rounded-xl">
          No processes added yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {processes.map((proc, index) => (
            <div
              key={proc.id}
              className={`bg-white/[0.03] border rounded-xl overflow-hidden transition-colors duration-200 ${
                editingProcessId === proc.id
                  ? "border-indigo-500/30"
                  : "border-white/[0.06]"
              }`}
            >
              {/* Process Header */}
              <div className="flex items-center gap-3 py-3.5 px-4">
                <span className="text-xs text-white/25 font-semibold min-w-7">
                  #{index + 1}
                </span>
                <span className="flex-1 text-sm text-white/80 font-medium">
                  {proc.processTitle || "Untitled Process"}
                </span>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
                    onClick={() => handleMoveProcess(index, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
                    onClick={() => handleMoveProcess(index, "down")}
                    disabled={index === processes.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-white/[0.08] hover:text-white"
                    onClick={() =>
                      setEditingProcessId(
                        editingProcessId === proc.id ? null : proc.id,
                      )
                    }
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-red-500/15 hover:text-red-500"
                    onClick={() => handleDeleteProcess(proc.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Process Details Content */}
              {editingProcessId === proc.id && (
                <div className="px-4 pb-4 flex flex-col gap-5 border-t border-white/[0.04] pt-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-white/50">
                      Process Title
                    </label>
                    <input
                      type="text"
                      className={INPUT_CLASS}
                      value={proc.processTitle}
                      onChange={(e) =>
                        handleUpdateProcess(
                          proc.id,
                          "processTitle",
                          e.target.value,
                        )
                      }
                      placeholder="e.g. Phase 1: Discovery"
                    />
                  </div>

                  {/* Sub-Details Section */}
                  <div className="mt-2 pt-4 border-t border-white/6">
                    <h4 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="text-indigo-400">❖</span> Process Details
                    </h4>
                    <ProcessDetailsEditor
                      details={proc.details || []}
                      onChange={(newDetails) =>
                        handleUpdateProcess(proc.id, "details", newDetails)
                      }
                    />
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

// --- Process Details Editor ---
const ProcessDetailsEditor = ({
  details,
  onChange,
}: {
  details: ProcessDetail[];
  onChange: (d: ProcessDetail[]) => void;
}) => {
  const handleAdd = () => {
    onChange([
      ...details,
      {
        id: generateId(),
        detailTitle: "",
        detailDesc: "",
        detailIcon: null,
        detailKeywords: "",
      },
    ]);
  };

  const handleUpdate = (
    id: string,
    key: keyof ProcessDetail,
    value: unknown,
  ) => {
    onChange(details.map((d) => (d.id === id ? { ...d, [key]: value } : d)));
  };

  const handleDelete = (id: string) => {
    onChange(details.filter((d) => d.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      {details.map((detail, idx) => (
        <div
          key={detail.id}
          className="bg-[#1a1a24] rounded-lg border border-white/10 p-4"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-[13px] text-white/80">
              Detail {idx + 1}
            </span>
            <button
              type="button"
              className="text-red-400 hover:text-red-500 text-xs cursor-pointer bg-transparent border-none"
              onClick={() => handleDelete(detail.id)}
            >
              Delete
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50">
                Detail Title
              </label>
              <input
                type="text"
                className={INPUT_CLASS}
                placeholder="e.g. Initial Research"
                value={detail.detailTitle}
                onChange={(e) =>
                  handleUpdate(detail.id, "detailTitle", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/50">
                Detail Icon
              </label>
              <ImageUploader
                label=""
                value={detail.detailIcon}
                onChange={(val) => handleUpdate(detail.id, "detailIcon", val)}
                folder="sanxinstudio/works/icons"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-xs font-medium text-white/50">
              Detail Description
            </label>
            <textarea
              className={`${TEXTAREA_CLASS} min-h-[50px]`}
              placeholder="Detail Description"
              value={detail.detailDesc}
              onChange={(e) =>
                handleUpdate(detail.id, "detailDesc", e.target.value)
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-white/50">
              Keywords (comma separated)
            </label>
            <input
              type="text"
              className={INPUT_CLASS}
              placeholder="e.g. Research, Study, Discovery"
              value={detail.detailKeywords}
              onChange={(e) =>
                handleUpdate(detail.id, "detailKeywords", e.target.value)
              }
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-sm border border-indigo-500/20 transition-colors cursor-pointer"
        onClick={handleAdd}
      >
        + Add Detail Item
      </button>
    </div>
  );
};

export default WorksProcessEditor;
