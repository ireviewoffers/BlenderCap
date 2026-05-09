export function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-6">
      <section className="text-center space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          Blender Cap
        </p>
        <h1
          className="text-4xl font-bold text-slate-800 sm:text-6xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Lender match, compare &amp; track
        </h1>
        <p className="mx-auto max-w-md text-lg text-slate-600">
          Phase 0 scaffold for the broker lending marketplace.
        </p>
        <div className="inline-flex rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg">
          Project skeleton ready
        </div>
      </section>
    </main>
  )
}
