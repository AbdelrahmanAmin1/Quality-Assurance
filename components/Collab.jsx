// Placeholder study room screen used as the shared baseline for feature branching.
const Collab = ({ onNav }) => (
  <div>
    <window.Topbar title="Study room" crumbs={['Baseline']}/>
    <section style={collab.wrap}>
      <div style={collab.card} className="card">
        <div style={collab.eyebrow}>Branch 5</div>
        <h1 style={collab.title}>Collaboration and study rooms</h1>
        <p style={collab.copy}>The feature branch restores the member list, shared problem board, live voice panel, and focus sprint controls.</p>
        <div style={collab.actions}>
          <button className="btn btn-ghost" onClick={() => onNav('dashboard')}>Back to dashboard</button>
          <button className="btn btn-accent" onClick={() => onNav('notes')}>Open notes</button>
        </div>
      </div>
    </section>
  </div>
);

const collab = {
  wrap: { padding: 32 },
  card: { maxWidth: 820, padding: 32 },
  eyebrow: { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 },
  title: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em' },
  copy: { margin: '14px 0 0', fontSize: 14, lineHeight: 1.7, color: 'var(--fg-2)' },
  actions: { display: 'flex', gap: 10, marginTop: 24 },
};

window.Collab = Collab;
