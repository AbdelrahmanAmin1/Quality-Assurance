// Placeholder dashboard used as the shared baseline for feature branching.
const Dashboard = ({ onNav }) => (
  <div>
    <window.Topbar title="Today" crumbs={['Baseline']}/>
    <section style={dash.wrap}>
      <div style={dash.card} className="card">
        <div style={dash.eyebrow}>Branch 4</div>
        <h1 style={dash.title}>Dashboard and progress tracking</h1>
        <p style={dash.copy}>The real daily dashboard, streak view, concept map, and analytics surface are restored from the feature branch.</p>
        <div style={dash.actions}>
          <button className="btn btn-ghost" onClick={() => onNav('progress')}>Open analytics</button>
          <button className="btn btn-accent" onClick={() => onNav('materials')}>Go to materials</button>
        </div>
      </div>
    </section>
  </div>
);

const dash = {
  wrap: { padding: 32 },
  card: { maxWidth: 820, padding: 32 },
  eyebrow: { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 },
  title: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em' },
  copy: { margin: '14px 0 0', fontSize: 14, lineHeight: 1.7, color: 'var(--fg-2)' },
  actions: { display: 'flex', gap: 10, marginTop: 24 },
};

window.Dashboard = Dashboard;
