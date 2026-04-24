// Placeholder learning content screens used as the shared baseline for feature branching.
const Materials = ({ onNav }) => (
  <div>
    <window.Topbar title="Materials" crumbs={['Baseline']}/>
    <section style={mat.wrap}>
      <div style={mat.card} className="card">
        <div style={mat.eyebrow}>Branch 2</div>
        <h1 style={mat.title}>Learning content</h1>
        <p style={mat.copy}>The branch restores the full materials library, detailed reader experience, and content-linked study flow.</p>
        <div style={mat.actions}>
          <button className="btn btn-ghost" onClick={() => onNav('material')}>Open material</button>
          <button className="btn btn-accent" onClick={() => onNav('notes')}>Open notes</button>
        </div>
      </div>
    </section>
  </div>
);

const MaterialDetail = ({ onNav }) => (
  <div>
    <window.Topbar title="Material detail" crumbs={['Baseline', 'Learning content']}/>
    <section style={mat.wrap}>
      <div style={mat.card} className="card">
        <div style={mat.eyebrow}>Branch 2</div>
        <h1 style={mat.title}>Reader placeholder</h1>
        <p style={mat.copy}>The feature branch restores annotations, study prompts, concept chips, and the tutor handoff from content.</p>
        <div style={mat.actions}>
          <button className="btn btn-ghost" onClick={() => onNav('materials')}>Back to library</button>
          <button className="btn btn-accent" onClick={() => onNav('tutor')}>Open tutor</button>
        </div>
      </div>
    </section>
  </div>
);

const mat = {
  wrap: { padding: 32 },
  card: { maxWidth: 820, padding: 32 },
  eyebrow: { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 },
  title: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em' },
  copy: { margin: '14px 0 0', fontSize: 14, lineHeight: 1.7, color: 'var(--fg-2)' },
  actions: { display: 'flex', gap: 10, marginTop: 24 },
};

window.Materials = Materials;
window.MaterialDetail = MaterialDetail;
