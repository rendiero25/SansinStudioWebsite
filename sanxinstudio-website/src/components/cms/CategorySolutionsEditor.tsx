import { useState } from "react";
import ImageUploader from "./ImageUploader";
import ItemListEditor from "./ItemListEditor";
import type { ListItem } from "./ItemListEditor";

const generateId = () => Math.random().toString(36).substring(2, 10);

const INPUT_CLASS =
  "px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/[0.06]";

const TEXTAREA_CLASS = `${INPUT_CLASS} resize-y min-h-[80px] leading-relaxed`;

export interface DetailMethod {
  id: string;
  detailName: string;
  detailDesc: string;
  detailKeywords: string;
}

export interface Method {
  id: string;
  methodName: string;
  methodIcon: { url: string; publicId: string } | null;
  deliveryTime: string;
  details: DetailMethod[];
}

export interface Category {
  id: string;
  categoryName: string;
  categoryIcon: { url: string; publicId: string } | null;
  categoryDesc: string;
  categoryImage: { url: string; publicId: string } | null;
  sectionTitle: string;
  sectionDesc: string;
  buttonText: string;
  buttonLink: string;
  methods: Method[];
  features?: ListItem[];
}

interface CategorySolutionsEditorProps {
  categories: Category[];
  onChange: (categories: Category[]) => void;
}

const CategorySolutionsEditor = ({
  categories = [],
  onChange,
}: CategorySolutionsEditorProps) => {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: generateId(),
      categoryName: "",
      categoryIcon: null,
      categoryDesc: "",
      categoryImage: null,
      sectionTitle: "",
      sectionDesc: "",
      buttonText: "",
      buttonLink: "",
      methods: [],
      features: [],
    };
    onChange([...categories, newCategory]);
    setEditingCategoryId(newCategory.id);
  };

  const handleUpdateCategory = (
    id: string,
    key: keyof Category,
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
          className="py-[7px] px-3.5 text-xs border-none rounded-[10px] font-semibold font-[IBM_Plex_Sans,sans-serif] cursor-pointer inline-flex items-center gap-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-[0_2px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)]"
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
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="e.g. E-Commerce"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50">
                        Section Title
                      </label>
                      <input
                        type="text"
                        className={INPUT_CLASS}
                        value={cat.sectionTitle}
                        onChange={(e) =>
                          handleUpdateCategory(
                            cat.id,
                            "sectionTitle",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Build an Online Store"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-white/50">
                      Category Description
                    </label>
                    <textarea
                      className={TEXTAREA_CLASS}
                      value={cat.categoryDesc}
                      onChange={(e) =>
                        handleUpdateCategory(
                          cat.id,
                          "categoryDesc",
                          e.target.value,
                        )
                      }
                      placeholder="Brief description for sub section 1"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-white/50">
                      Section Description
                    </label>
                    <textarea
                      className={TEXTAREA_CLASS}
                      value={cat.sectionDesc}
                      onChange={(e) =>
                        handleUpdateCategory(
                          cat.id,
                          "sectionDesc",
                          e.target.value,
                        )
                      }
                      placeholder="Detailed description for sub section 2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50">
                        Category Icon
                      </label>
                      <ImageUploader
                        label=""
                        value={cat.categoryIcon}
                        onChange={(val) =>
                          handleUpdateCategory(cat.id, "categoryIcon", val)
                        }
                        folder="sanxinstudio/solution/icons"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50">
                        Category Image (Hero)
                      </label>
                      <ImageUploader
                        label=""
                        value={cat.categoryImage}
                        onChange={(val) =>
                          handleUpdateCategory(cat.id, "categoryImage", val)
                        }
                        folder="sanxinstudio/solution/images"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50">
                        Button Text
                      </label>
                      <input
                        type="text"
                        className={INPUT_CLASS}
                        value={cat.buttonText}
                        onChange={(e) =>
                          handleUpdateCategory(
                            cat.id,
                            "buttonText",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. View Plans"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50">
                        Button Link
                      </label>
                      <input
                        type="text"
                        className={INPUT_CLASS}
                        value={cat.buttonLink}
                        onChange={(e) =>
                          handleUpdateCategory(
                            cat.id,
                            "buttonLink",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. /ecommerce"
                      />
                    </div>
                  </div>

                  {/* Methods Section */}
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    {/* <h4 className="text-[14px] font-semibold text-white mb-4 flex items-center gap-2">
                      #2 Methods
                    </h4> */}
                    <MethodsEditor
                      methods={cat.methods || []}
                      onChange={(newMethods) =>
                        handleUpdateCategory(cat.id, "methods", newMethods)
                      }
                    />
                  </div>

                  {/* Features Section */}
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <h4 className="text-[14px] font-semibold text-white/80 mb-4">
                      Features List
                    </h4>
                    <ItemListEditor
                      label="Features"
                      items={(cat.features as ListItem[]) || []}
                      onChange={(items) =>
                        handleUpdateCategory(cat.id, "features", items)
                      }
                      fields={[
                        {
                          key: "icon",
                          label: "Icon",
                          type: "image",
                          folder: "sanxinstudio/solution/icons",
                        },
                        {
                          key: "title",
                          label: "Title",
                          type: "text",
                          placeholder: "e.g. Speed Optimization",
                        },
                        {
                          key: "description",
                          label: "Description",
                          type: "textarea",
                          placeholder: "Detailed description of feature...",
                        },
                        {
                          key: "keywords",
                          label: "Keywords",
                          type: "text",
                          placeholder: "e.g. fast, reliable, secure",
                        },
                      ]}
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

// --- Methods Editor ---
const MethodsEditor = ({
  methods,
  onChange,
}: {
  methods: Method[];
  onChange: (m: Method[]) => void;
}) => {
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null);

  const handleAddMethod = () => {
    const newMethod: Method = {
      id: generateId(),
      methodName: "",
      methodIcon: null,
      deliveryTime: "",
      details: [],
    };
    onChange([...methods, newMethod]);
    setEditingMethodId(newMethod.id);
  };

  const handleUpdate = (id: string, key: keyof Method, value: unknown) => {
    onChange(methods.map((m) => (m.id === id ? { ...m, [key]: value } : m)));
  };

  const handleDelete = (id: string) => {
    onChange(methods.filter((m) => m.id !== id));
    if (editingMethodId === id) setEditingMethodId(null);
  };

  return (
    <div className="flex flex-col gap-3">
      {methods.map((method, idx) => (
        <div
          key={method.id}
          className="bg-[#1a1a24] rounded-lg border border-white/10 p-4"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-[13px] text-white/80">
              Method {idx + 1}: {method.methodName || "Untitled"}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-white/50 hover:text-white text-xs cursor-pointer bg-transparent border-none"
                onClick={() =>
                  setEditingMethodId(
                    editingMethodId === method.id ? null : method.id,
                  )
                }
              >
                {editingMethodId === method.id ? "Close" : "Edit"}
              </button>
              <button
                type="button"
                className="text-red-400 hover:text-red-500 text-xs cursor-pointer bg-transparent border-none"
                onClick={() => handleDelete(method.id)}
              >
                Delete
              </button>
            </div>
          </div>

          {editingMethodId === method.id && (
            <div className="flex flex-col gap-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-white/50">
                    Method Name
                  </label>
                  <input
                    type="text"
                    className={INPUT_CLASS}
                    value={method.methodName}
                    onChange={(e) =>
                      handleUpdate(method.id, "methodName", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-white/50">
                    Est. Delivery Time
                  </label>
                  <input
                    type="text"
                    className={INPUT_CLASS}
                    value={method.deliveryTime}
                    onChange={(e) =>
                      handleUpdate(method.id, "deliveryTime", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-white/50">
                  Method Icon
                </label>
                <ImageUploader
                  label=""
                  value={method.methodIcon}
                  onChange={(val) => handleUpdate(method.id, "methodIcon", val)}
                  folder="sanxinstudio/solution/icons"
                />
              </div>

              {/* Detail Methods Section */}
              <div className="bg-white/[0.02] p-4 rounded-lg border border-white/5 mt-2">
                <h5 className="text-[12px] uppercase text-white/50 font-semibold mb-3">
                  Detail Methods
                </h5>
                <DetailMethodsEditor
                  details={method.details || []}
                  onChange={(newDetails) =>
                    handleUpdate(method.id, "details", newDetails)
                  }
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        className="w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-sm border border-indigo-500/20 transition-colors cursor-pointer"
        onClick={handleAddMethod}
      >
        + Add Method
      </button>
    </div>
  );
};

// --- Detail Methods Editor ---
const DetailMethodsEditor = ({
  details,
  onChange,
}: {
  details: DetailMethod[];
  onChange: (d: DetailMethod[]) => void;
}) => {
  const handleAdd = () => {
    onChange([
      ...details,
      { id: generateId(), detailName: "", detailDesc: "", detailKeywords: "" },
    ]);
  };

  const handleUpdate = (id: string, key: keyof DetailMethod, value: string) => {
    onChange(details.map((d) => (d.id === id ? { ...d, [key]: value } : d)));
  };

  const handleDelete = (id: string) => {
    onChange(details.filter((d) => d.id !== id));
  };

  return (
    <div className="flex flex-col gap-3">
      {details.map((detail, idx) => (
        <div
          key={detail.id}
          className="relative pl-3 border-l-2 border-white/10 ml-1"
        >
          <div className="flex justify-between mb-1">
            <span className="text-[11px] text-white/40">Detail #{idx + 1}</span>
            <button
              type="button"
              className="text-red-400 hover:text-red-500 text-[10px] cursor-pointer bg-transparent border-none"
              onClick={() => handleDelete(detail.id)}
            >
              Remove
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              className={`${INPUT_CLASS} py-2`}
              placeholder="Detail Name"
              value={detail.detailName}
              onChange={(e) =>
                handleUpdate(detail.id, "detailName", e.target.value)
              }
            />
            <textarea
              className={`${TEXTAREA_CLASS} min-h-[50px] py-2`}
              placeholder="Detail Description"
              value={detail.detailDesc}
              onChange={(e) =>
                handleUpdate(detail.id, "detailDesc", e.target.value)
              }
            />
            <input
              type="text"
              className={`${INPUT_CLASS} py-2`}
              placeholder="Keywords (comma separated)"
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
        className="w-max px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs rounded border border-white/10 transition-colors cursor-pointer mt-1"
        onClick={handleAdd}
      >
        + Add Detail
      </button>
    </div>
  );
};

export default CategorySolutionsEditor;
