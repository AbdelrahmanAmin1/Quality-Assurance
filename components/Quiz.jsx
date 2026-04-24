// Placeholder quiz screen used as the shared baseline for feature branching.
const Quiz = ({ onNav }) => (
  <div>
    <window.Topbar title="Quiz" crumbs={['Baseline', 'Assessment']}/>
    <section style={quiz.wrap}>
      <div style={quiz.card} className="card">
        <div style={quiz.eyebrow}>Branch 6</div>
        <h1 style={quiz.title}>Quiz and feedback</h1>
        <p style={quiz.copy}>The feature branch restores multiple-choice flows, answer explanations, review actions, and next-step feedback.</p>
        <div style={quiz.actions}>
          <button className="btn btn-ghost" onClick={() => onNav('flashcards')}>Back to flashcards</button>
          <button className="btn btn-accent" onClick={() => onNav('progress')}>Open progress</button>
        </div>
      </div>
    </section>
  </div>
);

const quiz = {
  wrap: { padding: 32 },
  card: { maxWidth: 820, padding: 32 },
  eyebrow: { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 },
  title: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em' },
  copy: { margin: '14px 0 0', fontSize: 14, lineHeight: 1.7, color: 'var(--fg-2)' },
  actions: { display: 'flex', gap: 10, marginTop: 24 },
};

window.Quiz = Quiz;
