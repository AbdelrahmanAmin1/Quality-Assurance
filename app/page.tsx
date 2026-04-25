export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32 }}>
      <section style={{ maxWidth: 720, padding: 32, border: "1px solid rgba(255,255,255,.12)", borderRadius: 24, background: "rgba(17,17,42,.72)" }}>
        <p style={{ margin: "0 0 12px", color: "var(--accent)", letterSpacing: ".12em", textTransform: "uppercase", fontSize: 12 }}>Noesis backend</p>
        <h1 style={{ margin: "0 0 16px", fontSize: 44, fontWeight: 300, letterSpacing: "-.04em" }}>API foundation is active.</h1>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
          The exported prototype remains in the repository while the production backend is implemented branch by branch.
          Start with <code>/api/health</code> to verify runtime and database configuration.
        </p>
      </section>
    </main>
  );
}
