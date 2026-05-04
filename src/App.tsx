import './App.css'

type LenderMatch = {
  name: string
  specialty: string
  fitScore: string
}

const lenderMatches: LenderMatch[] = [
  {
    name: 'BridgePoint Capital',
    specialty: 'Bridge loans and mixed-use assets',
    fitScore: '96%',
  },
  {
    name: 'Harbor Residential Funding',
    specialty: 'DSCR loans and non-QM scenarios',
    fitScore: '92%',
  },
  {
    name: 'Summit Private Lending',
    specialty: 'Fix-and-flip and value-add deals',
    fitScore: '89%',
  },
]

export function App() {
  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="hero-title">
        <nav className="nav" aria-label="Primary navigation">
          <div className="brand">
            <span className="brand-mark">B</span>
            <span>Blender Cap</span>
          </div>
          <div className="nav-links">
            <a href="#matches">Matches</a>
            <a href="mailto:hello@blendercap.com">Request access</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Lender matching for brokers</p>
            <h1 id="hero-title">Find lenders that fit before you submit.</h1>
            <p className="hero-copy">
              Compare residential and commercial lenders by appetite, speed, and underwriting fit.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="mailto:hello@blendercap.com">
                Request access
              </a>
              <a className="button button-secondary" href="#matches">
                View sample matches
              </a>
            </div>
          </div>

          <aside className="match-card" id="matches" aria-labelledby="matches-title">
            <h2 id="matches-title">Sample matches</h2>
            <div className="scenario">
              <div className="field">
                <span>Loan type</span>
                <span>Mixed-use bridge</span>
              </div>
              <div className="field">
                <span>Loan amount</span>
                <span>$2.4M</span>
              </div>
              <div className="field">
                <span>Target close</span>
                <span>21 days</span>
              </div>
            </div>
            <div className="lender-list">
              {lenderMatches.map((lender) => (
                <article className="lender" key={lender.name}>
                  <strong>{lender.name}</strong>
                  <small>{lender.specialty}</small>
                  <span className="score">{lender.fitScore}</span>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <div className="metrics" aria-label="Platform highlights">
          <div className="metric">
            <strong>120+</strong>
            <span>Lender programs indexed</span>
          </div>
          <div className="metric">
            <strong>3 min</strong>
            <span>Average scenario intake</span>
          </div>
          <div className="metric">
            <strong>24/7</strong>
            <span>Pipeline visibility</span>
          </div>
        </div>
      </section>
    </main>
  )
}
