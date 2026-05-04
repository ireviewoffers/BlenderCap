function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-slate-800" style={{ fontFamily: "var(--font-heading)" }}>
          Blender Cap
        </h1>
        <p className="text-lg text-slate-600 max-w-md">
          Lender match, compare &amp; track
        </p>
        <div className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-medium shadow-lg hover:bg-blue-700 transition-colors">
          Get Started
        </div>
      </div>
    </div>
  );
}

export default App;
