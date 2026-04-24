// Collaboration study room
const Collab = ({ onNav }) => {
  const Icon = window.Icon;
  return (
    <div>
      <window.Topbar title="Study Room Â· Data Structures Crew" crumbs={['Rooms']}
        right={<>
          <div style={{ display: 'flex' }}>
            {['M', 'Y', 'L', 'R'].map((l, i) => (
              <div key={l} style={{
                width: 26, height: 26, borderRadius: 13,
                background: ['var(--accent)', 'var(--parchment)', 'var(--info)', 'var(--ok)'][i],
                color: 'var(--bg-0)', fontSize: 11, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid var(--bg-0)',
                marginLeft: i > 0 ? -8 : 0,
                fontFamily: 'var(--font-display)',
              }}>{l}</div>
            ))}
          </div>
          <button className="btn btn-ghost"><Icon.Link size={12}/> Invite</button>
          <button className="btn btn-accent"><Icon.Mic size={12}/> Voice on</button>
        </>}
      />
      <div style={co.layout}>
        <aside style={co.members}>
          <div style={{ padding: 18, borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>In session</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400 }}>Focus Sprint</div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-2)', marginTop: 4 }}>25 min Â· pomodoro</div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', width: 64, height: 64 }}>
                <svg viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="32" cy="32" r="26" stroke="var(--line)" strokeWidth="4" fill="none"/>
                  <circle cx="32" cy="32" r="26" stroke="var(--accent)" strokeWidth="4" fill="none"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * 0.32}
                    strokeLinecap="round"/>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 16 }}>17:02</div>
              </div>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}><Icon.Pause size={11}/> Pause</button>
            </div>
          </div>

          <div style={{ padding: '14px 16px', fontSize: 10.5, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Members Â· 4</div>
          <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { n: 'Maya (you)', s: 'Hash Tables ch.5', dot: 'var(--ok)' },
              { n: 'Yusuf Khalil', s: 'Flashcards Â· 12/18', dot: 'var(--ok)' },
              { n: 'Layla Amr', s: 'Stepped away', dot: 'var(--warn)' },
              { n: 'Ravi Patel', s: 'In tutor Â· Linked Lists', dot: 'var(--ok)' },
            ].map((m, i) => (
              <div key={i} style={co.member}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: ['var(--accent)', 'var(--parchment)', 'var(--info)', 'var(--ok)'][i], color: 'var(--bg-0)', fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.n[0]}</div>
                  <span style={{ position: 'absolute', bottom: -2, right: -2, width: 8, height: 8, borderRadius: 4, background: m.dot, border: '2px solid var(--bg-0)' }}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-0)', fontWeight: 500 }}>{m.n}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--fg-3)' }}>{m.s}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main style={co.board}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--fg-0)', fontWeight: 500 }}>Shared notes Â· Hash Tables practice</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>Maya, Yusuf, Ravi editing</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-bare"><Icon.PenNib size={13}/></button>
              <button className="btn btn-bare"><Icon.Code size={13}/></button>
              <button className="btn btn-bare"><Icon.Sparkle size={13}/></button>
            </div>
          </div>

          <div style={{ padding: 32, maxWidth: 760, margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 90, right: 90, display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 2l5 12 2-5 5-2z" fill="var(--info)"/></svg>
              <span style={{ fontSize: 10, background: 'var(--info)', color: 'var(--bg-0)', padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>Yusuf</span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, margin: '0 0 16px' }}>Problem set 4 â€” warm-up</h2>

            <div style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--fg-1)' }}>
              <p><b style={{ color: 'var(--fg-0)' }}>Q1.</b> Trace a hash table with m = 8 inserting keys <code style={co.code}>[5, 28, 19, 15, 20, 33, 12, 17]</code> with h(k) = k mod 8, using linear probing.</p>
              <p style={{ color: 'var(--fg-0)' }}>Let's work through it together â†’</p>

              <div style={co.grid}>
                {[0,1,2,3,4,5,6,7].map(i => {
                  const filled = { 0: 8, 1: null, 2: 28, 3: 19, 4: 20, 5: 5, 6: 33, 7: 15 }[i];
                  const highlight = i === 4 || i === 5;
                  return (
                    <div key={i} style={{
                      height: 60, border: `1px solid ${highlight ? 'var(--accent)' : 'var(--line)'}`,
                      borderRadius: 'var(--r-sm)',
                      background: highlight ? 'var(--accent-glow)' : 'var(--bg-1)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      position: 'relative',
                    }}>
                      <span className="mono" style={{ fontSize: 9, color: 'var(--fg-3)', position: 'absolute', top: 4, left: 4 }}>{i}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>{filled ?? 'â€”'}</span>
                    </div>
                  );
                })}
              </div>

              <div style={co.chatLine}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--parchment)', color: 'var(--bg-0)', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Y</div>
                <div style={{ fontSize: 12.5, color: 'var(--fg-1)' }}>wait â€” <b style={{ color: 'var(--fg-0)' }}>12 mod 8 = 4</b>, but slot 4 has 20. Probe to 5? That's also taken (5).</div>
              </div>
              <div style={co.chatLine}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--accent)', color: 'var(--bg-0)', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>M</div>
                <div style={{ fontSize: 12.5, color: 'var(--fg-1)' }}>yeah â€” linear probing goes to slot 6 next. but 6 is 33. so <b>12 ends up at slot 1</b>?</div>
              </div>
              <div style={co.chatLine}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--accent-glow)', border: '1px solid var(--accent-soft)', color: 'var(--accent)', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.Sparkle size={10}/></div>
                <div style={{ fontSize: 12.5, color: 'var(--fg-1)' }}>Almost. After 6 you'd try 7 (15), then wrap to 0 (8). Slot 1 is the first empty. <span style={{ color: 'var(--accent)' }}>Good chain â€” you're seeing the clustering effect.</span></div>
              </div>
            </div>
          </div>
        </main>

        <aside style={co.voice}>
          <div style={{ padding: 16, borderBottom: '1px solid var(--line)' }}>
            <div style={{ fontSize: 10.5, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Voice Â· 3 talking</div>
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['Yusuf K.', 'Maya (you)', 'Ravi P.'].map((n, i) => (
              <div key={n} style={co.voiceRow}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: ['var(--parchment)', 'var(--accent)', 'var(--ok)'][i], color: 'var(--bg-0)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)' }}>{n[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--fg-0)' }}>{n}</div>
                  <div style={{ display: 'flex', gap: 2, marginTop: 4, alignItems: 'flex-end', height: 12 }}>
                    {Array.from({ length: 14 }).map((_, k) => (
                      <div key={k} style={{ flex: 1, height: (i === 1 ? 3 : Math.sin(k + i) * 5 + 7) + 'px', background: 'var(--accent)', borderRadius: 1, opacity: i === 1 ? 0.3 : 0.7 }}/>
                    ))}
                  </div>
                </div>
                {i === 0 && <Icon.Mic size={12} style={{ color: 'var(--accent)' }}/>}
              </div>
            ))}
          </div>

          <div style={{ padding: 16, borderTop: '1px solid var(--line)', marginTop: 'auto' }}>
            <div style={{ fontSize: 10.5, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Session goal</div>
            <div style={{ fontSize: 12.5, color: 'var(--fg-1)', lineHeight: 1.5 }}>Finish PS4 Q1â€“Q3 on hash collisions before 20:00.</div>
            <div style={{ marginTop: 10, height: 3, background: 'var(--line)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: '40%', background: 'var(--accent)', borderRadius: 2 }}/>
            </div>
            <div style={{ marginTop: 6, fontSize: 10.5, color: 'var(--fg-3)' }} className="mono">Q1 solved Â· Q2 in progress</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const co = {
  layout: { display: 'grid', gridTemplateColumns: '260px 1fr 260px', minHeight: 'calc(100vh - 57px)' },
  members: { borderRight: '1px solid var(--line)', background: 'var(--bg-0)' },
  board: { background: 'var(--bg-0)', overflow: 'auto' },
  voice: { borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column', background: 'var(--bg-0)' },
  member: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 'var(--r-sm)' },
  code: { fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg-2)', padding: '1px 5px', borderRadius: 3 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6, margin: '18px 0' },
  chatLine: { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0' },
  voiceRow: { display: 'flex', alignItems: 'center', gap: 10 },
};

window.Collab = Collab;
