// Placeholder settings screen used as the shared baseline for feature branching.
const Settings = ({ theme, setTheme, onLogout }) => (
  <div>
    <window.Topbar title="Settings" crumbs={['Baseline', 'Account']}/>
    <section style={settings.wrap}>
      <div style={settings.card} className="card">
        <div style={settings.eyebrow}>Branch 1</div>
        <h1 style={settings.title}>Account management placeholder</h1>
        <p style={settings.copy}>The feature branch restores profile, learning preferences, notifications, privacy, integrations, and session management.</p>
        <div style={settings.actions}>
          <button className="btn btn-ghost" onClick={onLogout}>Log out</button>
          <button className="btn btn-accent" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</button>
        </div>
      </div>
    </section>
  </div>
);

const settings = {
  wrap: { padding: 32 },
  card: { maxWidth: 820, padding: 32 },
  eyebrow: { fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 },
  title: { margin: 0, fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em' },
  copy: { margin: '14px 0 0', fontSize: 14, lineHeight: 1.7, color: 'var(--fg-2)' },
  actions: { display: 'flex', gap: 10, marginTop: 24 },
};

window.Settings = Settings;
