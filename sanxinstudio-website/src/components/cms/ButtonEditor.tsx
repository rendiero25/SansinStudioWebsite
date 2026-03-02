interface ButtonEditorProps {
  label?: string;
  value: { text: string; link: string };
  onChange: (value: { text: string; link: string }) => void;
}

const ButtonEditor = ({
  label = "Button",
  value,
  onChange,
}: ButtonEditorProps) => {
  return (
    <div className="cms-field">
      <label className="cms-label">{label}</label>
      <div className="cms-button-editor">
        <div className="cms-field-inline">
          <label className="cms-label-sm">Text</label>
          <input
            type="text"
            className="cms-input"
            value={value?.text || ""}
            onChange={(e) => onChange({ ...value, text: e.target.value })}
            placeholder="Button text"
          />
        </div>
        <div className="cms-field-inline">
          <label className="cms-label-sm">Link</label>
          <input
            type="text"
            className="cms-input"
            value={value?.link || ""}
            onChange={(e) => onChange({ ...value, link: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  );
};

export default ButtonEditor;
