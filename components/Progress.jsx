// Progress analytics
const Progress = ({ onNav }) => {
  const Icon = window.Icon;
  return (
    <div>
      <window.Topbar title="Progress" crumbs={['Analytics']}
        right={<><button className="btn btn-ghost">Last 30 days <Icon.ChevronDown size={11}/></button></>}
      />
      <div style={{ padding: 28, maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>The long view</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, letterSpacing: '-0.02em', margin: 0 }}>
            You're <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>noticeably</em> better at this than you were six weeks ago.
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { l: 'Mastery', v: '72%', d: 'of tracked concepts', t: '+18%', c: 'var(--ok)' },
            { l: 'Retention', v: '84%', d: '30-day recall', t: '+6%', c: 'var(--accent)' },
            { l: 'Focus time', v: '42h', d: 'this month', t: '+11h', c: 'var(--parchment)' },
            { l: 'Streak', v: '12d', d: 'current', t: 'Best: 18d', c: 'var(--warn)' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: 22 }}>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>{s.l}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 300, color: s.c }}>{s.v}</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-2)', marginTop: 4 }}>{s.d}</div>
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line)' }}>{s.t}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 22, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--fg-0)', fontWeight: 500 }}>Mastery over time</div>
              <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginTop: 2 }}>Daily rolling average across all concepts</div>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--fg-2)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 2, background: 'var(--accent)' }}/>Mastery</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 2, background: 'var(--fg-3)', opacity: 0.4 }}/>Retention</span>
            </div>
          </div>
          <MasteryChart/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 13, color: 'var(--fg-0)', fontWeight: 500, marginBottom: 4 }}>Concept mastery by topic</div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-3)', marginBottom: 20 }}>Hover to see when each concept was last reviewed.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { t: 'Arrays & Complexity', m: 95, cards: 24 },
                { t: 'Linked Lists', m: 78, cards: 18 },
                { t: 'Stacks & Queues', m: 88, cards: 14 },
                { t: 'Hash Tables', m: 48, cards: 22, attention: true },
                { t: 'Trees & BSTs', m: 32, cards: 16, attention: true },
                { t: 'Heaps', m: 21, cards: 8, attention: true },
                { t: 'Graphs', m: 14, cards: 6 },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 140, fontSize: 12.5, color: 'var(--fg-1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {c.attention && <span style={{ width: 5, height: 5, borderRadius: 3, background: 'var(--warn)' }}/>}
                    <span style={{ flex: 1 }}>{c.t}</span>
                  </div>
                  <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--bg-2)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: c.m + '%',
                      background: c.m > 70 ? 'var(--ok)' : c.m > 45 ? 'var(--accent)' : 'var(--warn)',
                      borderRadius: 4,
                    }}/>
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--fg-2)', width: 30, textAlign: 'right' }}>{c.m}%</span>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--fg-3)', width: 50, textAlign: 'right' }}>{c.cards} cards</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontSize: 13, color: 'var(--fg-0)', fontWeight: 500, marginBottom: 20 }}>Study activity Â· past 12 weeks</div>
            <Heatmap/>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 10.5, color: 'var(--fg-3)' }}>
              <span>Less</span>
              {[0, 1, 2, 3, 4].map(v => (
                <span key={v} style={{ width: 10, height: 10, borderRadius: 2, background: v === 0 ? 'var(--bg-2)' : `color-mix(in oklab, var(--accent) ${v * 22}%, transparent)` }}/>
              ))}
              <span>More</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 22, marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Weekly review Â· Apr 14â€“21</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400 }}>What NoÄ“sis would say to your past self.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ padding: 16, borderRadius: 'var(--r-md)', background: 'var(--bg-2)' }}>
              <div style={{ fontSize: 11, color: 'var(--ok)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>â†‘ What's working</div>
              <div style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.6 }}>Evening Socratic sessions hit 92% retention vs 71% for morning flashcards. Keep the late-night rhythm for concepts you're struggling with.</div>
            </div>
            <div style={{ padding: 16, borderRadius: 'var(--r-md)', background: 'var(--bg-2)' }}>
              <div style={{ fontSize: 11, color: 'var(--warn)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>âš  Watch out</div>
              <div style={{ fontSize: 13, color: 'var(--fg-1)', lineHeight: 1.6 }}>You've skipped reviews 3 days in a row, and Hash Tables are decaying fast. A 10-minute session tonight buys you two weeks of retention.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MasteryChart = () => {
  const pts = [22, 28, 31, 30, 38, 42, 45, 52, 51, 58, 62, 60, 65, 70, 68, 72];
  const ret = [30, 35, 40, 44, 48, 52, 56, 60, 62, 66, 70, 72, 76, 78, 82, 84];
  const W = 900, H = 220, P = 20;
  const x = (i) => P + (i / (pts.length - 1)) * (W - P * 2);
  const y = (v) => H - P - (v / (100)) * (H - P * 2);
  const line = (arr) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(v)}`).join(' ');
  const area = line(pts) + ` L ${x(pts.length - 1)} ${H - P} L ${x(0)} ${H - P} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 220 }}>
      <defs>
        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--accent)" stopOpacity="0.3"/>
          <stop offset="1" stopColor="var(--accent)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map(v => (
        <g key={v}>
          <line x1={P} x2={W - P} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeDasharray="2,3"/>
          <text x={P - 4} y={y(v) + 3} fontSize="9" fill="var(--fg-3)" textAnchor="end" fontFamily="var(--font-mono)">{v}</text>
        </g>
      ))}
      <path d={area} fill="url(#area)"/>
      <path d={line(ret)} stroke="var(--fg-3)" strokeWidth="1.5" fill="none" strokeDasharray="3,3" opacity="0.5"/>
      <path d={line(pts)} stroke="var(--accent)" strokeWidth="1.8" fill="none"/>
      {pts.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill="var(--accent)"/>)}
      <circle cx={x(pts.length - 1)} cy={y(pts[pts.length - 1])} r="5" fill="none" stroke="var(--accent)" strokeWidth="1.5"/>
    </svg>
  );
};

const Heatmap = () => {
  const weeks = 12, days = 7;
  const data = Array.from({ length: weeks * days }).map((_, i) => {
    const r = (Math.sin(i * 1.3) + 1) / 2;
    return r < 0.2 ? 0 : r < 0.4 ? 1 : r < 0.65 ? 2 : r < 0.85 ? 3 : 4;
  });
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${weeks}, 1fr)`, gap: 3 }}>
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Array.from({ length: days }).map((_, d) => {
            const v = data[w * days + d];
            return <div key={d} style={{ aspectRatio: '1', borderRadius: 2, background: v === 0 ? 'var(--bg-2)' : `color-mix(in oklab, var(--accent) ${v * 22}%, transparent)` }}/>;
          })}
        </div>
      ))}
    </div>
  );
};

window.Progress = Progress;
