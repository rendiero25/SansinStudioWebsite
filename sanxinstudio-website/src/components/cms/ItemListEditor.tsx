import { useState } from "react";

export interface ListItem {
  id: string;
  [key: string]: unknown;
}

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "url";
  placeholder?: string;
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
      ...Object.fromEntries(fields.map((f) => [f.key, ""])),
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
    <div className="cms-field">
      <div className="cms-list-header">
        <label className="cms-label">{label}</label>
        <button
          type="button"
          className="cms-btn cms-btn-sm cms-btn-primary"
          onClick={handleAdd}
          disabled={!!(maxItems && items.length >= maxItems)}
        >
          + Add Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="cms-empty-list">
          No items yet. Click "Add Item" to start.
        </div>
      ) : (
        <div className="cms-list-items">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`cms-list-item ${editingId === item.id ? "editing" : ""}`}
            >
              <div className="cms-list-item-header">
                <span className="cms-list-item-number">#{index + 1}</span>
                <span className="cms-list-item-title">
                  {(item[fields[0]?.key] as string) || "Untitled"}
                </span>
                <div className="cms-list-item-actions">
                  <button
                    type="button"
                    className="cms-btn-icon"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="cms-btn-icon"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === items.length - 1}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="cms-btn-icon"
                    onClick={() =>
                      setEditingId(editingId === item.id ? null : item.id)
                    }
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="cms-btn-icon cms-btn-icon-danger"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {editingId === item.id && (
                <div className="cms-list-item-fields">
                  {fields.map((field) => (
                    <div key={field.key} className="cms-field">
                      <label className="cms-label-sm">{field.label}</label>
                      {field.type === "textarea" ? (
                        <textarea
                          className="cms-input cms-textarea"
                          value={(item[field.key] as string) || ""}
                          onChange={(e) =>
                            handleUpdate(item.id, field.key, e.target.value)
                          }
                          placeholder={field.placeholder}
                          rows={3}
                        />
                      ) : (
                        <input
                          type={field.type === "url" ? "url" : "text"}
                          className="cms-input"
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

export default ItemListEditor;
