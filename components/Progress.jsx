// Placeholder analytics screen used as the shared baseline for feature branching.
const Progress = ({ onNav }) => (
  <div>
    <window.Topbar title="Progress" crumbs={['Baseline', 'Dashboard']}/>
    <section style={prog.wrap}>
      <div style={prog.card} className="card">
        <div style={prog.eyebrow}>Branch 4</div>
        <h1 style={prog.title}>Progress analytics</h1>
        <p style={prog.copy}>The feature branch restores mastery charts, heatmaps, weekly review insights, and concept-level tracking.</p>
        <div style={prog.actions}>
          <button className="btn btn-ghost" onClick={() => onNav('dashboard')}>Back to dashboard</button>
          <button className="btn btn-accent" onClick={() => onNav('quiz')}>Open quiz</button>
        </div>
      </div>
    </section>
  </div>
);

const prog = {
  wrap: { padding: 32 },
  card: { maxWidth: 820, padding: 32 },
  eyebrow: { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 },
  title: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em' },
  copy: { margin: '14px 0 0', fontSize: 14, lineHeight: 1.7, color: 'var(--fg-2)' },
  actions: { display: 'flex', gap: 10, marginTop: 24 },
};

window.Progress = Progress;
