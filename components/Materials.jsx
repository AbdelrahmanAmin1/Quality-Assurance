const Materials = ({ onNav }) => {
  const Icon = window.Icon;
  const Api = window.NoesisApi;
  const [view, setView] = React.useState("grid");
  const [materials, setMaterials] = React.useState([]);
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = React.useState(false);
  const [materialDraft, setMaterialDraft] = React.useState({ title: "", summary: "" });
  const fileRef = React.useRef(null);

  const load = React.useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const [materialData, courseData] = await Promise.all([
        Api.get("/api/materials"),
        Api.get("/api/courses").catch(() => ({ courses: [] })),
      ]);
      setMaterials(materialData.materials || []);
      setCourses(courseData.courses || []);
    } catch (err) {
      setError(err.message || "Could not load materials.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const openMaterial = (material) => {
    localStorage.setItem("noesis.materialId", material.id);
    onNav("material");
  };

  const createFromFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setError("");
    try {
      const result = await Api.post("/api/materials/extract", {
        filename: file.name,
        type: Api.materialTypeFromName(file.name),
        courseId: courses[0]?.id,
      });
      localStorage.setItem("noesis.materialId", result.material.id);
      await load();
      onNav("material");
    } catch (err) {
      setError(err.message || "Could not create material.");
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };

  const createManualMaterial = async () => {
    if (!materialDraft.title.trim()) return;
    setSaving(true);
    setError("");
    try {
      const result = await Api.post("/api/materials", {
        title: materialDraft.title.trim(),
        type: "note",
        courseId: courses[0]?.id,
        summary: materialDraft.summary.trim() || "Created from the materials workspace.",
      });
      localStorage.setItem("noesis.materialId", result.material.id);
      setMaterialDialogOpen(false);
      setMaterialDraft({ title: "", summary: "" });
      await load();
      onNav("material");
    } catch (err) {
      setError(err.message || "Could not create material.");
    } finally {
      setSaving(false);
    }
  };

  const typeIcon = { pdf: "File", slides: "Layers", video: "Play", note: "PenNib", pset: "Code", link: "Link", code: "Code" };
  const colorFor = (type) => ({ pdf: "var(--accent)", slides: "var(--info)", video: "var(--ok)", note: "var(--warn)", pset: "var(--parchment)", code: "var(--accent)", link: "var(--info)" }[type] || "var(--accent)");

  return (
    <div>
      <window.Topbar title="Materials" crumbs={["Library"]}
        right={<>
          <button className="btn btn-ghost" onClick={load} disabled={loading}><Icon.Clock size={12}/> Refresh</button>
          <button className="btn btn-accent" onClick={() => fileRef.current?.click()} disabled={saving}><Icon.Upload size={12}/> Upload</button>
        </>}
      />
      <input ref={fileRef} type="file" style={{ display: "none" }} onChange={createFromFile}/>
      <div style={ms.page}>
        <div style={ms.header}>
          <div>
            <div style={ms.eyebrow}>Library · {materials.length} materials</div>
            <h1 style={ms.title}>Your backend library</h1>
          </div>
          <div style={ms.switcher}>
            {["grid", "list"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "6px 12px", fontSize: 11.5, borderRadius: 6,
                background: view === v ? "var(--bg-0)" : "transparent",
                color: view === v ? "var(--fg-0)" : "var(--fg-2)",
                textTransform: "capitalize",
              }}>{v}</button>
            ))}
          </div>
        </div>

        <div style={ms.uploadZone}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={ms.uploadIcon}><Icon.Upload size={16} style={{ color: "var(--accent)" }}/></div>
            <div>
              <div style={{ fontSize: 13.5, color: "var(--fg-0)", fontWeight: 500 }}>Create a material from a real backend record</div>
              <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 2 }}>Uploads create persisted materials through the extraction API.</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => setMaterialDialogOpen(true)} disabled={saving}><Icon.Plus size={12}/> Manual</button>
            <button className="btn btn-ghost" onClick={() => fileRef.current?.click()} disabled={saving}>Choose file</button>
          </div>
        </div>

        {error && <div style={ms.error}>{error}</div>}
        {loading && <div style={ms.state}>Loading materials...</div>}
        {!loading && !materials.length && (
          <div className="card" style={ms.empty}>
            <Icon.File size={28} style={{ color: "var(--accent)" }}/>
            <div style={{ fontSize: 18, color: "var(--fg-0)", marginTop: 12 }}>No materials yet</div>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)", marginTop: 6 }}>Create one to unlock notes, flashcards, quizzes, and progress tracking.</div>
            <button className="btn btn-accent" onClick={() => setMaterialDialogOpen(true)} style={{ marginTop: 16 }}><Icon.Plus size={12}/> Add material</button>
          </div>
        )}

        {!loading && !!materials.length && (
          <div style={view === "grid" ? ms.grid : ms.list}>
            {materials.map(m => {
              const Ti = Icon[typeIcon[m.type] || "File"];
              const color = colorFor(m.type);
              const progress = Api.clampPercent(m.progress);
              return (
                <button key={m.id} onClick={() => openMaterial(m)} className="card card-hover" style={view === "grid" ? ms.card : ms.rowCard}>
                  {view === "grid" && (
                    <div style={{ ...ms.thumb, background: `linear-gradient(135deg, ${color}22, transparent 70%), var(--bg-2)` }}>
                      <Ti size={36} style={{ position: "absolute", top: 16, left: 16, color, opacity: 0.75 }}/>
                      <div style={ms.typeLabel} className="mono">{(m.type || "file").toUpperCase()}</div>
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: view === "grid" ? "flex-start" : "center", gap: 12, flex: 1 }}>
                    {view === "list" && <Ti size={18} style={{ color }}/>}
                    <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                      <div style={ms.materialTitle}>{m.title}</div>
                      <div style={ms.meta}>
                        <span>{m.course?.code || "No course"}</span><span>·</span><span>{m.status}</span><span>·</span><span>{Api.relativeDate(m.updatedAt)}</span>
                      </div>
                    </div>
                    {view === "list" && <ProgressBar value={progress} color={color}/>}
                  </div>
                  {view === "grid" && <ProgressBar value={progress} color={color} wide/>}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <window.FieldDialog
        open={materialDialogOpen}
        title="Add material"
        description="Create a backend material record without using a browser popup."
        fields={[
          { name: "title", label: "Title", placeholder: "Backend integration notes" },
          { name: "summary", label: "Summary", placeholder: "What this material covers", type: "textarea", required: false },
        ]}
        values={materialDraft}
        onChange={setMaterialDraft}
        onCancel={() => setMaterialDialogOpen(false)}
        onSubmit={createManualMaterial}
        submitLabel="Create material"
        busy={saving}
      />
    </div>
  );
};

const ProgressBar = ({ value, color, wide }) => (
  <div style={{ marginTop: wide ? 10 : 0, width: wide ? "100%" : 90 }}>
    <div style={{ height: 3, background: "var(--line)", borderRadius: 2 }}>
      <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 2 }}/>
    </div>
    <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)", marginTop: 4, textAlign: "right" }}>{value}%</div>
  </div>
);

const MaterialDetail = ({ onNav }) => {
  const Icon = window.Icon;
  const Api = window.NoesisApi;
  const [material, setMaterial] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let id = localStorage.getItem("noesis.materialId");
      if (!id) {
        const list = await Api.get("/api/materials");
        id = list.materials?.[0]?.id;
        if (id) localStorage.setItem("noesis.materialId", id);
      }
      if (!id) {
        setMaterial(null);
        return;
      }
      const data = await Api.get(`/api/materials/${id}`);
      setMaterial(data.material);
    } catch (err) {
      setError(err.message || "Could not load material.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const patchProgress = async (progress) => {
    if (!material) return;
    setSaving(true);
    try {
      await Api.patch(`/api/materials/${material.id}`, { progress });
      await load();
    } catch (err) {
      setError(err.message || "Could not update progress.");
    } finally {
      setSaving(false);
    }
  };

  const createNote = async () => {
    if (!material) return;
    setSaving(true);
    setError("");
    try {
      await Api.post("/api/notes", {
        materialId: material.id,
        title: `${material.title} notes`,
        body: material.summary || `Study notes for ${material.title}.`,
        tags: [material.type, "material"],
      });
      await load();
    } catch (err) {
      setError(err.message || "Could not create note.");
    } finally {
      setSaving(false);
    }
  };

  const createFlashcard = async () => {
    if (!material) return;
    setSaving(true);
    setError("");
    try {
      await Api.post("/api/flashcards", {
        materialId: material.id,
        prompt: `What is the key idea in ${material.title}?`,
        answer: material.summary || `Review ${material.title} and summarize the main idea.`,
        concept: material.title.slice(0, 120),
      });
      await load();
    } catch (err) {
      setError(err.message || "Could not create flashcard.");
    } finally {
      setSaving(false);
    }
  };

  const createQuiz = async () => {
    if (!material) return;
    setSaving(true);
    setError("");
    try {
      await Api.post("/api/quizzes", {
        materialId: material.id,
        title: `${material.title} check`,
        questions: [{
          prompt: `What should you review first in ${material.title}?`,
          answer: "key terms",
          choices: ["key terms", "unrelated facts", "skip the material"],
        }],
      });
      await load();
    } catch (err) {
      setError(err.message || "Could not create quiz.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={mds.state}>Loading material...</div>;

  if (!material) {
    return (
      <div>
        <window.Topbar title="Material" crumbs={["Library"]}/>
        <div className="card" style={mds.empty}>
          <Icon.File size={28} style={{ color: "var(--accent)" }}/>
          <div style={{ fontSize: 18, color: "var(--fg-0)", marginTop: 12 }}>No material selected</div>
          <button className="btn btn-accent" onClick={() => onNav("materials")} style={{ marginTop: 16 }}>Open library</button>
        </div>
      </div>
    );
  }

  const progress = Api.clampPercent(material.progress);
  const notes = material.notes || [];
  const flashcards = material.flashcards || [];
  const quizzes = material.quizzes || [];

  return (
    <div>
      <window.Topbar
        title={material.title}
        crumbs={["Library", material.course?.code || "Material"]}
        right={<button className="btn btn-accent" onClick={() => onNav("tutor")}><Icon.Sparkle size={12}/> Study with tutor</button>}
      />
      <div style={mds.layout}>
        <aside style={mds.chapters}>
          <div style={{ padding: "18px 18px 12px" }}>
            <div style={mds.railHead}>Material status</div>
          </div>
          {[
            ["Type", material.type],
            ["Status", material.status],
            ["Source", material.sourceName || "Manual entry"],
            ["Updated", Api.relativeDate(material.updatedAt)],
          ].map(([label, value]) => (
            <div key={label} style={mds.statRow}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
          <div style={{ padding: "16px 18px" }}>
            <div style={mds.progressTrack}><div style={{ ...mds.progressFill, width: `${progress}%` }}/></div>
            <div className="mono" style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 6 }}>{progress}% mastered</div>
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              <button className="btn btn-ghost" onClick={() => patchProgress(Math.max(0, progress - 10))} disabled={saving}>-10%</button>
              <button className="btn btn-ghost" onClick={() => patchProgress(Math.min(100, progress + 10))} disabled={saving}>+10%</button>
            </div>
          </div>
        </aside>

        <main style={mds.reader}>
          {error && <div style={ms.error}>{error}</div>}
          <div style={mds.readerHead}>
            <div style={mds.eyebrow}>{material.type} · {material.status}</div>
            <h1 style={mds.title}>{material.title}</h1>
            <div style={{ fontSize: 13, color: "var(--fg-2)" }}>{material.summary || "No summary has been saved for this material yet."}</div>
          </div>

          <div style={mds.article}>
            <section style={mds.section}>
              <div style={mds.sectionHead}>Notes</div>
              {notes.length ? notes.map(note => (
                <button key={note.id} style={mds.related} onClick={() => onNav("notes")}>
                  <Icon.PenNib size={13} style={{ color: "var(--accent)" }}/>
                  <span>{note.title}</span>
                </button>
              )) : <div style={mds.muted}>No notes connected to this material.</div>}
              <button className="btn btn-ghost" onClick={createNote} disabled={saving} style={{ marginTop: 10 }}><Icon.Plus size={12}/> Create note</button>
            </section>

            <section style={mds.section}>
              <div style={mds.sectionHead}>Study assets</div>
              <div style={mds.assetGrid}>
                <button style={mds.asset} onClick={createFlashcard} disabled={saving}>
                  <Icon.Cards size={15} style={{ color: "var(--accent)" }}/>
                  <span>{flashcards.length} flashcards</span>
                </button>
                <button style={mds.asset} onClick={createQuiz} disabled={saving}>
                  <Icon.Target size={15} style={{ color: "var(--accent)" }}/>
                  <span>{quizzes.length} quizzes</span>
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button className="btn btn-accent" onClick={() => onNav("flashcards")}><Icon.Cards size={12}/> Review cards</button>
                <button className="btn btn-ghost" onClick={() => onNav("quiz")}><Icon.Target size={12}/> Take quiz</button>
              </div>
            </section>
          </div>
        </main>

        <aside style={mds.rail}>
          <div style={mds.railBlock}>
            <div style={mds.railHead}>Backend record</div>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--fg-3)", overflowWrap: "anywhere" }}>{material.id}</div>
          </div>
          <div style={mds.railBlock}>
            <div style={mds.railHead}>Related counts</div>
            <div style={mds.countRow}><span>Notes</span><strong>{notes.length}</strong></div>
            <div style={mds.countRow}><span>Flashcards</span><strong>{flashcards.length}</strong></div>
            <div style={mds.countRow}><span>Quizzes</span><strong>{quizzes.length}</strong></div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const ms = {
  page: { padding: 28, maxWidth: 1400, margin: "0 auto" },
  header: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 },
  eyebrow: { fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 },
  title: { fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 300, margin: 0 },
  switcher: { display: "flex", gap: 4, padding: 2, background: "var(--bg-2)", borderRadius: "var(--r-md)", border: "1px solid var(--line)" },
  uploadZone: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: "var(--r-lg)", border: "1px dashed var(--line-strong)", background: "var(--bg-1)", marginBottom: 20 },
  uploadIcon: { width: 40, height: 40, borderRadius: "var(--r-md)", background: "var(--accent-glow)", border: "1px dashed var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
  list: { display: "flex", flexDirection: "column", gap: 6 },
  card: { padding: 16, display: "flex", flexDirection: "column", textAlign: "left" },
  rowCard: { padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 },
  thumb: { height: 120, borderRadius: "var(--r-md)", marginBottom: 14, position: "relative", overflow: "hidden", border: "1px solid var(--line-soft)" },
  typeLabel: { position: "absolute", bottom: 10, right: 10, fontSize: 10, color: "var(--fg-3)" },
  materialTitle: { fontFamily: "var(--font-display)", fontSize: 16, color: "var(--fg-0)", marginBottom: 4, fontWeight: 400 },
  meta: { fontSize: 11.5, color: "var(--fg-3)", display: "flex", gap: 10, flexWrap: "wrap" },
  empty: { padding: 40, textAlign: "center", maxWidth: 520, margin: "40px auto" },
  state: { padding: 28, color: "var(--fg-2)", textAlign: "center" },
  error: { marginBottom: 16, padding: "10px 12px", border: "1px solid var(--err)", borderRadius: "var(--r-sm)", color: "var(--err)", fontSize: 12 },
};

const mds = {
  layout: { display: "grid", gridTemplateColumns: "240px 1fr 300px", minHeight: "calc(100vh - 57px)" },
  chapters: { borderRight: "1px solid var(--line)", background: "var(--bg-0)" },
  reader: { padding: "40px 56px", maxWidth: 840, margin: "0 auto", width: "100%" },
  readerHead: { marginBottom: 28 },
  eyebrow: { fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 },
  title: { fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 300, margin: "0 0 8px" },
  article: { display: "flex", flexDirection: "column", gap: 18 },
  section: { padding: 18, border: "1px solid var(--line)", borderRadius: "var(--r-md)", background: "var(--bg-1)" },
  sectionHead: { fontSize: 12, color: "var(--fg-0)", fontWeight: 600, marginBottom: 12 },
  related: { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 0", color: "var(--fg-1)", textAlign: "left" },
  muted: { fontSize: 12.5, color: "var(--fg-3)" },
  assetGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 },
  asset: { display: "flex", alignItems: "center", gap: 10, padding: 14, border: "1px solid var(--line)", borderRadius: "var(--r-sm)", background: "var(--bg-2)", color: "var(--fg-1)", textAlign: "left" },
  rail: { borderLeft: "1px solid var(--line)", padding: 20, display: "flex", flexDirection: "column", gap: 20, background: "var(--bg-0)" },
  railBlock: { display: "flex", flexDirection: "column", gap: 8 },
  railHead: { fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase" },
  statRow: { display: "flex", flexDirection: "column", gap: 3, padding: "10px 18px", fontSize: 12, color: "var(--fg-2)" },
  countRow: { display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--fg-2)" },
  progressTrack: { height: 4, borderRadius: 2, background: "var(--line)", overflow: "hidden" },
  progressFill: { height: "100%", background: "var(--accent)" },
  state: { minHeight: "100vh", display: "grid", placeItems: "center", color: "var(--fg-2)" },
  empty: { padding: 40, textAlign: "center", maxWidth: 520, margin: "80px auto" },
};

window.Materials = Materials;
window.MaterialDetail = MaterialDetail;
