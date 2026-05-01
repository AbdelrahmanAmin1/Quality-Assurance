const Notes = ({ onNav }) => {
  const Icon = window.Icon;
  const Api = window.NoesisApi;
  const [notes, setNotes] = React.useState([]);
  const [materials, setMaterials] = React.useState([]);
  const [activeId, setActiveId] = React.useState("");
  const [draft, setDraft] = React.useState({ title: "", body: "", tags: "" });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const load = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [noteData, materialData] = await Promise.all([
        Api.get("/api/notes"),
        Api.get("/api/materials").catch(() => ({ materials: [] })),
      ]);
      const loadedNotes = noteData.notes || [];
      setNotes(loadedNotes);
      setMaterials(materialData.materials || []);
      const nextActive = activeId && loadedNotes.some((note) => note.id === activeId)
        ? activeId
        : loadedNotes[0]?.id || "";
      setActiveId(nextActive);
      const activeNote = loadedNotes.find((note) => note.id === nextActive);
      setDraft(noteToDraft(activeNote));
    } catch (err) {
      setError(err.message || "Could not load notes.");
    } finally {
      setLoading(false);
    }
  }, [activeId]);

  React.useEffect(() => { load(); }, [load]);

  const selectNote = (note) => {
    setActiveId(note.id);
    setDraft(noteToDraft(note));
  };

  const createNote = async () => {
    const materialId = localStorage.getItem("noesis.materialId") || materials[0]?.id;
    setSaving(true);
    setError("");
    try {
      const result = await Api.post("/api/notes", {
        title: "Untitled note",
        body: "Start writing...",
        materialId: materialId || undefined,
        tags: materialId ? ["material"] : [],
      });
      setActiveId(result.note.id);
      await load();
    } catch (err) {
      setError(err.message || "Could not create note.");
    } finally {
      setSaving(false);
    }
  };

  const saveNote = async () => {
    if (!activeId) return;
    const tags = draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    setSaving(true);
    setError("");
    try {
      const result = await Api.patch(`/api/notes/${activeId}`, {
        title: draft.title,
        body: draft.body,
        tags,
      });
      setNotes(notes.map((note) => note.id === activeId ? { ...note, ...result.note } : note));
      setDraft(noteToDraft(result.note));
    } catch (err) {
      setError(err.message || "Could not save note.");
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async () => {
    if (!activeId) return;
    setSaving(true);
    setError("");
    try {
      await Api.delete(`/api/notes/${activeId}`);
      setActiveId("");
      await load();
    } catch (err) {
      setError(err.message || "Could not delete note.");
    } finally {
      setSaving(false);
    }
  };

  const activeNote = notes.find((note) => note.id === activeId);
  const tagCounts = notes.reduce((acc, note) => {
    Api.parseJsonArray(note.tags).forEach((tag) => { acc[tag] = (acc[tag] || 0) + 1; });
    return acc;
  }, {});

  return (
    <div>
      <window.Topbar title="Notes" crumbs={["Workspace"]}
        right={<>
          <button className="btn btn-ghost" onClick={load} disabled={loading}><Icon.Search size={12}/> Refresh</button>
          <button className="btn btn-accent" onClick={createNote} disabled={saving}><Icon.Plus size={12}/> New note</button>
        </>}
      />
      <div style={ns.layout}>
        <aside style={ns.folders}>
          <div style={ns.sectionLabel}>Materials</div>
          <div style={ns.stack}>
            {materials.length ? materials.map((material) => (
              <button key={material.id} style={ns.folderBtn} onClick={() => { localStorage.setItem("noesis.materialId", material.id); onNav("material"); }}>
                <Icon.Folder size={13}/>
                <span style={{ flex: 1, textAlign: "left" }}>{material.title}</span>
                <span className="mono" style={ns.badge}>{Api.clampPercent(material.progress)}%</span>
              </button>
            )) : <div style={ns.emptyText}>No materials yet.</div>}
          </div>

          <div style={{ ...ns.sectionLabel, marginTop: 20 }}>Tags</div>
          <div style={ns.stack}>
            {Object.keys(tagCounts).length ? Object.entries(tagCounts).map(([tag, count]) => (
              <div key={tag} style={ns.tag}>
                <span style={ns.dot}/>#{tag}
                <span className="mono" style={{ marginLeft: "auto", color: "var(--fg-3)" }}>{count}</span>
              </div>
            )) : <div style={ns.emptyText}>Tags appear after saving notes.</div>}
          </div>
        </aside>

        <section style={ns.list}>
          <div style={ns.listHead}>
            <div style={{ fontSize: 13, color: "var(--fg-0)", fontWeight: 500 }}>Backend notes</div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>{notes.length} notes · sorted by recent</div>
          </div>
          {error && <div style={ns.error}>{error}</div>}
          {loading && <div style={ns.loading}>Loading notes...</div>}
          {!loading && !notes.length && <div style={ns.emptyPanel}>No notes yet. Create one to save study context.</div>}
          {!loading && notes.map((note) => {
            const active = note.id === activeId;
            const tags = Api.parseJsonArray(note.tags);
            return (
              <button key={note.id} onClick={() => selectNote(note)} style={{
                ...ns.noteButton,
                background: active ? "var(--bg-2)" : "transparent",
                borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
              }}>
                <div style={{ fontSize: 13, color: "var(--fg-0)", fontWeight: 500 }}>{note.title}</div>
                <div style={ns.meta}>
                  <span>{Api.relativeDate(note.updatedAt)}</span><span>·</span><span>{note.material?.title || "Standalone"}</span>
                </div>
                <div style={ns.preview}>{note.body}</div>
                {!!tags.length && <div style={ns.tags}>{tags.map((tag) => <span key={tag} className="chip">#{tag}</span>)}</div>}
              </button>
            );
          })}
        </section>

        <main style={ns.editor}>
          <div style={ns.editorInner}>
            {activeNote ? (
              <>
                <div style={ns.editorActions}>
                  <span className="chip chip-accent">{activeNote.material?.title || "Standalone"}</span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--fg-3)" }}>Updated {Api.relativeDate(activeNote.updatedAt)}</span>
                </div>
                <input
                  className="input"
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  style={ns.titleInput}
                />
                <textarea
                  className="input"
                  value={draft.body}
                  onChange={(event) => setDraft({ ...draft, body: event.target.value })}
                  style={ns.bodyInput}
                />
                <SetRowLite label="Tags" sub="Comma-separated tags are stored on the note record.">
                  <input className="input" value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} style={{ width: 260 }}/>
                </SetRowLite>
                <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
                  <button className="btn btn-accent" onClick={saveNote} disabled={saving}><Icon.Check size={12}/> Save</button>
                  <button className="btn btn-ghost" onClick={deleteNote} disabled={saving} style={{ color: "var(--err)" }}><Icon.X size={12}/> Delete</button>
                </div>
              </>
            ) : (
              <div className="card" style={ns.noSelection}>
                <Icon.PenNib size={28} style={{ color: "var(--accent)" }}/>
                <div style={{ fontSize: 18, color: "var(--fg-0)", marginTop: 12 }}>No note selected</div>
                <button className="btn btn-accent" onClick={createNote} disabled={saving} style={{ marginTop: 16 }}><Icon.Plus size={12}/> Create note</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const noteToDraft = (note) => ({
  title: note?.title || "",
  body: note?.body || "",
  tags: window.NoesisApi.parseJsonArray(note?.tags).join(", "),
});

const SetRowLite = ({ label, sub, children }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18, borderTop: "1px solid var(--line-soft)", gap: 24 }}>
    <div>
      <div style={{ fontSize: 13.5, color: "var(--fg-0)", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 2 }}>{sub}</div>
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

const ns = {
  layout: { display: "grid", gridTemplateColumns: "240px 340px 1fr", minHeight: "calc(100vh - 57px)" },
  folders: { borderRight: "1px solid var(--line)", padding: "8px 0", background: "var(--bg-0)" },
  list: { borderRight: "1px solid var(--line)", background: "var(--bg-0)", overflow: "auto" },
  editor: { background: "var(--bg-0)", overflow: "auto" },
  editorInner: { maxWidth: 760, margin: "0 auto", padding: "40px 36px" },
  sectionLabel: { padding: "16px 14px 8px", fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase" },
  stack: { padding: "0 8px", display: "flex", flexDirection: "column", gap: 2 },
  folderBtn: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--r-sm)", color: "var(--fg-2)", fontSize: 12.5 },
  badge: { fontSize: 10.5, color: "var(--fg-3)" },
  tag: { fontSize: 12, color: "var(--fg-2)", display: "flex", alignItems: "center", gap: 6, padding: "3px 6px" },
  dot: { width: 6, height: 6, borderRadius: 3, background: "var(--accent)", opacity: 0.6 },
  emptyText: { padding: "8px 10px", color: "var(--fg-3)", fontSize: 12 },
  listHead: { padding: "16px 18px", borderBottom: "1px solid var(--line-soft)" },
  noteButton: { display: "flex", flexDirection: "column", gap: 4, padding: "14px 18px", borderBottom: "1px solid var(--line-soft)", textAlign: "left", width: "100%" },
  meta: { fontSize: 11.5, color: "var(--fg-3)", display: "flex", gap: 8 },
  preview: { fontSize: 11.5, color: "var(--fg-2)", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  tags: { display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" },
  editorActions: { display: "flex", gap: 8, marginBottom: 20, alignItems: "center" },
  titleInput: { fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 300, marginBottom: 16, width: "100%" },
  bodyInput: { minHeight: 360, width: "100%", fontSize: 14, lineHeight: 1.7, padding: 16, resize: "vertical", marginBottom: 18 },
  noSelection: { padding: 40, textAlign: "center", maxWidth: 420, margin: "80px auto" },
  emptyPanel: { padding: 24, color: "var(--fg-3)", fontSize: 12.5 },
  loading: { padding: 24, color: "var(--fg-2)", fontSize: 12.5 },
  error: { margin: 14, padding: "10px 12px", border: "1px solid var(--err)", borderRadius: "var(--r-sm)", color: "var(--err)", fontSize: 12 },
};

window.Notes = Notes;
