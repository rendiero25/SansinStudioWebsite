import { useState } from "react";
import ImageUploader from "./ImageUploader";

export interface ListItem {
  id: string;
  [key: string]: unknown;
}

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "image" | "subitems" | "select";
  placeholder?: string;
  folder?: string;
  options?: string[];
  condition?: (item: ListItem) => boolean;
  subFields?: FieldConfig[];
}

interface ItemListEditorProps {
  label: string;
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  fields: FieldConfig[];
  maxItems?: number;
  defaultItem?: Record<string, unknown>;
}

const generateId = () => Math.random().toString(36).substring(2, 10);

const INPUT_CLASS =
  "px-4 py-3 bg-white/[0.04] border border-white/10 rounded-[10px] text-white text-sm font-[IBM_Plex_Sans,sans-serif] outline-none transition-colors w-full box-border focus:border-indigo-500/50 focus:bg-white/[0.06]";

const TEXTAREA_CLASS = `${INPUT_CLASS} resize-y min-h-[80px] leading-relaxed`;

const ItemListEditor = ({
  label,
  items = [],
  onChange,
  fields,
  maxItems,
  defaultItem = {},
}: ItemListEditorProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    if (maxItems && items.length >= maxItems) return;
    const newItem: ListItem = {
      id: generateId(),
      ...Object.fromEntries(fields.map((f) => [f.key, f.type === "subitems" ? [] : ""])),
      ...defaultItem,
    };
    onChange([...items, newItem]);
    setEditingId(newItem.id);
  };

  const handleUpdate = (id: string, key: string, value: string) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  };

  const handleDelete = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [
      newItems[index],
      newItems[index - 1],
    ];
    onChange(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [
      newItems[index + 1],
      newItems[index],
    ];
    onChange(newItems);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-[13px] font-semibold text-white/70 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          className="py-[7px] px-3.5 text-xs border-none rounded-[10px] font-semibold font-[IBM_Plex_Sans,sans-serif] cursor-pointer transition-all duration-150 inline-flex items-center gap-1.5 whitespace-nowrap bg-linear-to-br from-indigo-500 to-purple-500 text-white shadow-[0_2px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleAdd}
          disabled={!!(maxItems && items.length >= maxItems)}
        >
          + Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center text-white/30 text-sm border border-dashed border-white/8 rounded-xl">
          No items yet. Click "Add Item" to start.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`bg-white/3 border rounded-xl overflow-hidden transition-colors duration-200 ${
                editingId === item.id
                  ? "border-indigo-500/30"
                  : "border-white/6"
              }`}
            >
              <div className="flex items-center gap-3 py-3.5 px-4">
                <span className="text-xs text-white/25 font-semibold min-w-7">
                  #{index + 1}
                </span>
                <span className="flex-1 text-sm text-white/80 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                  {(() => {
                    const titleField = fields.find((f) => f.type === "text" || f.type === "textarea");
                    return titleField ? (item[titleField.key] as string) || "Untitled" : "Untitled";
                  })()}
                </span>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/4 border border-white/8 rounded-lg cursor-pointer text-sm transition-all duration-150 text-white/60 hover:bg-white/8 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/4 border border-white/8 rounded-lg cursor-pointer text-sm transition-all duration-150 text-white/60 hover:bg-white/8 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === items.length - 1}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/4 border border-white/8 rounded-lg cursor-pointer text-sm transition-all duration-150 text-white/60 hover:bg-white/8 hover:text-white"
                    onClick={() =>
                      setEditingId(editingId === item.id ? null : item.id)
                    }
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center bg-white/4 border border-white/8 rounded-lg cursor-pointer text-sm transition-all duration-150 text-white/60 hover:bg-red-500/15 hover:text-red-500"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {editingId === item.id && (
                <div className="px-4 pb-4 flex flex-col gap-3 border-t border-white/4 pt-4">
                  {fields
                    .filter((f) => !f.condition || f.condition(item))
                    .map((field) => (
                      <div key={field.key} className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-white/50">
                        {field.label}
                      </label>
                      {field.type === "subitems" && field.subFields ? (
                        <SubItemsEditor
                          subItems={(item[field.key] as ListItem[]) || []}
                          subFields={field.subFields.filter(
                            (sf) => !sf.condition || sf.condition(item)
                          )}
                          onChange={(subItems) =>
                            handleUpdate(item.id, field.key, subItems as unknown as string)
                          }
                        />
                      ) : field.type === "image" ? (
                        <ImageUploader
                          label=""
                          value={
                            (item[field.key] as { url: string; publicId: string } | null) || null
                          }
                          onChange={(val) =>
                            handleUpdate(item.id, field.key, val as unknown as string)
                          }
                          folder={field.folder || "sanxinstudio/images"}
                        />
                      ) : field.type === "textarea" ? (
                        <textarea
                          className={TEXTAREA_CLASS}
                          value={(item[field.key] as string) || ""}
                          onChange={(e) =>
                            handleUpdate(item.id, field.key, e.target.value)
                          }
                          placeholder={field.placeholder}
                          rows={3}
                        />
                      ) : field.type === "select" ? (
                        <select
                          className={INPUT_CLASS}
                          value={(item[field.key] as string) || ""}
                          onChange={(e) =>
                            handleUpdate(item.id, field.key, e.target.value)
                          }
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type === "url" ? "url" : "text"}
                          className={INPUT_CLASS}
                          value={(item[field.key] as string) || ""}
                          onChange={(e) =>
                            handleUpdate(item.id, field.key, e.target.value)
                          }
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Sub-Items inline editor ────────────────────────── */

const SubItemsEditor = ({
  subItems,
  subFields,
  onChange,
}: {
  subItems: ListItem[];
  subFields: FieldConfig[];
  onChange: (subItems: ListItem[]) => void;
}) => {
  const handleAddSub = () => {
    const newSub: ListItem = {
      id: generateId(),
      ...Object.fromEntries(subFields.map((f) => [f.key, ""])),
    };
    onChange([...subItems, newSub]);
  };

  const handleUpdateSub = (id: string, key: string, value: string) => {
    onChange(
      subItems.map((s) => (s.id === id ? { ...s, [key]: value } : s)),
    );
  };

  const handleDeleteSub = (id: string) => {
    onChange(subItems.filter((s) => s.id !== id));
  };

  return (
    <div className="mt-2">
      {subItems.map((sub, idx) => (
        <div
          key={sub.id}
          className="bg-white/2 border border-white/6 rounded-lg p-3 mb-2"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-white/40">Sub-item #{idx + 1}</span>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center bg-white/4 border border-white/8 rounded-lg cursor-pointer text-sm transition-all duration-150 text-white/60 hover:bg-red-500/15 hover:text-red-500"
              onClick={() => handleDeleteSub(sub.id)}
              title="Delete sub-item"
            >
              🗑️
            </button>
          </div>
          {subFields.map((sf) => (
            <div key={sf.key} className="flex flex-col gap-2 mb-2">
              <label className="text-xs font-medium text-white/50">{sf.label}</label>
              {sf.type === "image" ? (
                <ImageUploader
                  label=""
                  value={
                    (sub[sf.key] as { url: string; publicId: string } | null) || null
                  }
                  onChange={(val) =>
                    handleUpdateSub(sub.id, sf.key, val as unknown as string)
                  }
                  folder={sf.folder || "sanxinstudio/images"}
                />
              ) : sf.type === "textarea" ? (
                <textarea
                  className={`${INPUT_CLASS} resize-y min-h-[60px] leading-relaxed`}
                  value={(sub[sf.key] as string) || ""}
                  onChange={(e) => handleUpdateSub(sub.id, sf.key, e.target.value)}
                  placeholder={sf.placeholder}
                  rows={2}
                />
              ) : sf.type === "select" ? (
                <select
                  className={INPUT_CLASS}
                  value={(sub[sf.key] as string) || ""}
                  onChange={(e) =>
                    handleUpdateSub(sub.id, sf.key, e.target.value)
                  }
                >
                  <option value="">Select {sf.label}</option>
                  {sf.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className={INPUT_CLASS}
                  value={(sub[sf.key] as string) || ""}
                  onChange={(e) => handleUpdateSub(sub.id, sf.key, e.target.value)}
                  placeholder={sf.placeholder}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button
        type="button"
        className="mt-1 py-[7px] px-3.5 text-xs border-none rounded-[10px] font-semibold font-[IBM_Plex_Sans,sans-serif] cursor-pointer transition-all duration-150 inline-flex items-center gap-1.5 whitespace-nowrap bg-white/6 text-white/80 border border-white/12 hover:bg-white/10"
        onClick={handleAddSub}
      >
        + Add Sub-item
      </button>
    </div>
  );
};

export default ItemListEditor;
