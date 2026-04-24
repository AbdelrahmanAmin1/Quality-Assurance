// Placeholder notes workspace used as the shared baseline for feature branching.
const Notes = ({ onNav }) => (
  <div>
    <window.Topbar title="Notes" crumbs={['Baseline', 'Learning content']}/>
    <section style={note.wrap}>
      <div style={note.card} className="card">
        <div style={note.eyebrow}>Branch 2</div>
        <h1 style={note.title}>Notes workspace</h1>
        <p style={note.copy}>The feature branch restores folders, tagged notes, editor content, and the flashcard generation handoff.</p>
        <div style={note.actions}>
          <button className="btn btn-ghost" onClick={() => onNav('materials')}>Back to materials</button>
          <button className="btn btn-accent" onClick={() => onNav('flashcards')}>Open flashcards</button>
        </div>
      </div>
    </section>
  </div>
);

const note = {
  wrap: { padding: 32 },
  card: { maxWidth: 820, padding: 32 },
  eyebrow: { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 },
  title: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em' },
  copy: { margin: '14px 0 0', fontSize: 14, lineHeight: 1.7, color: 'var(--fg-2)' },
  actions: { display: 'flex', gap: 10, marginTop: 24 },
};

window.Notes = Notes;
