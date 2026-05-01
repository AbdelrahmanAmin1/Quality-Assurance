const Collab = ({ onNav }) => {
  const Icon = window.Icon;
  const Api = window.NoesisApi;
  const [rooms, setRooms] = React.useState([]);
  const [room, setRoom] = React.useState(null);
  const [boardText, setBoardText] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const load = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await Api.get("/api/study-rooms");
      const loaded = data.rooms || [];
      setRooms(loaded);
      const id = room?.id && loaded.some((item) => item.id === room.id) ? room.id : loaded[0]?.id;
      if (id) await loadRoom(id);
      else setRoom(null);
    } catch (err) {
      setError(err.message || "Could not load rooms.");
    } finally {
      setLoading(false);
    }
  }, [room?.id]);

  const loadRoom = async (id) => {
    const data = await Api.get(`/api/study-rooms/${id}`);
    setRoom(data.room);
    setBoardText(Api.parseJsonObject(data.room?.board).text || "");
  };

  React.useEffect(() => { load(); }, [load]);

  const createRoom = async () => {
    const name = window.prompt("Study room name");
    if (!name?.trim()) return;
    const topic = window.prompt("Topic", "Study session");
    setSaving(true);
    setError("");
    try {
      const result = await Api.post("/api/study-rooms", { name: name.trim(), topic: topic?.trim() || undefined });
      await loadRoom(result.room.id);
      await load();
    } catch (err) {
      setError(err.message || "Could not create room.");
    } finally {
      setSaving(false);
    }
  };

  const saveBoard = async () => {
    if (!room) return;
    setSaving(true);
    setError("");
    try {
      const data = await Api.patch(`/api/study-rooms/${room.id}`, { board: { text: boardText } });
      setRoom({ ...room, board: data.room.board });
      await loadRoom(room.id);
    } catch (err) {
      setError(err.message || "Could not save board.");
    } finally {
      setSaving(false);
    }
  };

  const sendMessage = async () => {
    if (!room || !message.trim()) return;
    const content = message.trim();
    setMessage("");
    setSaving(true);
    setError("");
    try {
      await Api.post(`/api/study-rooms/${room.id}/messages`, { content });
      await loadRoom(room.id);
    } catch (err) {
      setError(err.message || "Could not send message.");
      setMessage(content);
    } finally {
      setSaving(false);
    }
  };

  const deleteRoom = async () => {
    if (!room) return;
    setSaving(true);
    setError("");
    try {
      await Api.delete(`/api/study-rooms/${room.id}`);
      setRoom(null);
      await load();
    } catch (err) {
      setError(err.message || "Could not delete room.");
    } finally {
      setSaving(false);
    }
  };

  const members = room?.members || [];
  const messages = room?.messages || [];

  return (
    <div>
      <window.Topbar title={room ? `Study Room · ${room.name}` : "Study Rooms"} crumbs={["Rooms"]}
        right={<>
          <div style={{ display: "flex" }}>
            {members.slice(0, 4).map((member, i) => (
              <div key={member.id} style={{ ...co.avatar, background: avatarColor(i), marginLeft: i > 0 ? -8 : 0 }}>{Api.initials(member.user?.name, member.user?.email)}</div>
            ))}
          </div>
          <button className="btn btn-ghost" onClick={load} disabled={loading}><Icon.Clock size={12}/> Refresh</button>
          <button className="btn btn-accent" onClick={createRoom} disabled={saving}><Icon.Plus size={12}/> New room</button>
        </>}
      />
      <div style={co.layout}>
        <aside style={co.members}>
          <div style={co.panelHead}>
            <div style={co.label}>Available rooms</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, marginTop: 4 }}>{rooms.length} joined</div>
          </div>
          {loading && <div style={co.empty}>Loading rooms...</div>}
          {!loading && rooms.length ? rooms.map((item) => (
            <button key={item.id} onClick={() => loadRoom(item.id)} style={{ ...co.roomBtn, background: item.id === room?.id ? "var(--bg-2)" : "transparent" }}>
              <div style={{ fontSize: 12.5, color: "var(--fg-0)", fontWeight: 500 }}>{item.name}</div>
              <div style={{ fontSize: 10.5, color: "var(--fg-3)", marginTop: 3 }}>{item.topic || "No topic"} · {item.members?.length || 0} members</div>
            </button>
          )) : !loading && <div style={co.empty}>Create a room to collaborate.</div>}

          {room && (
            <>
              <div style={co.sectionLabel}>Members · {members.length}</div>
              <div style={co.memberStack}>
                {members.map((member, i) => (
                  <div key={member.id} style={co.member}>
                    <div style={{ ...co.smallAvatar, background: avatarColor(i) }}>{Api.initials(member.user?.name, member.user?.email)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, color: "var(--fg-0)", fontWeight: 500 }}>{member.user?.name || member.user?.email}</div>
                      <div style={{ fontSize: 10.5, color: "var(--fg-3)" }}>{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>

        <main style={co.board}>
          {error && <div style={co.error}>{error}</div>}
          {!room ? (
            <div className="card" style={co.emptyCard}>
              <Icon.Users size={30} style={{ color: "var(--accent)" }}/>
              <div style={{ fontSize: 20, color: "var(--fg-0)", marginTop: 12 }}>No study room selected</div>
              <button className="btn btn-accent" onClick={createRoom} disabled={saving} style={{ marginTop: 16 }}><Icon.Plus size={12}/> Create room</button>
            </div>
          ) : (
            <>
              <div style={co.boardHead}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--fg-0)", fontWeight: 500 }}>Shared board · {room.topic || "No topic"}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>Updated {Api.relativeDate(room.updatedAt)}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-ghost" onClick={saveBoard} disabled={saving}><Icon.Check size={12}/> Save board</button>
                  <button className="btn btn-bare" onClick={deleteRoom} disabled={saving} style={{ color: "var(--err)" }}><Icon.X size={13}/></button>
                </div>
              </div>

              <div style={co.boardInner}>
                <textarea
                  className="input"
                  value={boardText}
                  onChange={(event) => setBoardText(event.target.value)}
                  placeholder="Write shared notes for this room..."
                  style={co.boardText}
                />
              </div>
            </>
          )}
        </main>

        <aside style={co.voice}>
          <div style={co.panelHead}>
            <div style={co.label}>Room messages</div>
          </div>
          <div style={co.messages}>
            {messages.length ? messages.map((entry) => (
              <div key={entry.id} style={co.message}>
                <div style={{ fontSize: 10.5, color: "var(--fg-3)", marginBottom: 4 }}>{Api.relativeDate(entry.createdAt)}</div>
                <div style={{ fontSize: 12.5, color: "var(--fg-1)", lineHeight: 1.5 }}>{entry.content}</div>
              </div>
            )) : <div style={co.empty}>No messages yet.</div>}
          </div>
          <div style={co.inputBar}>
            <input
              className="input"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }}
              disabled={!room || saving}
              placeholder="Message room..."
              style={{ flex: 1, fontSize: 12.5 }}
            />
            <button className="btn btn-bare" style={{ padding: 8 }} onClick={sendMessage} disabled={!room || saving || !message.trim()}><Icon.Send size={14}/></button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const avatarColor = (i) => ["var(--accent)", "var(--parchment)", "var(--info)", "var(--ok)"][i % 4];

const co = {
  layout: { display: "grid", gridTemplateColumns: "280px 1fr 300px", minHeight: "calc(100vh - 57px)" },
  members: { borderRight: "1px solid var(--line)", background: "var(--bg-0)" },
  board: { background: "var(--bg-0)", overflow: "auto" },
  voice: { borderLeft: "1px solid var(--line)", display: "flex", flexDirection: "column", background: "var(--bg-0)" },
  avatar: { width: 26, height: 26, borderRadius: 13, color: "var(--bg-0)", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg-0)", fontFamily: "var(--font-display)" },
  smallAvatar: { width: 28, height: 28, borderRadius: 8, color: "var(--bg-0)", fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" },
  panelHead: { padding: 18, borderBottom: "1px solid var(--line)" },
  label: { fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase" },
  roomBtn: { width: "calc(100% - 16px)", margin: "4px 8px", padding: "10px 12px", borderRadius: "var(--r-sm)", textAlign: "left" },
  sectionLabel: { padding: "14px 16px", fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase" },
  memberStack: { padding: "0 8px", display: "flex", flexDirection: "column", gap: 2 },
  member: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--r-sm)" },
  boardHead: { padding: "14px 20px", borderBottom: "1px solid var(--line-soft)", display: "flex", alignItems: "center", justifyContent: "space-between" },
  boardInner: { padding: 32, maxWidth: 860, margin: "0 auto" },
  boardText: { width: "100%", minHeight: 520, padding: 18, fontSize: 14, lineHeight: 1.7, resize: "vertical" },
  messages: { padding: 16, display: "flex", flexDirection: "column", gap: 10, overflow: "auto", flex: 1 },
  message: { padding: 12, border: "1px solid var(--line)", borderRadius: "var(--r-sm)", background: "var(--bg-1)" },
  inputBar: { padding: 14, borderTop: "1px solid var(--line)", display: "flex", gap: 8 },
  empty: { color: "var(--fg-3)", fontSize: 12.5, padding: 16 },
  emptyCard: { padding: 40, textAlign: "center", maxWidth: 460, margin: "80px auto" },
  error: { margin: 16, padding: "10px 12px", border: "1px solid var(--err)", borderRadius: "var(--r-sm)", color: "var(--err)", fontSize: 12 },
};

window.Collab = Collab;
