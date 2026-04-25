// Settings and account management
const Settings = ({ theme, setTheme, user, onLogout }) => {
  const Icon = window.Icon;
  const [tab, setTab] = React.useState('profile');
  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'Users' },
    { id: 'learning', label: 'Learning style', icon: 'Brain' },
    { id: 'appearance', label: 'Appearance', icon: 'Palette' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'integrations', label: 'Integrations', icon: 'Link' },
    { id: 'data', label: 'Data & privacy', icon: 'Lock' },
    { id: 'account', label: 'Account', icon: 'LogOut' },
  ];

  return (
    <div>
      <window.Topbar title="Settings"/>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - 57px)' }}>
        <aside style={{ borderRight: '1px solid var(--line)', padding: '22px 12px', background: 'var(--bg-1)' }}>
          <div style={{ fontSize: 10.5, color: 'var(--fg-3)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 10px 10px' }}>Settings</div>
          {tabs.map(t => {
            const C = Icon[t.icon];
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 'var(--r-sm)',
                background: active ? 'var(--bg-2)' : 'transparent',
                color: active ? 'var(--fg-0)' : 'var(--fg-2)',
                width: '100%', fontSize: 13, textAlign: 'left',
                marginBottom: 1,
                transition: 'all 140ms var(--ease-out)',
              }}>
                <C size={14}/> {t.label}
              </button>
            );
          })}
        </aside>
        <main style={{ padding: '40px 56px', maxWidth: 820, width: '100%' }} key={tab} className="fade-in">
          {tab === 'profile' && <ProfileTab user={user}/>}
          {tab === 'learning' && <LearningTab/>}
          {tab === 'appearance' && <AppearanceTab theme={theme} setTheme={setTheme}/>}
          {tab === 'notifications' && <NotifTab/>}
          {tab === 'integrations' && <IntegrationsTab/>}
          {tab === 'data' && <DataTab/>}
          {tab === 'account' && <AccountTab onLogout={onLogout}/>}
        </main>
      </div>
    </div>
  );
};

const SetHeader = ({ eyebrow, title, sub }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>{eyebrow}</div>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 8px' }}>{title}</h1>
    <p style={{ fontSize: 14, color: 'var(--fg-2)', margin: 0, maxWidth: 540 }}>{sub}</p>
  </div>
);

const ProfileTab = ({ user }) => {
  const Icon = window.Icon;
  const displayName = user?.name || user?.email || 'Signed-in user';
  const email = user?.email || 'Authenticated session';
  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || 'U';
  return (
    <>
      <SetHeader eyebrow="Profile" title="Your learning persona." sub="How NoÄ“sis addresses you and what it remembers across sessions."/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, padding: 20, border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', background: 'var(--bg-1)' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, var(--accent), var(--parchment))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--bg-0)' }}>{avatarLetter}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, color: 'var(--fg-0)', fontWeight: 500 }}>{displayName}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 2 }}>{email}</div>
        </div>
        <button className="btn btn-ghost">Change photo</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <SetRow label="Display name" sub="How the tutor addresses you."><input className="input" value={user?.name || ''} readOnly style={{ width: 220 }}/></SetRow>
        <SetRow label="Email" sub="Used for authentication."><input className="input" value={user?.email || ''} readOnly style={{ width: 220 }}/></SetRow>
        <SetRow label="Profile source" sub="Loaded from the authenticated backend session."><input className="input" value="Backend session" readOnly style={{ width: 220 }}/></SetRow>
      </div>
    </>
  );
};

const LearningTab = () => (
  <>
    <SetHeader eyebrow="Learning style" title="How do you learn best?" sub="These shape how the tutor explains, what it shows first, and when it switches modes."/>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SetRow label="Tutor default mode" sub="What the tutor does when you start a session.">
        <Segmented options={['Socratic', 'Explain first', 'Show example']} value={0}/>
      </SetRow>
      <SetRow label="Challenge level" sub="How hard should the tutor push when you're almost there?">
        <input type="range" min="1" max="5" defaultValue="3" style={{ width: 200, accentColor: 'var(--accent)' }}/>
      </SetRow>
      <SetRow label="Voice mode" sub="Read explanations aloud during Socratic steps."><Toggle on={false}/></SetRow>
      <SetRow label="Flashcard daily limit" sub="NoÄ“sis won't show more than this in a day.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input className="input mono" defaultValue="30" style={{ width: 80, textAlign: 'center' }}/>
          <span style={{ fontSize: 12, color: 'var(--fg-2)' }}>cards</span>
        </div>
      </SetRow>
      <SetRow label="Weekly review day" sub="When NoÄ“sis sends your summary.">
        <div style={{ display: 'flex', gap: 2 }}>
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <button key={i} style={{
              width: 28, height: 28, borderRadius: 6, fontSize: 11,
              background: i === 0 ? 'var(--accent)' : 'var(--bg-2)',
              color: i === 0 ? 'var(--bg-0)' : 'var(--fg-2)',
              border: '1px solid ' + (i === 0 ? 'var(--accent)' : 'var(--line)'),
            }}>{d}</button>
          ))}
        </div>
      </SetRow>
      <SetRow label="Forgetting curve aggression" sub="How soon the system resurfaces 'shaky' cards.">
        <Segmented options={['Gentle', 'Balanced', 'Aggressive']} value={1}/>
      </SetRow>
    </div>
  </>
);

const AppearanceTab = ({ theme, setTheme }) => {
  const Icon = window.Icon;
  const themes = [
    { id: 'dark', label: 'Cosmic', sub: 'Indigo & violet on deep space â€” matches the brand.', preview: ['#08081a', '#1b1b3a', '#a5b4fc', '#c99afc'] },
    { id: 'studious', label: 'Studious', sub: 'Warm off-white on near-black, bronze accent.', preview: ['#0b0a09', '#1a1917', '#c9a96a', '#e8dcc0'] },
    { id: 'light', label: 'Refined', sub: 'Parchment + sage. Calm daylight for long reads.', preview: ['#f6f3ec', '#ffffff', '#6b7f5a', '#d7cdb1'] },
    { id: 'space', label: 'Violet', sub: 'Deeper purples with a nebula glow.', preview: ['#0a0a18', '#1e1e42', '#c99afc', '#8ac9ff'] },
  ];
  return (
    <>
      <SetHeader eyebrow="Appearance" title="Make it feel like yours." sub="The whole app updates instantly â€” pick a theme, density, and motion preference."/>

      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Theme</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {themes.map(t => {
            const active = theme === t.id;
            return (
              <button key={t.id} onClick={() => setTheme(t.id)} style={{
                textAlign: 'left', padding: 14,
                borderRadius: 'var(--r-lg)',
                border: '1px solid ' + (active ? 'var(--accent-soft)' : 'var(--line)'),
                background: 'var(--bg-1)',
                boxShadow: active ? 'var(--shadow-glow)' : 'none',
                transition: 'all 180ms var(--ease-out)',
                position: 'relative',
              }}>
                <div style={{
                  height: 72, borderRadius: 'var(--r-md)',
                  background: `linear-gradient(135deg, ${t.preview[0]} 0%, ${t.preview[1]} 60%, ${t.preview[2]} 100%)`,
                  border: '1px solid var(--line-soft)',
                  marginBottom: 12, position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', bottom: 10, left: 10, width: 22, height: 22, borderRadius: 11, background: t.preview[2] }}/>
                  <div style={{ position: 'absolute', bottom: 10, left: 36, width: 14, height: 14, borderRadius: 7, background: t.preview[3], opacity: 0.7 }}/>
                  <div style={{ position: 'absolute', top: 10, right: 10, padding: '2px 8px', background: 'rgba(255,255,255,0.08)', borderRadius: 6, fontSize: 9.5, color: t.preview[3], fontFamily: 'var(--font-mono)' }}>AA</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500, color: 'var(--fg-0)' }}>{t.label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--fg-2)', marginTop: 2, maxWidth: 260 }}>{t.sub}</div>
                  </div>
                  {active && <Icon.Check size={16} style={{ color: 'var(--accent)' }}/>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <SetRow label="Density" sub="Trade information for breathing room.">
          <Segmented options={['Compact', 'Default', 'Comfortable']} value={1}/>
        </SetRow>
        <SetRow label="Font size" sub="Body text scale across the app.">
          <Segmented options={['Small', 'Default', 'Large']} value={1}/>
        </SetRow>
        <SetRow label="3D & motion" sub="Animations, floating geometry, and hover physics.">
          <Toggle on={true}/>
        </SetRow>
        <SetRow label="Reduce transparency" sub="Remove blur behind nav and overlays.">
          <Toggle on={false}/>
        </SetRow>
        <SetRow label="Sidebar width" sub="">
          <input type="range" min="220" max="320" defaultValue="240" style={{ width: 180, accentColor: 'var(--accent)' }}/>
        </SetRow>
      </div>
    </>
  );
};

const NotifTab = () => (
  <>
    <SetHeader eyebrow="Notifications" title="When should NoÄ“sis speak up?" sub="Quiet by default. The system will only ping you for things you'd want to know."/>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SetRow label="Daily reminder" sub="A nudge when there are cards due.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Toggle on={true}/>
          <input className="input mono" defaultValue="19:30" style={{ width: 90 }}/>
        </div>
      </SetRow>
      <SetRow label="Weekly review email" sub="Sundays, summarizing the week."><Toggle on={true}/></SetRow>
      <SetRow label="Study room invites" sub=""><Toggle on={true}/></SetRow>
      <SetRow label="Mastery milestones" sub="When you cross a concept threshold."><Toggle on={false}/></SetRow>
      <SetRow label="Sound" sub="Subtle chime on reminder."><Toggle on={false}/></SetRow>
    </div>
  </>
);

const IntegrationsTab = () => {
  const items = [
    { t: 'Google Drive', d: 'Import lectures & PDFs directly.', connected: true },
    { t: 'Notion', d: 'Two-way sync for notes.', connected: false },
    { t: 'Canvas LMS', d: 'Pull assignments and deadlines.', connected: true },
    { t: 'Zotero', d: 'Bring in your research library.', connected: false },
  ];
  return (
    <>
      <SetHeader eyebrow="Integrations" title="Where your materials live." sub="Connect NoÄ“sis to the tools you already use â€” study wherever you are."/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(i => (
          <div key={i.t} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, border: '1px solid var(--line)', borderRadius: 'var(--r-md)', background: 'var(--bg-1)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--accent)' }}>{i.t[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, color: 'var(--fg-0)', fontWeight: 500 }}>{i.t}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 2 }}>{i.d}</div>
            </div>
            <button className={i.connected ? 'btn btn-ghost' : 'btn btn-accent'}>{i.connected ? 'Connected' : 'Connect'}</button>
          </div>
        ))}
      </div>
    </>
  );
};

const DataTab = () => (
  <>
    <SetHeader eyebrow="Data & privacy" title="Your materials, your ownership." sub="NoÄ“sis keeps your data encrypted and never trains on it. Export anytime."/>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <SetRow label="Training on my data" sub="Keep off â€” we never do this."><Toggle on={false}/></SetRow>
      <SetRow label="Export all data" sub="JSON bundle of materials, notes, and progress."><button className="btn btn-ghost">Request export</button></SetRow>
      <SetRow label="Delete account" sub="Wipes everything. Can't be undone."><button className="btn btn-ghost" style={{ color: 'var(--err)', borderColor: 'color-mix(in oklab, var(--err) 30%, var(--line))' }}>Deleteâ€¦</button></SetRow>
    </div>
  </>
);

const AccountTab = ({ onLogout }) => {
  const Icon = window.Icon;
  return (
    <>
      <SetHeader eyebrow="Account" title="Session & access." sub="Manage devices, sign out, or switch accounts."/>
      <div style={{ padding: 16, border: '1px solid var(--line)', borderRadius: 'var(--r-md)', background: 'var(--bg-1)', marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Active sessions</div>
        {[
          { d: 'MacBook Pro Â· Safari', l: 'Cairo Â· now', c: true },
          { d: 'iPhone 15 Â· NoÄ“sis app', l: 'Cairo Â· 2h ago', c: false },
          { d: 'iPad Â· Safari', l: 'Alexandria Â· 3d ago', c: false },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i > 0 ? '1px solid var(--line-soft)' : 'none' }}>
            <Icon.Monitor size={14} style={{ color: 'var(--fg-2)' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--fg-0)' }}>{s.d}{s.c && <span className="chip chip-ok" style={{ marginLeft: 8 }}>This device</span>}</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>{s.l}</div>
            </div>
            {!s.c && <button className="btn btn-bare" style={{ fontSize: 12 }}>Sign out</button>}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost">Change password</button>
        <button className="btn btn-ghost" onClick={onLogout} style={{ color: 'var(--err)', borderColor: 'color-mix(in oklab, var(--err) 30%, var(--line))', marginLeft: 'auto' }}>
          <Icon.LogOut size={13}/> Log out of NoÄ“sis
        </button>
      </div>
    </>
  );
};

const Segmented = ({ options, value }) => (
  <div style={{ display: 'flex', gap: 4, padding: 2, background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)' }}>
    {options.map((m, i) => (
      <button key={m} style={{
        padding: '6px 12px', fontSize: 12,
        background: i === value ? 'var(--bg-0)' : 'transparent',
        color: i === value ? 'var(--fg-0)' : 'var(--fg-2)',
        borderRadius: 4,
      }}>{m}</button>
    ))}
  </div>
);

const SetRow = ({ label, sub, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 18, borderBottom: '1px solid var(--line-soft)', gap: 40 }}>
    <div>
      <div style={{ fontSize: 13.5, color: 'var(--fg-0)', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 2 }}>{sub}</div>
    </div>
    <div style={{ flexShrink: 0 }}>{children}</div>
  </div>
);

const Toggle = ({ on }) => (
  <div style={{
    width: 36, height: 20, borderRadius: 10,
    background: on ? 'var(--accent)' : 'var(--bg-3)',
    border: '1px solid var(--line)',
    position: 'relative', cursor: 'pointer',
    transition: 'background 180ms var(--ease-out)',
  }}>
    <div style={{
      position: 'absolute', top: 2, left: on ? 18 : 2,
      width: 14, height: 14, borderRadius: 7,
      background: on ? 'var(--bg-0)' : 'var(--fg-1)',
      transition: 'left 180ms var(--ease-out)',
    }}/>
  </div>
);

window.Settings = Settings;
