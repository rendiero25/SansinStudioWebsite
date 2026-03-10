import { useState } from "react";
import ImageUploader from "./ImageUploader";
import type { ProjectCategory } from "./ProjectCategoriesEditor";

const generateId = () => Math.random().toString(36).substring(2, 10);

const INPUT_CLASS =
  "px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/[0.06]";

const TEXTAREA_CLASS = `${INPUT_CLASS} resize-y min-h-[80px] leading-relaxed`;

export interface ProjectItem {
  id: string;
  projectName: string;
  categoryIds?: string[]; // Made optional for backward compatibility map check
  categoryId?: string; // Legacy string reference
  keywords: string;

  // Section below
  thumbnail: { url: string; publicId: string } | null;
  mainImage: { url: string; publicId: string } | null;
  description: string;
  image2: { url: string; publicId: string } | null;
  buttonText: string;
  buttonLink: string;
}

interface ProjectItemsEditorProps {
  projects: ProjectItem[];
  onChange: (projects: ProjectItem[]) => void;
  availableCategories: ProjectCategory[]; // Passed dynamically from Section 1 Content
}

const ProjectItemsEditor = ({
  projects = [],
  onChange,
  availableCategories = [],
}: ProjectItemsEditorProps) => {
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const handleAddProject = () => {
    const newProject: ProjectItem = {
      id: generateId(),
      projectName: "",
      categoryIds: [],
      keywords: "",
      thumbnail: null,
      mainImage: null,
      description: "",
      image2: null,
      buttonText: "",
      buttonLink: "",
    };
    onChange([...projects, newProject]);
    setEditingProjectId(newProject.id);
  };

  const handleUpdateProject = (
    id: string,
    key: keyof ProjectItem,
    value: unknown,
  ) => {
    onChange(projects.map((p) => (p.id === id ? { ...p, [key]: value } : p)));
  };

  const handleDeleteProject = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
    if (editingProjectId === id) setEditingProjectId(null);
  };

  const handleMoveProject = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === projects.length - 1) return;
    const newProjs = [...projects];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    [newProjs[index], newProjs[swapIdx]] = [newProjs[swapIdx], newProjs[index]];
    onChange(newProjs);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[13px] font-semibold text-white/70 uppercase tracking-wider">
          Projects ({projects.length})
        </label>
        <button
          type="button"
          className="py-[7px] px-3.5 text-xs border-none rounded-[10px] font-semibold font-[IBM_Plex_Sans,sans-serif] cursor-pointer inline-flex items-center gap-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-[0_2px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)]"
          onClick={handleAddProject}
        >
          + Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="py-8 text-center text-white/30 text-sm border border-dashed border-white/[0.08] rounded-xl">
          No projects added yet.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((proj, index) => (
            <div
              key={proj.id}
              className={`bg-white/[0.03] border rounded-xl overflow-hidden transition-colors duration-200 ${
                editingProjectId === proj.id
                  ? "border-indigo-500/30"
                  : "border-white/[0.06]"
              }`}
            >
              <div className="flex items-center gap-3 py-3.5 px-4">
                <span className="text-xs text-white/25 font-semibold min-w-7">
                  #{index + 1}
                </span>
                <span className="flex-1 text-sm text-white/80 font-medium">
                  {proj.projectName || "Untitled Project"}
                </span>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
                    onClick={() => handleMoveProject(index, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
                    onClick={() => handleMoveProject(index, "down")}
                    disabled={index === projects.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-white/[0.08] hover:text-white"
                    onClick={() =>
                      setEditingProjectId(
                        editingProjectId === proj.id ? null : proj.id,
                      )
                    }
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg cursor-pointer text-sm text-white/60 hover:bg-red-500/15 hover:text-red-500"
                    onClick={() => handleDeleteProject(proj.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {editingProjectId === proj.id && (
                <div className="px-4 pb-4 flex flex-col gap-6 border-t border-white/[0.04] pt-4">
                  {/* Part 1: Basic Info */}
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-white/50">
                          Project Name
                        </label>
                        <input
                          type="text"
                          className={INPUT_CLASS}
                          value={proj.projectName}
                          onChange={(e) =>
                            handleUpdateProject(
                              proj.id,
                              "projectName",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Acme Website Redesign"
                        />
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
                            // Support legacy string categoryId as well for backward compatibility
                            const isSelected =
                              (proj.categoryIds || []).includes(cat.id) ||
                              proj.categoryId === cat.id;

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
                                    const currentIds =
                                      proj.categoryIds ||
                                      (proj.categoryId
                                        ? [proj.categoryId]
                                        : []);
                                    let newIds;
                                    if (e.target.checked) {
                                      newIds = [
                                        ...new Set([...currentIds, cat.id]),
                                      ];
                                    } else {
                                      newIds = currentIds.filter(
                                        (id) => id !== cat.id,
                                      );
                                    }

                                    // Update both fields simultaneously to avoid React state race conditions
                                    onChange(
                                      projects.map((p) =>
                                        p.id === proj.id
                                          ? {
                                              ...p,
                                              categoryIds: newIds,
                                              categoryId: "",
                                            }
                                          : p,
                                      ),
                                    );
                                  }}
                                />
                                {cat.categoryName}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50">
                        Keywords
                      </label>
                      <input
                        type="text"
                        className={INPUT_CLASS}
                        value={proj.keywords}
                        onChange={(e) =>
                          handleUpdateProject(
                            proj.id,
                            "keywords",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. UX, UI, Web Design (Comma separated)"
                      />
                    </div>
                  </div>

                  <hr className="border-white/[0.06] w-full" />

                  {/* Part 2: Media and Additional Project Details */}
                  <div className="flex flex-col gap-4">
                    {/* Images Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-white/50">
                          Thumbnail Image
                        </label>
                        <ImageUploader
                          label=""
                          value={proj.thumbnail}
                          onChange={(val) =>
                            handleUpdateProject(proj.id, "thumbnail", val)
                          }
                          folder="sanxinstudio/projects"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-white/50">
                          Main Image
                        </label>
                        <ImageUploader
                          label=""
                          value={proj.mainImage}
                          onChange={(val) =>
                            handleUpdateProject(proj.id, "mainImage", val)
                          }
                          folder="sanxinstudio/projects"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-white/50">
                          Secondary Image
                        </label>
                        <ImageUploader
                          label=""
                          value={proj.image2}
                          onChange={(val) =>
                            handleUpdateProject(proj.id, "image2", val)
                          }
                          folder="sanxinstudio/projects"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50">
                        Description
                      </label>
                      <textarea
                        className={TEXTAREA_CLASS}
                        value={proj.description}
                        onChange={(e) =>
                          handleUpdateProject(
                            proj.id,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Detailed project description..."
                      />
                    </div>

                    {/* Button Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-white/50">
                          Button Text
                        </label>
                        <input
                          type="text"
                          className={INPUT_CLASS}
                          value={proj.buttonText}
                          onChange={(e) =>
                            handleUpdateProject(
                              proj.id,
                              "buttonText",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. View Live Site"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-white/50">
                          Button Link
                        </label>
                        <input
                          type="text"
                          className={INPUT_CLASS}
                          value={proj.buttonLink}
                          onChange={(e) =>
                            handleUpdateProject(
                              proj.id,
                              "buttonLink",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. https://example.com"
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

export default ProjectItemsEditor;
