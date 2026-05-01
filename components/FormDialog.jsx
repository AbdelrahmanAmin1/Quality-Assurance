const FieldDialog = ({ open, title, description, fields, values, onChange, onCancel, onSubmit, submitLabel = "Save", busy = false, error = "" }) => {
  if (!open) return null;

  const setValue = (name, value) => onChange({ ...values, [name]: value });

  return (
    <div style={fd.backdrop} role="dialog" aria-modal="true">
      <form
        style={fd.dialog}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div style={fd.header}>
          <div>
            <div style={fd.eyebrow}>Noesis</div>
            <h2 style={fd.title}>{title}</h2>
            {description && <p style={fd.description}>{description}</p>}
          </div>
          <button type="button" className="btn btn-bare" onClick={onCancel} style={{ padding: 6 }}>
            <window.Icon.X size={14}/>
          </button>
        </div>

        <div style={fd.fields}>
          {fields.map((field) => (
            <label key={field.name} style={fd.field}>
              <span style={fd.label}>{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  className="input"
                  value={values[field.name] || ""}
                  onChange={(event) => setValue(field.name, event.target.value)}
                  placeholder={field.placeholder || ""}
                  required={field.required !== false}
                  rows={field.rows || 4}
                  style={{ resize: "vertical", minHeight: field.minHeight || 100 }}
                />
              ) : (
                <input
                  className="input"
                  type={field.type || "text"}
                  value={values[field.name] || ""}
                  onChange={(event) => setValue(field.name, event.target.value)}
                  placeholder={field.placeholder || ""}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  required={field.required !== false}
                />
              )}
            </label>
          ))}
        </div>

        {error && <div style={fd.error}>{error}</div>}

        <div style={fd.actions}>
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>Cancel</button>
          <button type="submit" className="btn btn-accent" disabled={busy}>{busy ? "Saving..." : submitLabel}</button>
        </div>
      </form>
    </div>
  );
};

const fd = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    background: "rgba(0,0,0,0.58)",
    display: "grid",
    placeItems: "center",
    padding: 24,
  },
  dialog: {
    width: "min(520px, 100%)",
    borderRadius: "var(--r-lg)",
    background: "var(--bg-1)",
    border: "1px solid var(--line)",
    boxShadow: "var(--shadow-lg)",
    padding: 20,
    color: "var(--fg-0)",
  },
  header: { display: "flex", gap: 16, alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 },
  eyebrow: { fontSize: 10.5, color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 },
  title: { fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, margin: 0 },
  description: { fontSize: 13, color: "var(--fg-2)", margin: "8px 0 0", lineHeight: 1.5 },
  fields: { display: "flex", flexDirection: "column", gap: 12 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.04em" },
  actions: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 },
  error: { marginTop: 14, padding: "10px 12px", border: "1px solid var(--err)", borderRadius: "var(--r-sm)", color: "var(--err)", fontSize: 12 },
};

window.FieldDialog = FieldDialog;
