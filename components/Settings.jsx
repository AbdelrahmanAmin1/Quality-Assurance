const Settings = ({ theme, setTheme, user, onLogout }) => {
  const Icon = window.Icon;
  const Api = window.NoesisApi;
  const [tab, setTab] = React.useState("profile");
  const [settings, setSettings] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const tabs = [
    { id: "profile", label: "Profile", icon: "Users" },
    { id: "appearance", label: "Appearance", icon: "Palette" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "data", label: "Data & privacy", icon: "Lock" },
    { id: "account", label: "Account", icon: "LogOut" },
  ];

  const load = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await Api.get("/api/settings");
      setSettings(data.settings);
      if (data.settings?.theme) setTheme(data.settings.theme);
    } catch (err) {
      setError(err.message || "Could not load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const save = async (patch) => {
    setSaving(true);
    setError("");
    try {
      const data = await Api.patch("/api/settings", patch);
      setSettings(data.settings);
      if (patch.theme) setTheme(patch.theme);
    } catch (err) {
      setError(err.message || "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <window.Topbar title="Settings" right={<button className="btn btn-ghost" onClick={load} disabled={loading}><Icon.Clock size={12}/> Refresh</button>}/>
      <div style={ss.layout}>
        <aside style={ss.sidebar}>
          <div style={ss.sideLabel}>Settings</div>
          {tabs.map(t => {
            const C = Icon[t.icon];
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                ...ss.tab,
                background: active ? "var(--bg-2)" : "transparent",
                color: active ? "var(--fg-0)" : "var(--fg-2)",
              }}>
                <C size={14}/> {t.label}
              </button>
            );
          })}
        </aside>
        <main style={ss.main} key={tab} className="fade-in">
          {error && <div style={ss.error}>{error}</div>}
          {loading && <div style={ss.loading}>Loading settings...</div>}
          {!loading && (
            <>
              {tab === "profile" && <ProfileTab user={user} settings={settings}/>}
              {tab === "appearance" && <AppearanceTab theme={theme} settings={settings} save={save} saving={saving}/>}
              {tab === "notifications" && <NotifTab settings={settings} save={save} saving={saving}/>}
              {tab === "data" && <DataTab user={user}/>}
              {tab === "account" && <AccountTab user={user} onLogout={onLogout}/>}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const SetHeader = ({ eyebrow, title, sub }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={ss.eyebrow}>{eyebrow}</div>
    <h1 style={ss.title}>{title}</h1>
    <p style={ss.sub}>{sub}</p>
  </div>
);

const ProfileTab = ({ user, settings }) => {
  const displayName = user?.name || user?.email || "Signed-in user";
  const email = user?.email || "Authenticated session";
  const avatar = window.NoesisApi.initials(user?.name, user?.email);
  return (
    <>
      <SetHeader eyebrow="Profile" title="Your backend account." sub="Profile details are loaded from the authenticated session."/>
      <div style={ss.profileCard}>
        <div style={ss.avatar}>{avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, color: "var(--fg-0)", fontWeight: 500 }}>{displayName}</div>
          <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 2 }}>{email}</div>
        </div>
      </div>
      <div style={ss.rows}>
        <SetRow label="Display name" sub="Read from the User record."><input className="input" value={user?.name || ""} readOnly style={{ width: 240 }}/></SetRow>
        <SetRow label="Email" sub="Used for authentication."><input className="input" value={email} readOnly style={{ width: 240 }}/></SetRow>
        <SetRow label="Settings record" sub="Loaded from /api/settings."><input className="input" value={settings?.id || "Not loaded"} readOnly style={{ width: 240 }}/></SetRow>
      </div>
    </>
  );
};

const AppearanceTab = ({ theme, settings, save, saving }) => {
  const Icon = window.Icon;
  const themes = [
    { id: "dark", label: "Cosmic", preview: ["#08081a", "#1b1b3a", "#a5b4fc"] },
    { id: "studious", label: "Studious", preview: ["#0b0a09", "#1a1917", "#c9a96a"] },
    { id: "light", label: "Refined", preview: ["#f6f3ec", "#ffffff", "#6b7f5a"] },
    { id: "space", label: "Violet", preview: ["#0a0a18", "#1e1e42", "#c99afc"] },
  ];
  return (
    <>
      <SetHeader eyebrow="Appearance" title="Theme preference." sub="Theme updates are persisted through the backend settings API."/>
      <div style={ss.themeGrid}>
        {themes.map(t => {
          const active = theme === t.id || settings?.theme === t.id;
          return (
            <button key={t.id} onClick={() => save({ theme: t.id })} disabled={saving} style={{
              ...ss.themeCard,
              borderColor: active ? "var(--accent-soft)" : "var(--line)",
              boxShadow: active ? "var(--shadow-glow)" : "none",
            }}>
              <div style={{ ...ss.themePreview, background: `linear-gradient(135deg, ${t.preview[0]}, ${t.preview[1]} 60%, ${t.preview[2]})` }}/>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--fg-0)" }}>{t.label}</span>
                {active && <Icon.Check size={16} style={{ color: "var(--accent)" }}/>}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};

const NotifTab = ({ settings, save, saving }) => (
  <>
    <SetHeader eyebrow="Notifications" title="Notification preferences." sub="Backend settings currently store digest and study reminder preferences."/>
    <div style={ss.rows}>
      <SetRow label="Email digest" sub="Receive periodic learning summaries.">
        <Toggle on={!!settings?.emailDigest} onClick={() => save({ emailDigest: !settings?.emailDigest })} disabled={saving}/>
      </SetRow>
      <SetRow label="Study reminders" sub="Allow reminders when study work is due.">
        <Toggle on={!!settings?.studyReminders} onClick={() => save({ studyReminders: !settings?.studyReminders })} disabled={saving}/>
      </SetRow>
    </div>
  </>
);

const DataTab = ({ user }) => (
  <>
    <SetHeader eyebrow="Data & privacy" title="Stored account data." sub="This view only reports data available from authenticated backend endpoints."/>
    <div style={ss.rows}>
      <SetRow label="User id" sub="Backend identifier for the current account."><input className="input mono" value={user?.id || ""} readOnly style={{ width: 260 }}/></SetRow>
      <SetRow label="Session source" sub="Access is controlled by an HTTP-only backend session cookie."><input className="input" value="Backend session" readOnly style={{ width: 260 }}/></SetRow>
    </div>
  </>
);

const AccountTab = ({ user, onLogout }) => {
  const Icon = window.Icon;
  return (
    <>
      <SetHeader eyebrow="Account" title="Session access." sub="The active session is managed through the auth API."/>
      <div style={ss.profileCard}>
        <Icon.Monitor size={18} style={{ color: "var(--accent)" }}/>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, color: "var(--fg-0)", fontWeight: 500 }}>{user?.email || "Authenticated user"}</div>
          <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 2 }}>Current browser session</div>
        </div>
        <span className="chip chip-ok">This device</span>
      </div>
      <button className="btn btn-ghost" onClick={onLogout} style={{ color: "var(--err)", borderColor: "color-mix(in oklab, var(--err) 30%, var(--line))" }}>
        <Icon.LogOut size={13}/> Log out
      </button>
    </>
  );
};

const SetRow = ({ label, sub, children }) => (
  <div style={ss.row}>
    <div>
      <div style={{ fontSize: 13.5, color: "var(--fg-0)", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 2 }}>{sub}</div>
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

const Toggle = ({ on, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ ...ss.toggle, background: on ? "var(--accent)" : "var(--bg-3)" }}>
    <div style={{ ...ss.toggleKnob, left: on ? 18 : 2, background: on ? "var(--bg-0)" : "var(--fg-1)" }}/>
  </button>
);

const ss = {
  layout: { display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 57px)" },
  sidebar: { borderRight: "1px solid var(--line)", padding: "22px 12px", background: "var(--bg-1)" },
  sideLabel: { fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 10px 10px" },
  tab: { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: "var(--r-sm)", width: "100%", fontSize: 13, textAlign: "left", marginBottom: 1 },
  main: { padding: "40px 56px", maxWidth: 860, width: "100%" },
  eyebrow: { fontSize: 11, color: "var(--fg-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 },
  title: { fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 300, margin: "0 0 8px" },
  sub: { fontSize: 14, color: "var(--fg-2)", margin: 0, maxWidth: 580 },
  profileCard: { display: "flex", alignItems: "center", gap: 20, marginBottom: 28, padding: 20, border: "1px solid var(--line)", borderRadius: "var(--r-lg)", background: "var(--bg-1)" },
  avatar: { width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, var(--accent), var(--parchment))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 24, color: "var(--bg-0)" },
  rows: { display: "flex", flexDirection: "column", gap: 18 },
  row: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 18, borderBottom: "1px solid var(--line-soft)", gap: 40 },
  themeGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 },
  themeCard: { textAlign: "left", padding: 14, borderRadius: "var(--r-lg)", border: "1px solid", background: "var(--bg-1)" },
  themePreview: { height: 72, borderRadius: "var(--r-md)", border: "1px solid var(--line-soft)", marginBottom: 12 },
  toggle: { width: 36, height: 20, borderRadius: 10, border: "1px solid var(--line)", position: "relative", cursor: "pointer" },
  toggleKnob: { position: "absolute", top: 2, width: 14, height: 14, borderRadius: 7 },
  loading: { padding: 28, color: "var(--fg-2)" },
  error: { marginBottom: 16, padding: "10px 12px", border: "1px solid var(--err)", borderRadius: "var(--r-sm)", color: "var(--err)", fontSize: 12 },
};

window.Settings = Settings;
