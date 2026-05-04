import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type LoanType = 'Bridge' | 'DSCR' | 'Fix & flip' | 'Construction'
type PropertyType = 'Residential' | 'Mixed-use' | 'Multifamily' | 'Retail'
type Timeline = '14 days' | '21 days' | '30+ days'

type SearchForm = {
  loanType: LoanType
  propertyType: PropertyType
  loanAmount: string
  creditScore: string
  timeline: Timeline
}

type Lender = {
  name: string
  specialties: LoanType[]
  propertyTypes: PropertyType[]
  minAmount: number
  maxAmount: number
  minCreditScore: number
  timelines: Timeline[]
  responseTime: string
  note: string
}

type RankedLender = Lender & {
  score: number
  reasons: string[]
}

const defaultSearch: SearchForm = {
  loanType: 'Bridge',
  propertyType: 'Mixed-use',
  loanAmount: '2400000',
  creditScore: '680',
  timeline: '21 days',
}

const lenders: Lender[] = [
  {
    name: 'BridgePoint Capital',
    specialties: ['Bridge', 'Construction'],
    propertyTypes: ['Mixed-use', 'Retail', 'Multifamily'],
    minAmount: 750000,
    maxAmount: 12000000,
    minCreditScore: 580,
    timelines: ['14 days', '21 days'],
    responseTime: '24 hrs',
    note: 'Strong fit for transitional commercial collateral and fast term sheets.',
  },
  {
    name: 'Harbor Residential Funding',
    specialties: ['DSCR', 'Bridge'],
    propertyTypes: ['Residential', 'Multifamily'],
    minAmount: 250000,
    maxAmount: 5000000,
    minCreditScore: 620,
    timelines: ['21 days', '30+ days'],
    responseTime: 'Same day',
    note: 'Best for investor residential scenarios with predictable rental income.',
  },
  {
    name: 'Summit Private Lending',
    specialties: ['Fix & flip', 'Bridge'],
    propertyTypes: ['Residential', 'Mixed-use', 'Multifamily'],
    minAmount: 150000,
    maxAmount: 3500000,
    minCreditScore: 500,
    timelines: ['14 days', '21 days'],
    responseTime: '48 hrs',
    note: 'Flexible on credit when the exit strategy and renovation plan are clear.',
  },
  {
    name: 'Cedar Commercial Bank',
    specialties: ['Construction', 'Bridge'],
    propertyTypes: ['Retail', 'Mixed-use', 'Multifamily'],
    minAmount: 1000000,
    maxAmount: 20000000,
    minCreditScore: 720,
    timelines: ['30+ days'],
    responseTime: '2 business days',
    note: 'Competitive pricing for stronger sponsors with more complete packages.',
  },
]

const currencyFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  style: 'currency',
  currency: 'USD',
})

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

function getLoanAmount(value: string) {
  const parsed = Number(value.replace(/[^0-9]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function formatLoanAmountInput(value: string) {
  const loanAmount = getLoanAmount(value)
  return loanAmount > 0 ? numberFormatter.format(loanAmount) : ''
}

function getCreditScore(value: string) {
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : null
}

function getCreditScoreError(value: string) {
  const creditScore = getCreditScore(value)

  if (creditScore === null) {
    return 'Enter a credit score between 500 and 850.'
  }

  if (creditScore < 500 || creditScore > 850) {
    return 'Credit score must be between 500 and 850.'
  }

  return ''
}

function rankLenders(search: SearchForm): RankedLender[] {
  const loanAmount = getLoanAmount(search.loanAmount)
  const creditScore = getCreditScore(search.creditScore)

  return lenders
    .map((lender) => {
      const reasons: string[] = []
      let score = 42

      if (lender.specialties.includes(search.loanType)) {
        score += 18
        reasons.push(`${search.loanType} program available`)
      }

      if (lender.propertyTypes.includes(search.propertyType)) {
        score += 16
        reasons.push(`Comfortable with ${search.propertyType.toLowerCase()} collateral`)
      }

      if (loanAmount >= lender.minAmount && loanAmount <= lender.maxAmount) {
        score += 16
        reasons.push(`Covers ${currencyFormatter.format(loanAmount)} requests`)
      }

      if (creditScore !== null && creditScore >= lender.minCreditScore) {
        score += 12
        reasons.push(`${creditScore} credit score meets ${lender.minCreditScore} minimum`)
      } else if (creditScore !== null) {
        score -= 8
        reasons.push(`${creditScore} credit score is below ${lender.minCreditScore} minimum`)
      }

      if (lender.timelines.includes(search.timeline)) {
        score += 10
        reasons.push(`Can work toward a ${search.timeline} close`)
      }

      return {
        ...lender,
        score: Math.min(score, 98),
        reasons,
      }
    })
    .sort((a, b) => b.score - a.score)
}

export function App() {
  const [form, setForm] = useState<SearchForm>(defaultSearch)
  const [submittedSearch, setSubmittedSearch] = useState<SearchForm>(defaultSearch)
  const creditScoreError = getCreditScoreError(form.creditScore)
  const previewLenders = useMemo(() => rankLenders(form), [form])
  const rankedLenders = useMemo(() => rankLenders(submittedSearch), [submittedSearch])
  const topMatch = previewLenders[0]

  function updateField<Field extends keyof SearchForm>(field: Field, value: SearchForm[Field]) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (creditScoreError) {
      return
    }

    setSubmittedSearch(form)
  }

  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="hero-title">
        <nav className="nav" aria-label="Primary navigation">
          <div className="brand">
            <span className="brand-mark">B</span>
            <span>Blender Cap</span>
          </div>
          <div className="nav-links">
            <a href="#search">Search</a>
            <a href="#matches">Results</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Lender matching for brokers</p>
            <h1 id="hero-title">Run a lender search before you submit.</h1>
            <p className="hero-copy">
              Enter a loan scenario, search the marketplace, and review ranked lender matches by
              appetite, speed, and underwriting fit.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#search">
                Start demo search
              </a>
              <a className="button button-secondary" href="#matches">
                View current results
              </a>
            </div>
          </div>

          <aside className="match-card" aria-labelledby="preview-title">
            <h2 id="preview-title">Live search preview</h2>
            <div className="scenario">
              <div className="field">
                <span>Loan type:</span>
                <span>{form.loanType}</span>
              </div>
              <div className="field">
                <span>Loan amount:</span>
                <span>{currencyFormatter.format(getLoanAmount(form.loanAmount))}</span>
              </div>
              <div className="field">
                <span>Target close:</span>
                <span>{form.timeline}</span>
              </div>
            </div>
            {topMatch ? (
              <article className="lender featured-lender">
                <strong>{topMatch.name}</strong>
                <small>{topMatch.note}</small>
                <span className="score">{topMatch.score}%</span>
              </article>
            ) : null}
          </aside>
        </div>

        <section className="search-panel" id="search" aria-labelledby="search-title">
          <div className="section-heading">
            <p className="eyebrow">Interactive demo</p>
            <h2 id="search-title">Complete a search</h2>
            <p>
              Adjust the scenario and submit it to refresh ranked matches from the demo lender
              marketplace.
            </p>
          </div>

          <form className="search-form" onSubmit={handleSubmit}>
            <label>
              Loan type
              <select
                value={form.loanType}
                onChange={(event) => updateField('loanType', event.target.value as LoanType)}
              >
                <option>Bridge</option>
                <option>DSCR</option>
                <option>Fix &amp; flip</option>
                <option>Construction</option>
              </select>
            </label>

            <label>
              Property type
              <select
                value={form.propertyType}
                onChange={(event) => updateField('propertyType', event.target.value as PropertyType)}
              >
                <option>Residential</option>
                <option>Mixed-use</option>
                <option>Multifamily</option>
                <option>Retail</option>
              </select>
            </label>

            <label>
              Loan amount
              <input
                inputMode="numeric"
                min="100000"
                step="50000"
                type="text"
                value={formatLoanAmountInput(form.loanAmount)}
                onChange={(event) =>
                  updateField('loanAmount', event.target.value.replace(/[^0-9]/g, ''))
                }
              />
            </label>

            <label>
              Credit profile
              <input
                aria-describedby="credit-score-hint"
                aria-invalid={creditScoreError ? 'true' : 'false'}
                inputMode="numeric"
                max="850"
                maxLength={3}
                min="500"
                placeholder="680"
                type="number"
                value={form.creditScore}
                onChange={(event) =>
                  updateField('creditScore', event.target.value.replace(/[^0-9]/g, '').slice(0, 3))
                }
              />
              <span className={creditScoreError ? 'field-error' : 'field-hint'} id="credit-score-hint">
                {creditScoreError || 'Enter a score from 500 to 850.'}
              </span>
            </label>

            <label>
              Target close
              <select
                value={form.timeline}
                onChange={(event) => updateField('timeline', event.target.value as Timeline)}
              >
                <option>14 days</option>
                <option>21 days</option>
                <option>30+ days</option>
              </select>
            </label>

            <button className="button button-primary" type="submit">
              Search lenders
            </button>
          </form>
        </section>

        <section className="results-panel" id="matches" aria-labelledby="matches-title">
          <div className="section-heading">
            <p className="eyebrow">Ranked results</p>
            <h2 id="matches-title">Best lender matches for this scenario</h2>
            <p>
              {rankedLenders.length} lenders scored for a {submittedSearch.propertyType}{' '}
              {submittedSearch.loanType} request.
            </p>
          </div>

          <div className="results-list">
            {rankedLenders.map((lender) => (
              <article className="result-card" key={lender.name}>
                <div>
                  <div className="result-header">
                    <h3>{lender.name}</h3>
                    <span>{lender.score}% fit</span>
                  </div>
                  <p>{lender.note}</p>
                  <ul>
                    {lender.reasons.length > 0 ? (
                      lender.reasons.map((reason) => <li key={reason}>{reason}</li>)
                    ) : (
                      <li>Review manually: outside the strongest demo appetite bands.</li>
                    )}
                  </ul>
                </div>
                <a
                  className="button button-secondary"
                  href={`mailto:quotes@blendercap.com?subject=${encodeURIComponent(
                    `Scenario for ${lender.name}`,
                  )}`}
                >
                  Request quote
                </a>
              </article>
            ))}
          </div>
        </section>

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
