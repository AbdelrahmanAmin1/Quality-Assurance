const Flashcards = ({ onNav }) => {
  const Icon = window.Icon;
  const Api = window.NoesisApi;
  const [cards, setCards] = React.useState([]);
  const [i, setI] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [cardDialogOpen, setCardDialogOpen] = React.useState(false);
  const [cardDraft, setCardDraft] = React.useState({ prompt: "", answer: "", concept: "" });

  const load = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await Api.get("/api/flashcards");
      const loaded = data.cards || [];
      setCards(loaded);
      setI((current) => Math.min(current, Math.max(0, loaded.length - 1)));
    } catch (err) {
      setError(err.message || "Could not load flashcards.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const createCard = async () => {
    const materialId = localStorage.getItem("noesis.materialId") || undefined;
    if (!cardDraft.prompt.trim() || !cardDraft.answer.trim()) return;
    setSaving(true);
    setError("");
    try {
      await Api.post("/api/flashcards", {
        materialId,
        prompt: cardDraft.prompt.trim(),
        answer: cardDraft.answer.trim(),
        concept: (cardDraft.concept.trim() || cardDraft.prompt.trim()).slice(0, 120),
      });
      setCardDialogOpen(false);
      setCardDraft({ prompt: "", answer: "", concept: "" });
      await load();
    } catch (err) {
      setError(err.message || "Could not create flashcard.");
    } finally {
      setSaving(false);
    }
  };

  const review = async (confidence, correct) => {
    const card = cards[i];
    if (!card) return;
    setSaving(true);
    setError("");
    try {
      await Api.post(`/api/flashcards/${card.id}/review`, { confidence, correct });
      setFlipped(false);
      setI((current) => Math.min(current + 1, Math.max(0, cards.length - 1)));
      await load();
    } catch (err) {
      setError(err.message || "Could not save review.");
    } finally {
      setSaving(false);
    }
  };

  const c = cards[i];

  return (
    <div style={{ background: "var(--bg-0)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <window.Topbar title="Flashcards" crumbs={["Review"]}
        right={<>
          <span style={{ fontSize: 11, color: "var(--fg-3)" }} className="mono">{cards.length ? i + 1 : 0} / {cards.length}</span>
          <button className="btn btn-accent" onClick={() => setCardDialogOpen(true)} disabled={saving}><Icon.Plus size={12}/> New card</button>
        </>}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {error && <div style={fc.error}>{error}</div>}
        {loading && <div style={fc.loading}>Loading flashcards...</div>}
        {!loading && !c && (
          <div className="card" style={fc.empty}>
            <Icon.Cards size={30} style={{ color: "var(--accent)" }}/>
            <div style={{ fontSize: 20, color: "var(--fg-0)", marginTop: 12 }}>No flashcards yet</div>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)", marginTop: 6 }}>Create cards from a material or add one manually.</div>
            <button className="btn btn-accent" onClick={() => setCardDialogOpen(true)} disabled={saving} style={{ marginTop: 16 }}><Icon.Plus size={12}/> Add card</button>
          </div>
        )}
        {!loading && c && (
          <>
            <div style={fc.progressWrap}>
              <div style={{ display: "flex", gap: 3 }}>
                {cards.map((_, k) => (
                  <div key={k} style={{ flex: 1, height: 2, borderRadius: 1, background: k < i ? "var(--ok)" : k === i ? "var(--accent)" : "var(--line)" }}/>
                ))}
              </div>
              <div style={fc.progressMeta} className="mono">
                <span>Last review: {c.reviews?.[0] ? Api.relativeDate(c.reviews[0].createdAt) : "never"}</span>
                <span>Deck: {c.material?.title || c.concept || "General"}</span>
              </div>
            </div>

            <div style={fc.center}>
              <div style={{ width: "100%", maxWidth: 640 }}>
                <div onClick={() => setFlipped(!flipped)} style={{ ...fc.card, transform: flipped ? "rotateY(180deg)" : "rotateY(0)" }}>
                  <div style={{ ...fc.face, transform: "rotateY(0)" }}>
                    <div style={fc.faceLabel}>Question</div>
                    <div style={fc.question}>{c.prompt}</div>
                    <div style={fc.hint} className="mono"><Icon.Cards size={11}/> Click to flip</div>
                  </div>
                  <div style={{ ...fc.face, transform: "rotateY(180deg)", background: "var(--bg-2)" }}>
                    <div style={{ ...fc.faceLabel, color: "var(--accent)" }}>Answer</div>
                    <div style={fc.answer}>{c.answer}</div>
                    {c.material && (
                      <div style={fc.source}>
                        <div style={fc.sourceLabel}>From material</div>
                        <div style={{ fontSize: 12, color: "var(--fg-2)" }}>{c.material.title}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={fc.rateRow}>
                  {[
                    { l: "Again", sub: "retry", color: "var(--err)", confidence: 1, correct: false },
                    { l: "Hard", sub: "low", color: "var(--warn)", confidence: 2, correct: true },
                    { l: "Good", sub: "solid", color: "var(--accent)", confidence: 4, correct: true },
                    { l: "Easy", sub: "mastered", color: "var(--ok)", confidence: 5, correct: true },
                  ].map(b => (
                    <button key={b.l} onClick={() => review(b.confidence, b.correct)} disabled={saving} style={fc.rateBtn}>
                      <span style={{ ...fc.keyHint, color: b.color }} className="mono">{b.confidence}</span>
                      <div>
                        <div style={{ fontSize: 13, color: "var(--fg-0)", fontWeight: 500 }}>{b.l}</div>
                        <div style={{ fontSize: 10.5, color: "var(--fg-3)", marginTop: 2 }} className="mono">{b.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <window.FieldDialog
        open={cardDialogOpen}
        title="Add flashcard"
        description="Create a flashcard through the backend assessment API."
        fields={[
          { name: "prompt", label: "Prompt", placeholder: "What stores materials?" },
          { name: "answer", label: "Answer", placeholder: "The backend API", type: "textarea" },
          { name: "concept", label: "Concept", placeholder: "Backend", required: false },
        ]}
        values={cardDraft}
        onChange={setCardDraft}
        onCancel={() => setCardDialogOpen(false)}
        onSubmit={createCard}
        submitLabel="Create card"
        busy={saving}
      />
    </div>
  );
};

const fc = {
  progressWrap: { padding: "14px 28px", borderBottom: "1px solid var(--line-soft)" },
  progressMeta: { display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--fg-3)" },
  center: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 },
  card: { position: "relative", minHeight: 340, transition: "transform 600ms var(--ease-in-out)", transformStyle: "preserve-3d", cursor: "pointer" },
  face: { position: "absolute", inset: 0, padding: 40, borderRadius: "var(--r-xl)", background: "var(--bg-1)", border: "1px solid var(--line)", backfaceVisibility: "hidden", boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column" },
  faceLabel: { fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 },
  question: { fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 300, lineHeight: 1.25 },
  answer: { fontSize: 17, lineHeight: 1.55, color: "var(--fg-0)" },
  hint: { marginTop: "auto", fontSize: 11, color: "var(--fg-3)", display: "flex", alignItems: "center", gap: 6 },
  source: { marginTop: 32, padding: 14, background: "var(--bg-1)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" },
  sourceLabel: { fontSize: 11, color: "var(--fg-3)", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" },
  rateRow: { display: "flex", gap: 8, marginTop: 32, justifyContent: "center" },
  rateBtn: { display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: "var(--r-md)", border: "1px solid var(--line)", background: "var(--bg-1)", minWidth: 120 },
  keyHint: { width: 20, height: 20, borderRadius: 4, background: "var(--bg-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 },
  empty: { padding: 40, textAlign: "center", maxWidth: 460, margin: "80px auto" },
  loading: { padding: 28, color: "var(--fg-2)", textAlign: "center" },
  error: { margin: 16, padding: "10px 12px", border: "1px solid var(--err)", borderRadius: "var(--r-sm)", color: "var(--err)", fontSize: 12 },
};

window.Flashcards = Flashcards;
