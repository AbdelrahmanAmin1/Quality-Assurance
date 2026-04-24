// Quiz
const Quiz = ({ onNav }) => {
  const Icon = window.Icon;
  const [selected, setSelected] = React.useState(1);
  const [submitted, setSubmitted] = React.useState(true);

  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      <window.Topbar title="Midterm Prep Â· Data Structures" crumbs={['Quizzes']}
        right={<>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', border: '1px solid var(--line)', borderRadius: 'var(--r-sm)', fontSize: 12, color: 'var(--fg-2)' }}>
            <Icon.Clock size={12}/><span className="mono">18:42</span>
          </div>
          <span style={{ fontSize: 11.5, color: 'var(--fg-3)' }}>Question 4 / 12</span>
        </>}
      />
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 28px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 36 }}>
          {Array.from({ length: 12 }).map((_, k) => (
            <div key={k} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: k < 3 ? 'var(--ok)' : k === 3 ? 'var(--accent)' : 'var(--line)',
            }}/>
          ))}
        </div>

        <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
          Question 04 Â· Hash Tables Â· Medium
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, letterSpacing: '-0.015em', margin: '0 0 18px', lineHeight: 1.3 }}>
          A hash table with m = 8 slots uses separate chaining. After inserting 12 keys, what is the expected number of probes for a successful lookup?
        </h1>

        <div style={{ padding: 14, borderRadius: 'var(--r-md)', background: 'var(--bg-1)', border: '1px solid var(--line)', marginBottom: 24, fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--fg-1)' }}>
          Given: n = 12, m = 8 â†’ Î± = 1.5
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { l: '1 + Î±/2 = 1.75 probes', correct: true, reason: 'For successful lookup with chaining, expected probes â‰ˆ 1 + Î±/2. This accounts for walking half the expected chain on average.' },
            { l: '1.5 probes', wrong: true, partial: true, reason: 'Close â€” this is the full chain length. But on a successful hit, we only traverse half the chain on average.' },
            { l: '8 probes (worst case)', wrong: true },
            { l: 'O(1) â€” always 1 probe', wrong: true },
          ].map((o, i) => {
            const isSel = selected === i;
            const show = submitted;
            return (
              <button key={i} onClick={() => !submitted && setSelected(i)} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '14px 16px', borderRadius: 'var(--r-md)',
                border: `1px solid ${show && o.correct ? 'var(--ok)' : show && isSel && !o.correct ? 'var(--err)' : isSel ? 'var(--accent-soft)' : 'var(--line)'}`,
                background: show && o.correct ? 'color-mix(in oklab, var(--ok) 10%, transparent)' : show && isSel && !o.correct ? 'color-mix(in oklab, var(--err) 10%, transparent)' : isSel ? 'var(--accent-glow)' : 'var(--bg-1)',
                textAlign: 'left', transition: 'all 160ms var(--ease-out)',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 11, flexShrink: 0,
                  border: `1.5px solid ${show && o.correct ? 'var(--ok)' : isSel ? 'var(--accent)' : 'var(--line-strong)'}`,
                  background: show && o.correct ? 'var(--ok)' : isSel ? 'var(--accent)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                  color: 'var(--bg-0)',
                }}>
                  {show && o.correct ? <Icon.Check size={11}/> : show && isSel && !o.correct ? <Icon.X size={11} style={{ color: '#fff' }}/> : isSel ? <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--bg-0)' }}/> : null}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: 'var(--fg-0)' }}>{o.l}</div>
                  {show && (o.correct || (isSel && o.reason)) && (
                    <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.55, display: 'flex', gap: 8 }}>
                      <Icon.Sparkle size={11} style={{ color: o.correct ? 'var(--ok)' : 'var(--accent)', flexShrink: 0, marginTop: 3 }}/>
                      <span>{o.reason || 'This is the correct answer.'}</span>
                    </div>
                  )}
                </div>
                <span className="mono" style={{ fontSize: 10, color: 'var(--fg-3)' }}>{String.fromCharCode(65 + i)}</span>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div style={{ marginTop: 24, padding: 18, borderRadius: 'var(--r-lg)', background: 'var(--bg-1)', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Icon.Sparkle size={14} style={{ color: 'var(--accent)' }}/>
              <span style={{ fontSize: 12, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Close, but not quite</span>
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--fg-1)', lineHeight: 1.6 }}>
              You reached for Î± â€” good instinct. The subtle move: for <em>successful</em> lookups, we only walk half the chain on average. The full Î± applies to unsuccessful ones.
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" style={{ fontSize: 11.5 }}>Review this concept</button>
              <button className="btn btn-bare" style={{ fontSize: 11.5 }}>Mark for later</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36 }}>
          <button className="btn btn-bare"><Icon.ArrowLeft size={12}/> Previous</button>
          <button className="btn btn-accent">Next question <Icon.ArrowRight size={12}/></button>
        </div>
      </div>
    </div>
  );
};

window.Quiz = Quiz;
