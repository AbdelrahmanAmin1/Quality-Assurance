// Placeholder flashcards screen used as the shared baseline for feature branching.
const Flashcards = ({ onNav }) => (
  <div>
    <window.Topbar title="Flashcards" crumbs={['Baseline', 'Assessment']}/>
    <section style={cards.wrap}>
      <div style={cards.card} className="card">
        <div style={cards.eyebrow}>Branch 6</div>
        <h1 style={cards.title}>Assessment and feedback system</h1>
        <p style={cards.copy}>The feature branch restores spaced repetition review, answer rating, and the assessment loop tied back to learning content.</p>
        <div style={cards.actions}>
          <button className="btn btn-ghost" onClick={() => onNav('notes')}>Back to notes</button>
          <button className="btn btn-accent" onClick={() => onNav('quiz')}>Open quiz</button>
        </div>
      </div>
    </section>
  </div>
);

const cards = {
  wrap: { padding: 32 },
  card: { maxWidth: 820, padding: 32 },
  eyebrow: { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 },
  title: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em' },
  copy: { margin: '14px 0 0', fontSize: 14, lineHeight: 1.7, color: 'var(--fg-2)' },
  actions: { display: 'flex', gap: 10, marginTop: 24 },
};

window.Flashcards = Flashcards;
