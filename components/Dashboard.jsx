const Dashboard = ({ onNav }) => {
  const Icon = window.Icon;
  const Api = window.NoesisApi;
  const [data, setData] = React.useState(null);
  const [materials, setMaterials] = React.useState([]);
  const [cards, setCards] = React.useState([]);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [hour] = React.useState(new Date().getHours());
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const load = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dashboard, materialData, cardData, userData] = await Promise.all([
        Api.get("/api/dashboard"),
        Api.get("/api/materials"),
        Api.get("/api/flashcards").catch(() => ({ cards: [] })),
        Api.get("/api/auth/me").catch(() => ({ user: null })),
      ]);
      setData(dashboard);
      setMaterials(materialData.materials || []);
      setCards(cardData.cards || []);
      setUser(userData.user || null);
    } catch (err) {
      setError(err.message || "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const summary = data?.summary || {};
  const snapshots = data?.snapshots || [];
  const focusPercent = Math.min(100, Math.round(((summary.todayMinutes || 0) / 45) * 100));
  const recentMaterials = materials.slice(0, 2);
  const reviewQueue = cards.filter((card) => !card.reviews?.[0] || card.reviews[0].confidence < 4).slice(0, 4);
  const firstName = (user?.name || user?.email || "there").split(" ")[0];

  return (
    <div style={{ background: "var(--bg-0)", minHeight: "100vh", position: "relative" }}>
      <div style={ds.glow}/>
      <window.Topbar
        title="Today"
        crumbs={[firstName]}
        right={<button className="btn btn-ghost" onClick={load} disabled={loading}><Icon.Calendar size={13}/> {Api.dateLabel(new Date())}</button>}
      />

      <div style={{ ...ds.page, position: "relative", zIndex: 1 }}>
        {error && <div style={ds.error}>{error}</div>}
        {loading && <div style={ds.loading}>Loading dashboard...</div>}
        {!loading && (
          <>
            <section style={ds.hero} className="reveal">
              <div>
                <div style={ds.eyebrow}>
                  <span style={ds.statusDot}/>
                  {greeting}, {firstName}
                </div>
                <h1 style={ds.heroTitle}>
                  Your workspace is tracking {summary.materials || 0} materials and {summary.averageMastery || 0}% average mastery.
                </h1>
                <p style={ds.heroSub}>
                  {summary.todayMinutes || 0} minutes logged today. Continue from your latest backend records or create new study data from the feature screens.
                </p>

                <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                  <button className="btn btn-accent" onClick={() => onNav("tutor")}><Icon.Play size={12}/> Start tutor session</button>
                  <button className="btn btn-ghost" onClick={() => onNav("flashcards")}><Icon.Cards size={13}/> {reviewQueue.length} cards ready</button>
                </div>
              </div>
              <div style={ds.focusWrap}><FocusRing value={focusPercent}/></div>
            </section>

            <section style={ds.grid} className="reveal">
              <div className="card" style={{ padding: 22, gridColumn: "span 2" }}>
                <div style={ds.cardHead}>
                  <span style={ds.cardTitle}>Pick up where you left</span>
                  <button className="btn btn-bare" style={{ fontSize: 11.5 }} onClick={() => onNav("materials")}>See library <Icon.ArrowRight size={11}/></button>
                </div>
                <div style={ds.resumeGrid}>
                  {recentMaterials.length ? recentMaterials.map((material) => {
                    const progress = Api.clampPercent(material.progress);
                    return (
                      <button key={material.id} style={ds.resumeCard} onClick={() => { localStorage.setItem("noesis.materialId", material.id); onNav("material"); }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="chip">{material.status}</span>
                          <span className="mono" style={{ fontSize: 10.5, color: "var(--fg-3)" }}>{progress}%</span>
                        </div>
                        <div style={ds.resumeTitle}>{material.title}</div>
                        <div style={ds.resumeMeta}>{material.course?.code || "No course"} · {Api.relativeDate(material.updatedAt)}</div>
                        <div style={ds.progress}><div style={{ ...ds.progressFill, width: `${progress}%` }}/></div>
                      </button>
                    );
                  }) : <EmptyBlock icon={Icon.File} title="No materials yet" text="Create a material to populate the dashboard." action={() => onNav("materials")}/>}
                </div>
              </div>

              <MetricCard title="This week" icon={<Icon.Flame size={14} style={{ color: "var(--accent)" }}/>} value={`${Math.round((snapshots || []).reduce((sum, s) => sum + (s.minutesStudied || 0), 0) / 60 * 10) / 10}`} suffix="hrs focused">
                <WeekBars snapshots={snapshots}/>
              </MetricCard>
            </section>

            <section style={ds.grid}>
              <div className="card" style={{ padding: 22 }}>
                <div style={ds.cardHead}>
                  <span style={ds.cardTitle}>Due for review</span>
                  <span className="chip chip-accent">{reviewQueue.length} cards</span>
                </div>
                <div style={ds.stack}>
                  {reviewQueue.length ? reviewQueue.map((card) => (
                    <div key={card.id} style={ds.reviewRow}>
                      <span style={{ ...ds.dot, background: confidenceColor(card.reviews?.[0]?.confidence) }}/>
                      <span style={{ fontSize: 13, color: "var(--fg-1)", flex: 1 }}>{card.prompt}</span>
                    </div>
                  )) : <div style={ds.emptyText}>No cards need attention.</div>}
                </div>
                <button className="btn btn-ghost" onClick={() => onNav("flashcards")} style={ds.fullBtn}>Review now <Icon.ArrowRight size={12}/></button>
              </div>

              <div className="card" style={{ padding: 22 }}>
                <div style={ds.cardHead}>
                  <span style={ds.cardTitle}>Material mastery</span>
                  <button className="btn btn-bare" style={{ fontSize: 11.5 }} onClick={() => onNav("progress")}>Open <Icon.ArrowUpRight size={11}/></button>
                </div>
                <ConceptMap materials={materials}/>
              </div>

              <div className="card" style={{ padding: 22 }}>
                <div style={ds.cardHead}><span style={ds.cardTitle}>Backend summary</span></div>
                <div style={ds.summaryGrid}>
                  <SummaryStat label="Materials" value={summary.materials || 0}/>
                  <SummaryStat label="Processed" value={summary.processedMaterials || 0}/>
                  <SummaryStat label="Notes" value={summary.notes || 0}/>
                  <SummaryStat label="Quizzes avg" value={`${summary.quizAverageThisWeek || 0}%`}/>
                </div>
              </div>
            </section>

            <section className="card" style={{ padding: 22, marginBottom: 40 }}>
              <div style={ds.cardHead}>
                <span style={ds.cardTitle}><Icon.Sparkle size={13} style={{ color: "var(--accent)" }}/> Current signals</span>
                <span style={{ fontSize: 11, color: "var(--fg-3)" }}>loaded from backend</span>
              </div>
              <div style={ds.insightGrid}>
                <Insight icon="File" title={`${summary.materials || 0} materials tracked`} text={`${summary.processedMaterials || 0} are processed and ready for study assets.`}/>
                <Insight icon="Cards" title={`${summary.cardsReviewedThisWeek || 0} cards reviewed this week`} text="Flashcard activity updates the assessment and progress views."/>
                <Insight icon="Target" title={`${summary.quizAverageThisWeek || 0}% quiz average`} text="Quiz attempts are stored against your authenticated user."/>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

const confidenceColor = (confidence) => confidence >= 4 ? "var(--ok)" : confidence >= 2 ? "var(--warn)" : "var(--err)";

const EmptyBlock = ({ icon: C, title, text, action }) => (
  <button style={ds.emptyBlock} onClick={action}>
    <C size={18} style={{ color: "var(--accent)" }}/>
    <div>
      <div style={{ color: "var(--fg-0)", fontSize: 13 }}>{title}</div>
      <div style={{ color: "var(--fg-3)", fontSize: 11.5, marginTop: 2 }}>{text}</div>
    </div>
  </button>
);

const MetricCard = ({ title, icon, value, suffix, children }) => (
  <div className="card" style={{ padding: 22 }}>
    <div style={ds.cardHead}><span style={ds.cardTitle}>{title}</span>{icon}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 14 }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 46, fontWeight: 300 }}>{value}</span>
      <span style={{ fontSize: 12, color: "var(--fg-2)" }}>{suffix}</span>
    </div>
    {children}
  </div>
);

const WeekBars = ({ snapshots }) => {
  const Api = window.NoesisApi;
  const days = snapshots.slice(0, 7).reverse();
  return (
    <div style={{ display: "flex", gap: 4, marginTop: 12, minHeight: 84, alignItems: "end" }}>
      {days.length ? days.map((snapshot) => (
        <div key={snapshot.id} style={{ flex: 1 }}>
          <div style={{ height: Math.max(3, (snapshot.minutesStudied || 0) * 0.8), background: "var(--accent)", borderRadius: 2, marginBottom: 6 }}/>
          <div className="mono" style={{ fontSize: 9, color: "var(--fg-3)", textAlign: "center" }}>{Api.dateLabel(snapshot.date).slice(0, 1)}</div>
        </div>
      )) : <div style={ds.emptyText}>No progress snapshots yet.</div>}
    </div>
  );
};

const FocusRing = ({ value }) => {
  const [v, setV] = React.useState(0);
  React.useEffect(() => { const id = setTimeout(() => setV(value), 100); return () => clearTimeout(id); }, [value]);
  const circ = 2 * Math.PI * 72;
  return (
    <div style={ds.ring}>
      <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="100" cy="100" r="72" stroke="var(--line)" strokeWidth="8" fill="none"/>
        <circle cx="100" cy="100" r="72" stroke="var(--accent)" strokeWidth="8" fill="none" strokeDasharray={circ} strokeDashoffset={circ * (1 - v / 100)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.5s var(--ease-out)" }}/>
        <circle cx="100" cy="100" r="52" stroke="var(--line-soft)" strokeWidth="1" fill="none"/>
      </svg>
      <div style={ds.ringText}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 300, color: "var(--fg-0)", lineHeight: 1 }}>{v}<span style={{ fontSize: 18, color: "var(--fg-2)" }}>%</span></div>
        <div style={{ fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>Daily focus</div>
      </div>
    </div>
  );
};

const ConceptMap = ({ materials }) => {
  const positioned = materials.slice(0, 8).map((material, i) => ({
    x: 18 + (i % 4) * 24,
    y: 28 + Math.floor(i / 4) * 42,
    r: 14 + Math.min(18, window.NoesisApi.clampPercent(material.progress) / 4),
    name: material.title,
    m: window.NoesisApi.clampPercent(material.progress),
  }));
  const color = (m) => m > 70 ? "var(--ok)" : m > 45 ? "var(--accent)" : m > 25 ? "var(--warn)" : "var(--err)";
  return (
    <div style={{ position: "relative", height: 180, marginTop: 10 }}>
      {positioned.length ? positioned.map((c) => (
        <div key={c.name} style={{
          position: "absolute", left: `${c.x}%`, top: `${c.y}%`, transform: "translate(-50%, -50%)",
          width: c.r * 2, height: c.r * 2, borderRadius: "50%", background: `radial-gradient(circle, ${color(c.m)} 0%, transparent 75%)`,
          opacity: 0.35 + c.m / 200, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: color(c.m) }}/>
          <span style={ds.conceptLabel} className="mono">{c.name}</span>
        </div>
      )) : <div style={ds.emptyText}>Material progress appears here.</div>}
    </div>
  );
};

const SummaryStat = ({ label, value }) => (
  <div style={ds.summaryStat}>
    <div style={{ fontSize: 10.5, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--fg-0)", marginTop: 6 }}>{value}</div>
  </div>
);

const Insight = ({ icon, title, text }) => {
  const C = window.Icon[icon];
  return (
    <div style={ds.insight}>
      <C size={15} style={{ color: "var(--accent)" }}/>
      <div style={{ fontSize: 13, color: "var(--fg-0)", fontWeight: 500, margin: "8px 0 4px" }}>{title}</div>
      <div style={{ fontSize: 12, color: "var(--fg-2)" }}>{text}</div>
    </div>
  );
};

const ds = {
  page: { padding: "28px", maxWidth: 1400, margin: "0 auto" },
  glow: { position: "absolute", top: 0, left: 0, right: 0, height: 420, pointerEvents: "none", background: "radial-gradient(ellipse 70% 80% at 82% 0%, var(--accent-glow), transparent 60%)", opacity: 0.9 },
  hero: { display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center", padding: "24px 0 32px" },
  eyebrow: { fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 },
  statusDot: { display: "inline-block", width: 6, height: 6, borderRadius: 3, background: "var(--accent)", marginRight: 8, boxShadow: "0 0 8px var(--accent)" },
  heroTitle: { fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 300, lineHeight: 1.1, margin: "0 0 14px", maxWidth: 720 },
  heroSub: { fontSize: 14, color: "var(--fg-2)", margin: 0, maxWidth: 560 },
  focusWrap: { padding: 10 },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 14 },
  cardHead: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 13, color: "var(--fg-1)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 8 },
  resumeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 },
  resumeCard: { padding: 16, borderRadius: "var(--r-md)", background: "var(--bg-2)", border: "1px solid var(--line)", textAlign: "left", display: "flex", flexDirection: "column" },
  resumeTitle: { fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, color: "var(--fg-0)", margin: "10px 0 6px", textAlign: "left" },
  resumeMeta: { fontSize: 11.5, color: "var(--fg-3)", textAlign: "left" },
  progress: { marginTop: 14, height: 3, background: "var(--line)", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", background: "var(--accent)", borderRadius: 2 },
  stack: { display: "flex", flexDirection: "column", gap: 10, marginTop: 14 },
  reviewRow: { display: "flex", alignItems: "center", gap: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  fullBtn: { marginTop: 14, width: "100%", justifyContent: "center" },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 16 },
  summaryStat: { padding: 12, border: "1px solid var(--line)", borderRadius: "var(--r-sm)", background: "var(--bg-2)" },
  insightGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 14 },
  insight: { padding: 14, borderRadius: "var(--r-md)", background: "var(--bg-2)", border: "1px solid var(--line)" },
  ring: { position: "relative", width: 200, height: 200, display: "flex", alignItems: "center", justifyContent: "center" },
  ringText: { position: "absolute", textAlign: "center" },
  conceptLabel: { position: "absolute", top: "100%", marginTop: 4, fontSize: 9.5, color: "var(--fg-2)", whiteSpace: "nowrap", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis" },
  emptyBlock: { gridColumn: "span 2", display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: "var(--r-md)", border: "1px dashed var(--line-strong)", background: "var(--bg-1)", textAlign: "left" },
  emptyText: { color: "var(--fg-3)", fontSize: 12.5 },
  loading: { padding: 28, color: "var(--fg-2)", textAlign: "center" },
  error: { marginBottom: 16, padding: "10px 12px", border: "1px solid var(--err)", borderRadius: "var(--r-sm)", color: "var(--err)", fontSize: 12 },
};

window.Dashboard = Dashboard;
