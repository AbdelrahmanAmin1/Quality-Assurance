const Quiz = ({ onNav }) => {
  const Icon = window.Icon;
  const Api = window.NoesisApi;
  const [quizzes, setQuizzes] = React.useState([]);
  const [quiz, setQuiz] = React.useState(null);
  const [answers, setAnswers] = React.useState({});
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [quizDialogOpen, setQuizDialogOpen] = React.useState(false);
  const [quizDraft, setQuizDraft] = React.useState({ title: "" });

  const load = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await Api.get("/api/quizzes");
      const loaded = data.quizzes || [];
      setQuizzes(loaded);
      setQuiz(loaded[0] || null);
      setAnswers({});
      setResult(null);
    } catch (err) {
      setError(err.message || "Could not load quizzes.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const createQuiz = async () => {
    const materialId = localStorage.getItem("noesis.materialId") || undefined;
    if (!quizDraft.title.trim()) return;
    setSaving(true);
    setError("");
    try {
      await Api.post("/api/quizzes", {
        materialId,
        title: quizDraft.title.trim(),
        questions: [{
          prompt: "What is the main idea to remember?",
          answer: "key idea",
          choices: ["key idea", "unrelated detail", "skip it"],
        }],
      });
      setQuizDialogOpen(false);
      setQuizDraft({ title: "" });
      await load();
    } catch (err) {
      setError(err.message || "Could not create quiz.");
    } finally {
      setSaving(false);
    }
  };

  const submit = async () => {
    if (!quiz) return;
    const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
    if (!payload.length) {
      setError("Answer at least one question before submitting.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = await Api.post(`/api/quizzes/${quiz.id}/attempts`, { answers: payload });
      setResult(data);
      const [list, updated] = await Promise.all([
        Api.get("/api/quizzes"),
        Api.get(`/api/quizzes/${quiz.id}`),
      ]);
      setQuizzes(list.quizzes || []);
      setQuiz(updated.quiz);
      setResult(data);
    } catch (err) {
      setError(err.message || "Could not submit quiz.");
    } finally {
      setSaving(false);
    }
  };

  const selectQuiz = (selected) => {
    setQuiz(selected);
    setAnswers({});
    setResult(null);
  };

  const questions = quiz?.questions || [];

  return (
    <div style={{ background: "var(--bg-0)", minHeight: "100vh" }}>
      <window.Topbar title={quiz?.title || "Quizzes"} crumbs={["Assessment"]}
        right={<>
          <span style={{ fontSize: 11.5, color: "var(--fg-3)" }}>{questions.length} questions</span>
          <button className="btn btn-accent" onClick={() => setQuizDialogOpen(true)} disabled={saving}><Icon.Plus size={12}/> New quiz</button>
        </>}
      />
      <div style={qz.layout}>
        <aside style={qz.sidebar}>
          <div style={qz.sideLabel}>Backend quizzes</div>
          {loading && <div style={qz.empty}>Loading quizzes...</div>}
          {!loading && quizzes.length ? quizzes.map((item) => (
            <button key={item.id} onClick={() => selectQuiz(item)} style={{ ...qz.quizBtn, background: item.id === quiz?.id ? "var(--bg-2)" : "transparent" }}>
              <div style={{ fontSize: 13, color: "var(--fg-0)", fontWeight: 500 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 3 }}>{item.questions?.length || 0} questions · {item.material?.title || "General"}</div>
            </button>
          )) : !loading && <div style={qz.empty}>No quizzes yet.</div>}
        </aside>

        <main style={qz.main}>
          {error && <div style={qz.error}>{error}</div>}
          {!quiz && !loading && (
            <div className="card" style={qz.emptyCard}>
              <Icon.Target size={30} style={{ color: "var(--accent)" }}/>
              <div style={{ fontSize: 20, color: "var(--fg-0)", marginTop: 12 }}>No quiz available</div>
              <button className="btn btn-accent" onClick={() => setQuizDialogOpen(true)} disabled={saving} style={{ marginTop: 16 }}><Icon.Plus size={12}/> Create quiz</button>
            </div>
          )}
          {quiz && (
            <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 28px" }}>
              <div style={qz.heading}>
                <div style={qz.eyebrow}>{quiz.material?.title || "General"} · Backend quiz</div>
                <h1 style={qz.title}>{quiz.title}</h1>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {questions.map((question, index) => {
                  const choices = Api.parseJsonArray(question.choices);
                  const selected = answers[question.id] || "";
                  return (
                    <div key={question.id} className="card" style={qz.questionCard}>
                      <div style={qz.questionMeta}>Question {String(index + 1).padStart(2, "0")}</div>
                      <div style={qz.prompt}>{question.prompt}</div>
                      {choices.length ? (
                        <div style={qz.choiceStack}>
                          {choices.map((choice, choiceIndex) => (
                            <button key={choice} onClick={() => !result && setAnswers({ ...answers, [question.id]: choice })} style={{
                              ...qz.choice,
                              borderColor: selected === choice ? "var(--accent-soft)" : "var(--line)",
                              background: selected === choice ? "var(--accent-glow)" : "var(--bg-1)",
                            }}>
                              <span className="mono" style={{ fontSize: 10, color: "var(--fg-3)", width: 14 }}>{String.fromCharCode(65 + choiceIndex)}</span>
                              <span style={{ flex: 1 }}>{choice}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input className="input" value={selected} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} disabled={!!result} placeholder="Type your answer"/>
                      )}
                      {result && (
                        <div style={selected.trim().toLowerCase() === question.answer.trim().toLowerCase() ? qz.correct : qz.incorrect}>
                          Stored answer: {question.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {result && (
                <div style={qz.result}>
                  <Icon.Sparkle size={14} style={{ color: "var(--accent)" }}/>
                  <div>
                    <div style={qz.resultTitle}>Score {result.attempt.score}%</div>
                    <div style={{ fontSize: 13, color: "var(--fg-1)", marginTop: 4 }}>{result.attempt.feedback}</div>
                  </div>
                </div>
              )}

              <div style={qz.actions}>
                <button className="btn btn-bare" onClick={() => onNav("materials")}><Icon.ArrowLeft size={12}/> Materials</button>
                <button className="btn btn-accent" onClick={submit} disabled={saving || !!result}>Submit attempt <Icon.ArrowRight size={12}/></button>
              </div>
            </div>
          )}
        </main>
      </div>
      <window.FieldDialog
        open={quizDialogOpen}
        title="Create quiz"
        description="Create a backend quiz record with a starter question."
        fields={[{ name: "title", label: "Quiz title", placeholder: "Backend quiz" }]}
        values={quizDraft}
        onChange={setQuizDraft}
        onCancel={() => setQuizDialogOpen(false)}
        onSubmit={createQuiz}
        submitLabel="Create quiz"
        busy={saving}
      />
    </div>
  );
};

const qz = {
  layout: { display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "calc(100vh - 57px)" },
  sidebar: { borderRight: "1px solid var(--line)", background: "var(--bg-0)", padding: "18px 12px" },
  sideLabel: { fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 8px 12px" },
  quizBtn: { width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)", textAlign: "left", marginBottom: 4 },
  main: { background: "var(--bg-0)" },
  heading: { marginBottom: 28 },
  eyebrow: { fontSize: 11, color: "var(--accent)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 },
  title: { fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 300, margin: 0, lineHeight: 1.2 },
  questionCard: { padding: 18 },
  questionMeta: { fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 },
  prompt: { fontSize: 16, color: "var(--fg-0)", marginBottom: 16, lineHeight: 1.5 },
  choiceStack: { display: "flex", flexDirection: "column", gap: 10 },
  choice: { display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: "var(--r-md)", border: "1px solid", textAlign: "left", color: "var(--fg-0)" },
  correct: { marginTop: 12, color: "var(--ok)", fontSize: 12.5 },
  incorrect: { marginTop: 12, color: "var(--err)", fontSize: 12.5 },
  result: { marginTop: 24, padding: 18, borderRadius: "var(--r-lg)", background: "var(--bg-1)", border: "1px solid var(--line)", display: "flex", gap: 10 },
  resultTitle: { fontSize: 12, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase" },
  actions: { display: "flex", justifyContent: "space-between", marginTop: 36 },
  empty: { color: "var(--fg-3)", fontSize: 12.5, padding: "8px 10px" },
  emptyCard: { padding: 40, textAlign: "center", maxWidth: 460, margin: "80px auto" },
  error: { margin: 16, padding: "10px 12px", border: "1px solid var(--err)", borderRadius: "var(--r-sm)", color: "var(--err)", fontSize: 12 },
};

window.Quiz = Quiz;
