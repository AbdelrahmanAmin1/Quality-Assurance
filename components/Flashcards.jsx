// Flashcards
const Flashcards = ({ onNav }) => {
  const Icon = window.Icon;
  const [i, setI] = React.useState(3);
  const [flipped, setFlipped] = React.useState(false);
  const cards = [
    { q: 'What is the load factor Î± of a hash table?', a: 'Î± = n/m â€” number of keys divided by number of slots. It determines expected chain length and lookup cost.', deck: 'Hash Tables' },
    { q: 'When should a HashMap resize?', a: 'When Î± exceeds a threshold (Java uses 0.75). Too early â†’ thrashing; too late â†’ chains grow and O(1) fails.', deck: 'Hash Tables' },
    { q: 'Why is insertion at a linked list head O(1)?', a: 'New node points to old head; head pointer moves to new node. No traversal needed.', deck: 'Linked Lists' },
    { q: 'What is the worst-case complexity of linear probing?', a: 'O(n) â€” when the table is near-full or hash function clusters, every lookup may probe every slot.', deck: 'Hash Tables' },
  ];
  const c = cards[i];

  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <window.Topbar title="Flashcards Â· Hash Tables deck" crumbs={['Review']}
        right={<><span style={{ fontSize: 11, color: 'var(--fg-3)' }} className="mono">{i + 1} / {cards.length}</span><button className="btn btn-bare"><Icon.X size={14}/></button></>}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 28px', borderBottom: '1px solid var(--line-soft)' }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {cards.map((_, k) => (
              <div key={k} style={{ flex: 1, height: 2, borderRadius: 1, background: k < i ? 'var(--ok)' : k === i ? 'var(--accent)' : 'var(--line)' }}/>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--fg-3)' }} className="mono">
            <span>3 easy Â· 0 hard Â· 0 skipped</span>
            <span>Deck: {c.deck}</span>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ width: '100%', maxWidth: 640 }}>
            <div onClick={() => setFlipped(!flipped)} style={{
              ...fc.card,
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
            }}>
              <div style={{ ...fc.face, transform: 'rotateY(0)' }}>
                <div style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Question</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, letterSpacing: '-0.015em', lineHeight: 1.25 }}>{c.q}</div>
                <div style={{ marginTop: 40, fontSize: 11, color: 'var(--fg-3)', display: 'flex', alignItems: 'center', gap: 6 }} className="mono">
                  <Icon.Mic size={11}/> <span>SPACE to flip Â· â†‘ dictate</span>
                </div>
              </div>
              <div style={{ ...fc.face, transform: 'rotateY(180deg)', background: 'var(--bg-2)' }}>
                <div style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Answer</div>
                <div style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--fg-0)' }}>{c.a}</div>
                <div style={{ marginTop: 32, padding: 14, background: 'var(--bg-1)', borderRadius: 'var(--r-sm)', border: '1px solid var(--line)' }}>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>From your notes</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-2)', fontStyle: 'italic' }}>"Î± = n/m is the single most important number in a hash table..."</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 32, justifyContent: 'center' }}>
              {[
                { l: 'Again', sub: '< 1m', color: 'var(--err)', key: '1' },
                { l: 'Hard', sub: '10m', color: 'var(--warn)', key: '2' },
                { l: 'Good', sub: '3 days', color: 'var(--accent)', key: '3' },
                { l: 'Easy', sub: '2 weeks', color: 'var(--ok)', key: '4' },
              ].map(b => (
                <button key={b.l} onClick={() => { setI(Math.min(i + 1, cards.length - 1)); setFlipped(false); }} style={{
                  ...fc.rateBtn, borderColor: 'var(--line)',
                }}>
                  <span style={{ ...fc.keyHint, color: b.color }} className="mono">{b.key}</span>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--fg-0)', fontWeight: 500 }}>{b.l}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--fg-3)', marginTop: 2 }} className="mono">{b.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const fc = {
  card: {
    position: 'relative', minHeight: 340,
    transition: 'transform 600ms var(--ease-in-out)',
    transformStyle: 'preserve-3d',
    cursor: 'pointer',
  },
  face: {
    position: 'absolute', inset: 0,
    padding: 40, borderRadius: 'var(--r-xl)',
    background: 'var(--bg-1)', border: '1px solid var(--line)',
    backfaceVisibility: 'hidden',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex', flexDirection: 'column',
  },
  rateBtn: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px', borderRadius: 'var(--r-md)',
    border: '1px solid',
    background: 'var(--bg-1)',
    minWidth: 120,
    transition: 'all 160ms var(--ease-out)',
  },
  keyHint: {
    width: 20, height: 20, borderRadius: 4,
    background: 'var(--bg-2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11,
  },
};

window.Flashcards = Flashcards;
