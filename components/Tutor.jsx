// AI Tutor workspace — a learning workspace, NOT a chat app.
// Three-column: concept timeline · active lesson · thinking trace / notes
const Tutor = ({ onNav }) => {
  const Icon = window.Icon;
  const [step, setStep] = React.useState(2);
  const [mode, setMode] = React.useState('socratic'); // socratic | explain | example
  const [answered, setAnswered] = React.useState([true, true, false, false, false]);

  const lesson = {
    title: 'Hash Tables: Why O(1) is a polite lie',
    concept: 'Amortized analysis & load factor',
    steps: [
      { t: 'Warm-up', q: 'If lookup is O(1), why does Java\'s HashMap need to grow?' },
      { t: 'Intuition', q: 'Picture 1000 keys in 16 slots. What happens to chain length?' },
      { t: 'The trick', q: 'What\'s the expected chain length after n insertions into m slots?', active: true },
      { t: 'Formalize', q: 'Define load factor α. When does open addressing fail?' },
      { t: 'Apply', q: 'Implement resize() — when to trigger, what to copy.' },
    ],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <window.Topbar
        title={lesson.title}
        crumbs={['AI Tutor', 'Data Structures']}
        right={<>
          <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--bg-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--line)' }}>
            {[
              { id: 'socratic', label: 'Socratic', icon: 'Brain' },
              { id: 'explain', label: 'Explain', icon: 'Lightbulb' },
              { id: 'example', label: 'Example', icon: 'Code' },
            ].map(m => {
              const C = Icon[m.icon];
              return (
                <button key={m.id} onClick={() => setMode(m.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 10px', fontSize: 11.5,
                  background: mode === m.id ? 'var(--bg-0)' : 'transparent',
                  color: mode === m.id ? 'var(--fg-0)' : 'var(--fg-2)',
                  borderRadius: 6,
                }}>
                  <C size={12}/>{m.label}
                </button>
              );
            })}
          </div>
          <button className="btn btn-ghost"><Icon.Pause size={11}/> Pause</button>
        </>}
      />

      <div style={tu.layout}>
        {/* Left: lesson timeline */}
        <aside style={tu.timeline}>
          <div style={{ padding: '20px 20px 10px' }}>
            <div style={{ fontSize: 10.5, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Session plan</div>
            <div style={{ fontSize: 13, color: 'var(--fg-1)', marginTop: 6 }}>{lesson.concept}</div>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 27, top: 18, bottom: 18, width: 1, background: 'var(--line)' }}/>
            {lesson.steps.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <button key={i} onClick={() => setStep(i)} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  padding: '10px 10px', borderRadius: 'var(--r-sm)',
                  background: active ? 'var(--bg-2)' : 'transparent',
                  textAlign: 'left', position: 'relative',
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 10, flexShrink: 0,
                    border: `1.5px solid ${done ? 'var(--accent)' : active ? 'var(--accent)' : 'var(--line-strong)'}`,
                    background: done ? 'var(--accent)' : active ? 'var(--bg-0)' : 'var(--bg-1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: done ? 'var(--bg-0)' : 'var(--accent)',
                    zIndex: 1,
                    marginTop: 2,
                  }}>
                    {done ? <Icon.Check size={11}/> : active ? <div style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--accent)', animation: 'pulse-soft 1.8s infinite' }}/> : <span className="mono" style={{ fontSize: 10, color: 'var(--fg-3)' }}>{i + 1}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                    <div style={{ fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? 'var(--accent)' : 'var(--fg-3)' }}>{s.t}</div>
                    <div style={{ fontSize: 12.5, color: active ? 'var(--fg-0)' : done ? 'var(--fg-2)' : 'var(--fg-3)', marginTop: 3, lineHeight: 1.4 }}>{s.q}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 'auto', padding: 14, borderTop: '1px solid var(--line)' }}>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 6 }}>Session time</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 300 }}>12:34</span>
              <span style={{ fontSize: 11, color: 'var(--fg-3)' }}>/ 20:00</span>
            </div>
          </div>
        </aside>

        {/* Center: active lesson */}
        <main style={tu.workspace}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 40px' }}>
            <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Step 03 · The trick</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 18px', lineHeight: 1.2 }}>
              What's the expected chain length after <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>n</em> insertions into <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>m</em> slots?
            </h1>

            {/* Interactive visualization */}
            <div style={tu.vizCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Hash table · 16 slots · 24 keys</span>
                <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--fg-2)' }} className="mono">
                  <span>α = n/m = 1.5</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: 3 }}>
                {Array.from({ length: 16 }).map((_, i) => {
                  const chain = [1, 2, 0, 1, 3, 1, 2, 1, 2, 0, 2, 1, 1, 2, 3, 2][i];
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <div style={{ height: 6 + chain * 14, width: 16, background: chain > 2 ? 'var(--warn)' : chain > 0 ? 'var(--accent)' : 'var(--line)', borderRadius: 2, transition: 'height 400ms var(--ease-out)' }}/>
                      <span className="mono" style={{ fontSize: 8.5, color: 'var(--fg-3)' }}>{i}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: 'var(--fg-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon.Sparkle size={12} style={{ color: 'var(--accent)' }}/>
                <span>Drag α to see what happens at 2.5× load…</span>
              </div>
            </div>

            {/* Tutor prompt */}
            <div style={{ marginTop: 28 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={tu.tutorAvatar}><Icon.Sparkle size={13} style={{ color: 'var(--accent)' }}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: 'var(--fg-0)', lineHeight: 1.65 }}>
                    Good — so if α = 1.5, what's the <em>expected</em> work per lookup? Don't compute; reason from the picture.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 18, paddingLeft: 34 }}>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Pick what feels right</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { l: 'Exactly 1, because hash tables are O(1)', off: true },
                    { l: 'Around 1.5 — we expect ~α chain walks on average', correct: true },
                    { l: 'log n, like a balanced tree', off: true },
                    { l: 'It depends on the key', partial: true },
                  ].map((opt, i) => (
                    <button key={i} style={{
                      ...tu.choice,
                      borderColor: opt.correct ? 'var(--accent-soft)' : 'var(--line)',
                      background: opt.correct ? 'var(--accent-glow)' : 'var(--bg-1)',
                    }}>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', width: 14 }}>{String.fromCharCode(65 + i)}</span>
                      <span style={{ flex: 1, fontSize: 13, color: 'var(--fg-0)' }}>{opt.l}</span>
                      {opt.correct && <Icon.Check size={13} style={{ color: 'var(--accent)' }}/>}
                    </button>
                  ))}
                </div>

                {/* Answer feedback */}
                <div style={tu.feedback}>
                  <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Why it works</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.65 }}>
                    Exactly. If we assume uniform hashing, each slot gets <code style={tu.code}>n/m = α</code> keys on average. Since a lookup walks one chain, expected work is proportional to α — constant only if α stays bounded. That's why Java resizes when α exceeds 0.75.
                  </div>
                </div>
              </div>

              {/* Next step */}
              <div style={{ marginTop: 24, display: 'flex', gap: 10, paddingLeft: 34 }}>
                <button className="btn btn-accent" onClick={() => setStep(Math.min(4, step + 1))}>
                  Continue — Formalize <Icon.ArrowRight size={12}/>
                </button>
                <button className="btn btn-ghost">
                  <Icon.Lightbulb size={12}/> Explain differently
                </button>
                <button className="btn btn-bare">
                  <Icon.Bookmark size={12}/> Save to notes
                </button>
              </div>
            </div>

            {/* Code sandbox */}
            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Sandbox · edit & run</div>
              <div style={tu.sandbox}>
                <pre style={tu.pre}>
{`void insert(K key, V val) {
    int i = hash(key) % m;
    buckets[i].add(new Entry(key, val));
    n++;
    if ((double) n / m > 0.75) resize();  // ← tutor: why this threshold?
}`}
                </pre>
              </div>
            </div>
          </div>
        </main>

        {/* Right: thinking trace + notes */}
        <aside style={tu.rail}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', gap: 2, padding: 2, background: 'var(--bg-2)', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)' }}>
              {['Trace', 'Notes', 'Sources'].map((t, i) => (
                <button key={t} style={{
                  flex: 1, padding: '5px 8px', fontSize: 11.5,
                  background: i === 1 ? 'var(--bg-0)' : 'transparent',
                  color: i === 1 ? 'var(--fg-0)' : 'var(--fg-2)',
                  borderRadius: 4,
                }}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ padding: 18, overflow: 'auto', flex: 1 }}>
            <div style={{ fontSize: 10.5, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Your notebook</div>

            <div style={tu.noteEntry}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', marginBottom: 4 }}>11:02 · Step 1</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-1)', lineHeight: 1.55 }}>
                <b style={{ color: 'var(--fg-0)' }}>Key idea:</b> O(1) is expected, not guaranteed. The hash function's distribution matters.
              </div>
            </div>

            <div style={tu.noteEntry}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', marginBottom: 4 }}>11:08 · Step 2</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-1)', lineHeight: 1.55 }}>
                Chains get longer as α grows. Visualization helped — I was thinking of it as a flat array before.
              </div>
            </div>

            <div style={{ ...tu.noteEntry, borderLeft: '2px solid var(--accent)', paddingLeft: 10 }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', marginBottom: 4 }}>11:14 · Step 3 · just now</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-1)', lineHeight: 1.55 }}>
                <b style={{ color: 'var(--fg-0)' }}>Load factor α = n/m.</b> Expected chain length ≈ α. O(1) requires bounded α → hence resize at 0.75.
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <span className="chip chip-accent">flashcard-worthy</span>
              </div>
            </div>

            <button style={tu.addNote}>
              <Icon.Plus size={12}/> Add your own note
            </button>

            <div style={{ marginTop: 24, padding: 12, borderRadius: 'var(--r-md)', background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Will be auto-generated</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--fg-1)' }}>
                  <Icon.Cards size={12} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}/>
                  <span>3 flashcards on load factor</span>
                </div>
                <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--fg-1)' }}>
                  <Icon.Target size={12} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}/>
                  <span>1 quiz question on resize threshold</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: 14, borderTop: '1px solid var(--line)', display: 'flex', gap: 8 }}>
            <input className="input" placeholder="Ask a clarifying question…" style={{ flex: 1, fontSize: 12.5 }}/>
            <button className="btn btn-bare" style={{ padding: 8 }}><Icon.Send size={14}/></button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const tu = {
  layout: { display: 'grid', gridTemplateColumns: '280px 1fr 340px', flex: 1, minHeight: 'calc(100vh - 57px)' },
  timeline: { borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', background: 'var(--bg-0)' },
  workspace: { overflow: 'auto', background: 'var(--bg-0)' },
  rail: { borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', background: 'var(--bg-0)' },
  vizCard: {
    padding: 20, borderRadius: 'var(--r-lg)',
    background: 'var(--bg-1)', border: '1px solid var(--line)',
    marginTop: 20,
  },
  tutorAvatar: {
    width: 28, height: 28, borderRadius: 8,
    background: 'var(--accent-glow)', border: '1px solid var(--accent-soft)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  choice: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 14px', borderRadius: 'var(--r-md)',
    border: '1px solid',
    textAlign: 'left',
    transition: 'all 160ms var(--ease-out)',
  },
  feedback: {
    marginTop: 16, padding: 14,
    borderRadius: 'var(--r-md)',
    background: 'var(--bg-1)', border: '1px solid var(--line)',
    borderLeft: '2px solid var(--accent)',
  },
  code: { fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg-2)', padding: '1px 5px', borderRadius: 3, color: 'var(--fg-0)' },
  sandbox: { borderRadius: 'var(--r-md)', background: 'var(--bg-1)', border: '1px solid var(--line)', overflow: 'hidden' },
  pre: { fontFamily: 'var(--font-mono)', fontSize: 12.5, padding: 18, margin: 0, lineHeight: 1.65, color: 'var(--fg-0)' },
  noteEntry: { marginBottom: 16 },
  addNote: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 10px', borderRadius: 'var(--r-sm)',
    color: 'var(--fg-3)', fontSize: 12,
    width: '100%',
    border: '1px dashed var(--line-strong)',
    justifyContent: 'center',
    marginTop: 4,
  },
};

window.Tutor = Tutor;
