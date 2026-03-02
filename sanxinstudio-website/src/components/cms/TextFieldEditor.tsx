interface TextFieldEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  rows?: number;
}

const TextFieldEditor = ({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
  rows = 3,
}: TextFieldEditorProps) => {
  return (
    <div className="cms-field">
      <label className="cms-label">{label}</label>
      {multiline ? (
        <textarea
          className="cms-input cms-textarea"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          type="text"
          className="cms-input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default TextFieldEditor;
