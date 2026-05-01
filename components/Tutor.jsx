const Tutor = ({ onNav }) => {
  const Icon = window.Icon;
  const Api = window.NoesisApi;
  const [sessions, setSessions] = React.useState([]);
  const [activeId, setActiveId] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [prompt, setPrompt] = React.useState("");
  const [mode, setMode] = React.useState("socratic");
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState("");

  const loadSessions = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await Api.get("/api/tutor/sessions");
      const loaded = data.sessions || [];
      setSessions(loaded);
      const nextId = activeId && loaded.some((session) => session.id === activeId) ? activeId : loaded[0]?.id || "";
      setActiveId(nextId);
      if (nextId) await loadMessages(nextId);
      else setMessages([]);
    } catch (err) {
      setError(err.message || "Could not load tutor sessions.");
    } finally {
      setLoading(false);
    }
  }, [activeId]);

  const loadMessages = async (sessionId) => {
    const data = await Api.get(`/api/tutor/sessions/${sessionId}/messages`);
    setMessages(data.messages || []);
  };

  React.useEffect(() => { loadSessions(); }, [loadSessions]);

  const createSession = async () => {
    const topic = window.prompt("Tutor session topic");
    if (!topic?.trim()) return;
    setSending(true);
    setError("");
    try {
      const result = await Api.post("/api/tutor/sessions", {
        topic: topic.trim(),
        openingPrompt: `Help me study ${topic.trim()} in ${mode} mode.`,
      });
      setActiveId(result.session.id);
      await loadSessions();
    } catch (err) {
      setError(err.message || "Could not create tutor session.");
    } finally {
      setSending(false);
    }
  };

  const sendMessage = async () => {
    if (!activeId || !prompt.trim()) return;
    const content = prompt.trim();
    setPrompt("");
    setSending(true);
    setError("");
    try {
      const result = await Api.post(`/api/tutor/sessions/${activeId}/messages`, { content });
      setMessages((current) => [...current, ...(result.messages || [])]);
      await loadSessions();
    } catch (err) {
      setError(err.message || "Could not send message.");
      setPrompt(content);
    } finally {
      setSending(false);
    }
  };

  const deleteSession = async () => {
    if (!activeId) return;
    setSending(true);
    setError("");
    try {
      await Api.delete(`/api/tutor/sessions/${activeId}`);
      setActiveId("");
      await loadSessions();
    } catch (err) {
      setError(err.message || "Could not delete session.");
    } finally {
      setSending(false);
    }
  };

  const activeSession = sessions.find((session) => session.id === activeId);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <window.Topbar
        title={activeSession?.topic || "AI Tutor"}
        crumbs={["Tutor", activeSession ? Api.relativeDate(activeSession.updatedAt) : "No session"]}
        right={<>
          <div style={tu.segment}>
            {[
              { id: "socratic", label: "Socratic", icon: "Brain" },
              { id: "explain", label: "Explain", icon: "Lightbulb" },
              { id: "example", label: "Example", icon: "Code" },
            ].map(m => {
              const C = Icon[m.icon];
              return (
                <button key={m.id} onClick={() => setMode(m.id)} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", fontSize: 11.5,
                  background: mode === m.id ? "var(--bg-0)" : "transparent",
                  color: mode === m.id ? "var(--fg-0)" : "var(--fg-2)",
                  borderRadius: 6,
                }}>
                  <C size={12}/>{m.label}
                </button>
              );
            })}
          </div>
          <button className="btn btn-accent" onClick={createSession} disabled={sending}><Icon.Plus size={12}/> New</button>
        </>}
      />

      <div style={tu.layout}>
        <aside style={tu.timeline}>
          <div style={tu.panelHead}>
            <div style={tu.label}>Sessions</div>
            <div style={{ fontSize: 13, color: "var(--fg-1)", marginTop: 6 }}>{sessions.length} backend records</div>
          </div>
          <div style={tu.sessionList}>
            {loading && <div style={tu.empty}>Loading sessions...</div>}
            {!loading && sessions.length ? sessions.map((session) => (
              <button key={session.id} onClick={async () => { setActiveId(session.id); await loadMessages(session.id); }} style={{
                ...tu.sessionBtn,
                background: session.id === activeId ? "var(--bg-2)" : "transparent",
              }}>
                <div style={{ fontSize: 12.5, color: "var(--fg-0)", fontWeight: 500 }}>{session.topic}</div>
                <div style={{ fontSize: 10.5, color: "var(--fg-3)", marginTop: 3 }}>{Api.relativeDate(session.updatedAt)}</div>
              </button>
            )) : !loading && <div style={tu.empty}>Create a session to start backend-backed tutoring.</div>}
          </div>
          {activeSession && (
            <div style={tu.footer}>
              <button className="btn btn-ghost" onClick={deleteSession} disabled={sending} style={{ width: "100%", justifyContent: "center", color: "var(--err)" }}>
                <Icon.X size={11}/> Delete session
              </button>
            </div>
          )}
        </aside>

        <main style={tu.workspace}>
          <div style={tu.chatWrap}>
            {error && <div style={tu.error}>{error}</div>}
            {!activeSession ? (
              <div className="card" style={tu.noSession}>
                <Icon.Sparkle size={28} style={{ color: "var(--accent)" }}/>
                <div style={{ fontSize: 20, color: "var(--fg-0)", marginTop: 12 }}>No tutor session selected</div>
                <div style={{ fontSize: 12.5, color: "var(--fg-2)", marginTop: 6 }}>Sessions and messages are stored through the backend API.</div>
                <button className="btn btn-accent" onClick={createSession} disabled={sending} style={{ marginTop: 16 }}><Icon.Plus size={12}/> Start session</button>
              </div>
            ) : (
              <>
                <div style={tu.chatHeader}>
                  <div style={tu.label}>Active backend session</div>
                  <h1 style={tu.title}>{activeSession.topic}</h1>
                </div>
                <div style={tu.messageList}>
                  {messages.length ? messages.map((message) => (
                    <div key={message.id} style={{ ...tu.message, alignSelf: message.role === "user" ? "flex-end" : "flex-start", background: message.role === "user" ? "var(--accent-glow)" : "var(--bg-1)" }}>
                      <div style={tu.messageMeta}>{message.role} · {Api.relativeDate(message.createdAt)}</div>
                      <div style={tu.messageBody}>{message.content}</div>
                    </div>
                  )) : <div style={tu.empty}>No messages yet. Send a prompt to generate a tutor reply.</div>}
                </div>
              </>
            )}
          </div>
        </main>

        <aside style={tu.rail}>
          <div style={tu.panelHead}>
            <div style={tu.label}>Session details</div>
          </div>
          {activeSession ? (
            <div style={{ padding: 18 }}>
              <Detail label="Created" value={Api.relativeDate(activeSession.createdAt)}/>
              <Detail label="Updated" value={Api.relativeDate(activeSession.updatedAt)}/>
              <Detail label="Messages" value={messages.length}/>
              <button className="btn btn-ghost" onClick={() => onNav("notes")} style={{ width: "100%", justifyContent: "center", marginTop: 18 }}>
                <Icon.PenNib size={12}/> Open notes
              </button>
            </div>
          ) : <div style={{ ...tu.empty, padding: 18 }}>No session selected.</div>}

          <div style={tu.inputBar}>
            <input
              className="input"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }}
              disabled={!activeSession || sending}
              placeholder="Ask a clarifying question..."
              style={{ flex: 1, fontSize: 12.5 }}
            />
            <button className="btn btn-bare" style={{ padding: 8 }} onClick={sendMessage} disabled={!activeSession || sending || !prompt.trim()}><Icon.Send size={14}/></button>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div style={{ padding: "10px 0", borderBottom: "1px solid var(--line-soft)" }}>
    <div style={{ fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontSize: 13, color: "var(--fg-0)", marginTop: 4 }}>{value}</div>
  </div>
);

const tu = {
  layout: { display: "grid", gridTemplateColumns: "280px 1fr 340px", flex: 1, minHeight: "calc(100vh - 57px)" },
  timeline: { borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column", background: "var(--bg-0)" },
  workspace: { overflow: "auto", background: "var(--bg-0)" },
  rail: { borderLeft: "1px solid var(--line)", display: "flex", flexDirection: "column", background: "var(--bg-0)" },
  segment: { display: "flex", gap: 2, padding: 2, background: "var(--bg-2)", borderRadius: "var(--r-md)", border: "1px solid var(--line)" },
  panelHead: { padding: "20px 20px 10px" },
  label: { fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase" },
  sessionList: { padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4 },
  sessionBtn: { padding: "10px 10px", borderRadius: "var(--r-sm)", textAlign: "left" },
  footer: { marginTop: "auto", padding: 14, borderTop: "1px solid var(--line)" },
  chatWrap: { maxWidth: 820, margin: "0 auto", padding: "32px 24px 40px" },
  chatHeader: { marginBottom: 20 },
  title: { fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 300, margin: "8px 0 0", lineHeight: 1.2 },
  messageList: { display: "flex", flexDirection: "column", gap: 12 },
  message: { maxWidth: "78%", padding: 16, borderRadius: "var(--r-md)", border: "1px solid var(--line)", color: "var(--fg-1)" },
  messageMeta: { fontSize: 10.5, color: "var(--fg-3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 },
  messageBody: { fontSize: 13.5, lineHeight: 1.65 },
  noSession: { padding: 40, textAlign: "center", maxWidth: 460, margin: "80px auto" },
  inputBar: { padding: 14, borderTop: "1px solid var(--line)", marginTop: "auto", display: "flex", gap: 8 },
  empty: { color: "var(--fg-3)", fontSize: 12.5 },
  error: { marginBottom: 16, padding: "10px 12px", border: "1px solid var(--err)", borderRadius: "var(--r-sm)", color: "var(--err)", fontSize: 12 },
};

window.Tutor = Tutor;
