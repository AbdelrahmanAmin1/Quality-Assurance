// Placeholder auth and onboarding screens used as the shared baseline for feature branching.
const Auth = ({ onComplete, onBack }) => (
  <div style={stub.page}>
    <div style={stub.card}>
      <div style={stub.eyebrow}>Branch 1</div>
      <h1 style={stub.title}>User authentication and account management</h1>
      <p style={stub.copy}>This branch will replace the baseline placeholder with the real sign-in, sign-up, onboarding, and account management flows.</p>
      <div style={stub.actions}>
        <button className="btn btn-ghost" onClick={onBack}>Back</button>
        <button className="btn btn-accent" onClick={onComplete}>Open onboarding</button>
      </div>
    </div>
  </div>
);

const Onboarding = ({ onComplete }) => (
  <div style={stub.page}>
    <div style={stub.card}>
      <div style={stub.eyebrow}>Branch 1</div>
      <h1 style={stub.title}>Onboarding placeholder</h1>
      <p style={stub.copy}>The full onboarding questionnaire is restored from the feature branch during the merge sequence.</p>
      <div style={stub.actions}>
        <button className="btn btn-accent" onClick={onComplete}>Go to dashboard</button>
      </div>
    </div>
  </div>
);

const stub = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    background: 'var(--bg-0)',
  },
  card: {
    width: '100%',
    maxWidth: 620,
    padding: 32,
    borderRadius: 'var(--r-xl)',
    background: 'var(--bg-1)',
    border: '1px solid var(--line)',
    boxShadow: 'var(--shadow-lg)',
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--accent)',
    marginBottom: 12,
  },
  title: {
    margin: 0,
    fontFamily: 'var(--font-display)',
    fontSize: 34,
    fontWeight: 300,
    letterSpacing: '-0.02em',
  },
  copy: {
    margin: '14px 0 0',
    fontSize: 14,
    lineHeight: 1.7,
    color: 'var(--fg-2)',
  },
  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 24,
  },
};

window.Auth = Auth;
window.Onboarding = Onboarding;
