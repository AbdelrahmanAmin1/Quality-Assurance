// Placeholder AI tutor workspace used as the shared baseline for feature branching.
const Tutor = ({ onNav }) => (
  <div>
    <window.Topbar title="AI Tutor" crumbs={['Baseline']}/>
    <section style={tutor.wrap}>
      <div style={tutor.card} className="card">
        <div style={tutor.eyebrow}>Branch 3</div>
        <h1 style={tutor.title}>AI learning assistant</h1>
        <p style={tutor.copy}>The feature branch restores the Socratic tutor workspace, step-by-step explanation flow, and answer feedback surface.</p>
        <div style={tutor.actions}>
          <button className="btn btn-ghost" onClick={() => onNav('dashboard')}>Back to dashboard</button>
          <button className="btn btn-accent" onClick={() => onNav('quiz')}>Open quiz</button>
        </div>
      </div>
    </section>
  </div>
);

const tutor = {
  wrap: { padding: 32 },
  card: { maxWidth: 820, padding: 32 },
  eyebrow: { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 },
  title: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em' },
  copy: { margin: '14px 0 0', fontSize: 14, lineHeight: 1.7, color: 'var(--fg-2)' },
  actions: { display: 'flex', gap: 10, marginTop: 24 },
};

window.Tutor = Tutor;
