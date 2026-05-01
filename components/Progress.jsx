const Progress = ({ onNav }) => {
  const Icon = window.Icon;
  const Api = window.NoesisApi;
  const [data, setData] = React.useState({ snapshots: [], materialProgress: [], recentReviews: [], recentAttempts: [] });
  const [dashboard, setDashboard] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const load = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [progress, dashboardData] = await Promise.all([
        Api.get("/api/progress"),
        Api.get("/api/dashboard"),
      ]);
      setData(progress);
      setDashboard(dashboardData.summary);
    } catch (err) {
      setError(err.message || "Could not load progress.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const logToday = async () => {
    const minutes = Number(window.prompt("Minutes studied today", "25"));
    if (!Number.isFinite(minutes) || minutes < 0) return;
    setSaving(true);
    setError("");
    try {
      await Api.post("/api/progress/snapshots", {
        minutesStudied: Math.round(minutes),
        masteryScore: dashboard?.averageMastery || 0,
        cardsReviewed: dashboard?.cardsReviewedThisWeek || 0,
        quizzesTaken: data.recentAttempts?.length || 0,
      });
      await load();
    } catch (err) {
      setError(err.message || "Could not save progress.");
    } finally {
      setSaving(false);
    }
  };

  const snapshots = data.snapshots || [];
  const materials = data.materialProgress || [];
  const attempts = data.recentAttempts || [];
  const reviews = data.recentReviews || [];
  const totalMinutes = snapshots.reduce((sum, snapshot) => sum + (snapshot.minutesStudied || 0), 0);
  const averageMastery = materials.length ? Math.round(materials.reduce((sum, material) => sum + material.progress, 0) / materials.length) : 0;
  const quizAverage = attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length) : 0;

  return (
    <div>
      <window.Topbar title="Progress" crumbs={["Analytics"]}
        right={<>
          <button className="btn btn-ghost" onClick={load} disabled={loading}>Last 90 days <Icon.ChevronDown size={11}/></button>
          <button className="btn btn-accent" onClick={logToday} disabled={saving}><Icon.Plus size={12}/> Log today</button>
        </>}
      />
      <div style={ps.page}>
        <div style={ps.header}>
          <div style={ps.eyebrow}>The long view</div>
          <h1 style={ps.title}>Progress is calculated from your backend study records.</h1>
        </div>

        {error && <div style={ps.error}>{error}</div>}
        {loading && <div style={ps.loading}>Loading progress...</div>}
        {!loading && (
          <>
            <div style={ps.metricGrid}>
              <Metric label="Mastery" value={`${averageMastery}%`} detail={`${materials.length} tracked materials`} tone="var(--ok)"/>
              <Metric label="Focus time" value={`${Math.round(totalMinutes / 60 * 10) / 10}h`} detail="from progress snapshots" tone="var(--parchment)"/>
              <Metric label="Card reviews" value={reviews.length} detail="recent review records" tone="var(--accent)"/>
              <Metric label="Quiz average" value={`${quizAverage}%`} detail={`${attempts.length} attempts`} tone="var(--warn)"/>
            </div>

            <div className="card" style={ps.card}>
              <div style={ps.cardHead}>
                <div>
                  <div style={ps.cardTitle}>Mastery over time</div>
                  <div style={ps.cardSub}>Daily snapshot mastery scores.</div>
                </div>
              </div>
              <MasteryChart snapshots={snapshots}/>
            </div>

            <div style={ps.columns}>
              <div className="card" style={ps.card}>
                <div style={ps.cardTitle}>Material mastery by topic</div>
                <div style={ps.cardSub}>Click a topic to open the material detail view.</div>
                <div style={ps.topicStack}>
                  {materials.length ? materials.map((material) => {
                    const progress = Api.clampPercent(material.progress);
                    return (
                      <button key={material.id} style={ps.topicRow} onClick={() => { localStorage.setItem("noesis.materialId", material.id); onNav("material"); }}>
                        <span style={{ flex: 1 }}>{material.title}</span>
                        <div style={ps.topicBar}><div style={{ ...ps.topicFill, width: `${progress}%`, background: progress > 70 ? "var(--ok)" : progress > 45 ? "var(--accent)" : "var(--warn)" }}/></div>
                        <span className="mono" style={ps.topicPercent}>{progress}%</span>
                      </button>
                    );
                  }) : <div style={ps.empty}>No material progress yet.</div>}
                </div>
              </div>

              <div className="card" style={ps.card}>
                <div style={ps.cardTitle}>Study activity</div>
                <div style={ps.cardSub}>Snapshot intensity over recent days.</div>
                <Heatmap snapshots={snapshots}/>
              </div>
            </div>

            <div className="card" style={{ ...ps.card, marginTop: 14 }}>
              <div style={ps.cardTitle}>Recent quiz attempts</div>
              <div style={ps.attemptStack}>
                {attempts.length ? attempts.slice(0, 5).map((attempt) => (
                  <div key={attempt.id} style={ps.attemptRow}>
                    <Icon.Target size={13} style={{ color: "var(--accent)" }}/>
                    <span style={{ flex: 1 }}>{attempt.quiz?.title || "Quiz"}</span>
                    <span className="mono" style={{ color: "var(--fg-2)" }}>{attempt.score}%</span>
                  </div>
                )) : <div style={ps.empty}>Quiz attempts appear after submitting a quiz.</div>}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Metric = ({ label, value, detail, tone }) => (
  <div className="card" style={{ padding: 22 }}>
    <div style={ps.metricLabel}>{label}</div>
    <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 300, color: tone }}>{value}</div>
    <div style={{ fontSize: 11.5, color: "var(--fg-2)", marginTop: 4 }}>{detail}</div>
  </div>
);

const MasteryChart = ({ snapshots }) => {
  const values = snapshots.length ? snapshots.map((snapshot) => snapshot.masteryScore || 0) : [0];
  const W = 900, H = 220, P = 20;
  const x = (i) => P + (values.length <= 1 ? 0 : (i / (values.length - 1)) * (W - P * 2));
  const y = (v) => H - P - (v / 100) * (H - P * 2);
  const line = values.map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`).join(" ");
  const area = `${line} L ${x(values.length - 1)} ${H - P} L ${x(0)} ${H - P} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 220 }}>
      <defs>
        <linearGradient id="progress-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.3"/>
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map(v => (
        <g key={v}>
          <line x1={P} x2={W - P} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeDasharray="2,3"/>
          <text x={P - 4} y={y(v) + 3} fontSize="9" fill="var(--fg-3)" textAnchor="end" fontFamily="var(--font-mono)">{v}</text>
        </g>
      ))}
      <path d={area} fill="url(#progress-area)"/>
      <path d={line} stroke="var(--accent)" strokeWidth="1.8" fill="none"/>
      {values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="var(--accent)"/>)}
    </svg>
  );
};

const Heatmap = ({ snapshots }) => {
  const days = snapshots.slice(-84);
  return (
    <div style={ps.heatmap}>
      {days.length ? days.map((snapshot) => {
        const level = Math.min(4, Math.ceil((snapshot.minutesStudied || 0) / 30));
        return (
          <div key={snapshot.id} title={window.NoesisApi.dateLabel(snapshot.date)} style={{
            aspectRatio: "1",
            borderRadius: 2,
            background: level === 0 ? "var(--bg-2)" : `color-mix(in oklab, var(--accent) ${level * 22}%, transparent)`,
          }}/>
        );
      }) : <div style={ps.empty}>No snapshots have been logged.</div>}
    </div>
  );
};

const ps = {
  page: { padding: 28, maxWidth: 1400, margin: "0 auto" },
  header: { marginBottom: 32 },
  eyebrow: { fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 },
  title: { fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 300, margin: 0 },
  metricGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 },
  metricLabel: { fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 },
  card: { padding: 22, marginBottom: 14 },
  cardHead: { display: "flex", justifyContent: "space-between", marginBottom: 20 },
  cardTitle: { fontSize: 13, color: "var(--fg-0)", fontWeight: 500, marginBottom: 4 },
  cardSub: { fontSize: 11.5, color: "var(--fg-3)", marginBottom: 20 },
  columns: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 },
  topicStack: { display: "flex", flexDirection: "column", gap: 8 },
  topicRow: { display: "flex", alignItems: "center", gap: 14, color: "var(--fg-1)", fontSize: 12.5, textAlign: "left" },
  topicBar: { flex: 1, height: 8, borderRadius: 4, background: "var(--bg-2)", overflow: "hidden" },
  topicFill: { height: "100%", borderRadius: 4 },
  topicPercent: { fontSize: 11, color: "var(--fg-2)", width: 36, textAlign: "right" },
  heatmap: { display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 3 },
  attemptStack: { display: "flex", flexDirection: "column", gap: 8, marginTop: 12 },
  attemptRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: "1px solid var(--line-soft)", color: "var(--fg-1)", fontSize: 12.5 },
  empty: { color: "var(--fg-3)", fontSize: 12.5 },
  loading: { padding: 28, color: "var(--fg-2)", textAlign: "center" },
  error: { marginBottom: 16, padding: "10px 12px", border: "1px solid var(--err)", borderRadius: "var(--r-sm)", color: "var(--err)", fontSize: 12 },
};

window.Progress = Progress;
