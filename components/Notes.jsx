// Notes workspace
const Notes = ({ onNav }) => {
  const Icon = window.Icon;
  const folders = [
    { name: 'Data Structures', count: 14, active: true },
    { name: 'OOP', count: 11 },
    { name: 'Linear Algebra', count: 6 },
    { name: 'Saved from tutor', count: 23 },
  ];
  const notes = [
    { t: 'Hash Tables â€” load factor & resizing', updated: '10 min ago', preview: 'Î± = n/m is the single most important number in a hash table...', tag: 'CSCI 3411', active: true },
    { t: 'Linked Lists vs Arrays', updated: 'Yesterday', preview: 'Cache locality makes arrays win for small n, even when asymptotics say otherwise...', tag: 'CSCI 3411' },
    { t: 'Inheritance â€” Liskov Substitution', updated: '2 days ago', preview: 'A subclass must be substitutable for its parent without breaking correctness...', tag: 'CSCI 2301' },
    { t: 'Big-O Cheat Sheet', updated: 'Last week', preview: 'Common complexities ranked by speed: O(1) < O(log n) < O(n)...', tag: 'CSCI 3411' },
  ];

  return (
    <div>
      <window.Topbar title="Notes" crumbs={['Workspace']}
        right={<><button className="btn btn-ghost"><Icon.Search size={12}/> Search notes</button><button className="btn btn-accent"><Icon.Plus size={12}/> New note</button></>}
      />
      <div style={ns.layout}>
        <aside style={ns.folders}>
          <div style={{ padding: '16px 14px 8px', fontSize: 10.5, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Folders</div>
          <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {folders.map((f, i) => (
              <button key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 'var(--r-sm)',
                background: f.active ? 'var(--bg-2)' : 'transparent',
                color: f.active ? 'var(--fg-0)' : 'var(--fg-2)', fontSize: 12.5,
              }}>
                <Icon.Folder size={13}/>
                <span style={{ flex: 1, textAlign: 'left' }}>{f.name}</span>
                <span style={{ fontSize: 10.5, color: 'var(--fg-3)' }} className="mono">{f.count}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: '16px 14px 8px', fontSize: 10.5, color: 'var(--fg-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16 }}>Tags</div>
          <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['concept', 'proof', 'gotcha', 'exam-prep'].map(t => (
              <div key={t} style={{ fontSize: 12, color: 'var(--fg-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--accent)', opacity: 0.6 }}/>#{t}
              </div>
            ))}
          </div>
        </aside>

        <section style={ns.list}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--line-soft)' }}>
            <div style={{ fontSize: 13, color: 'var(--fg-0)', fontWeight: 500 }}>Data Structures</div>
            <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>14 notes Â· sorted by recent</div>
          </div>
          <div>
            {notes.map((n, i) => (
              <button key={i} style={{
                display: 'flex', flexDirection: 'column', gap: 4,
                padding: '14px 18px', borderBottom: '1px solid var(--line-soft)',
                textAlign: 'left', width: '100%',
                background: n.active ? 'var(--bg-2)' : 'transparent',
                borderLeft: n.active ? '2px solid var(--accent)' : '2px solid transparent',
              }}>
                <div style={{ fontSize: 13, color: 'var(--fg-0)', fontWeight: 500 }}>{n.t}</div>
                <div style={{ fontSize: 11.5, color: 'var(--fg-3)', display: 'flex', gap: 8 }}>
                  <span>{n.updated}</span><span>Â·</span><span>{n.tag}</span>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--fg-2)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.preview}</div>
              </button>
            ))}
          </div>
        </section>

        <main style={ns.editor}>
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 36px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, alignItems: 'center' }}>
              <span className="chip chip-accent">CSCI 3411</span>
              <span className="chip">#concept</span>
              <span className="chip">#exam-prep</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-3)' }}>Updated 10 min ago Â· Auto-saved</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 300, letterSpacing: '-0.02em', margin: '0 0 24px' }}>
              Hash Tables â€” load factor & resizing
            </h1>

            <div style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--fg-1)' }}>
              <p>The entire behavior of a hash table compresses into one Greek letter: <b style={{ color: 'var(--fg-0)' }}>Î± = n/m</b>, the load factor. Everything else is a consequence.</p>

              <h2 style={ns.h2}>Core intuition</h2>
              <ul style={ns.ul}>
                <li>If Î± â‰¤ 1, we expect most slots to hold â‰¤ 1 key</li>
                <li>If Î± &gt; 1, chains grow and lookups slow linearly in Î±</li>
                <li>Java's HashMap resizes at Î± = 0.75 â€” aggressive enough to keep O(1), lazy enough to avoid thrashing</li>
              </ul>

              <div style={ns.insetQuote}>
                <Icon.Sparkle size={12} style={{ color: 'var(--accent)' }}/>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>From tutor Â· Apr 22</div>
                  <div style={{ fontStyle: 'italic', color: 'var(--fg-1)' }}>"O(1) isn't a law â€” it's a budget. Resize before you overspend."</div>
                </div>
              </div>

              <h2 style={ns.h2}>Resize cost analysis</h2>
              <p>Resizing is O(n) â€” copy every entry. But it happens rarely enough (every time n doubles) that <mark style={{ background: 'var(--accent-glow)', color: 'var(--accent)', padding: '1px 4px', borderRadius: 3 }}>amortized cost per insertion is still O(1)</mark>.</p>

              <pre style={ns.pre}>
{`// Amortized analysis (accounting method)
// Each insertion "pays" 3 coins:
//   1 for its own work
//   2 saved for eventual rehash of itself and one predecessor
// Resize uses the saved coins â€” no debt.`}
              </pre>

              <h2 style={ns.h2}>Don't forget</h2>
              <ul style={ns.ul}>
                <li>Open addressing dies differently than chaining â€” clustering, not chain length</li>
                <li>String hashing: don't roll your own, use MurmurHash or xxHash</li>
              </ul>
            </div>

            <div style={{ marginTop: 32, padding: '14px 16px', background: 'var(--bg-1)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <Icon.Sparkle size={14} style={{ color: 'var(--accent)' }}/>
              <span style={{ fontSize: 12.5, color: 'var(--fg-1)' }}>Want me to generate flashcards from this note?</span>
              <button className="btn btn-ghost" style={{ marginLeft: 'auto', fontSize: 11.5 }}>Yes, 4 cards</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const ns = {
  layout: { display: 'grid', gridTemplateColumns: '220px 320px 1fr', minHeight: 'calc(100vh - 57px)' },
  folders: { borderRight: '1px solid var(--line)', padding: '8px 0', background: 'var(--bg-0)' },
  list: { borderRight: '1px solid var(--line)', background: 'var(--bg-0)', overflow: 'auto' },
  editor: { background: 'var(--bg-0)', overflow: 'auto' },
  h2: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, margin: '28px 0 10px', color: 'var(--fg-0)', letterSpacing: '-0.01em' },
  ul: { margin: '0 0 16px', paddingLeft: 20 },
  pre: { fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg-1)', border: '1px solid var(--line)', padding: 16, borderRadius: 'var(--r-md)', overflow: 'auto', color: 'var(--fg-1)', margin: '14px 0' },
  insetQuote: { display: 'flex', gap: 10, padding: 14, background: 'var(--bg-1)', borderLeft: '2px solid var(--accent)', borderRadius: 'var(--r-sm)', margin: '16px 0', fontSize: 13 },
};

window.Notes = Notes;
