import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type LoanType = 'Bridge' | 'DSCR' | 'Fix & flip' | 'Construction'
type PropertyType = 'Residential' | 'Mixed-use' | 'Multifamily' | 'Retail'
type Timeline = '14 days' | '21 days' | '30+ days'

type SearchForm = {
  loanType: LoanType
  propertyType: PropertyType
  propertyCity: string
  propertyState: string
  propertyZipCode: string
  loanAmount: string
  requestedLtv: string
  creditScore: string
  timeline: Timeline
}

type Lender = {
  name: string
  specialties: LoanType[]
  propertyTypes: PropertyType[]
  minAmount: number
  maxAmount: number
  maxLtv: number
  minCreditScore: number
  timelines: Timeline[]
  responseTime: string
  note: string
}

type RankedLender = Lender & {
  score: number
  reasons: string[]
}

type PopulationArea = {
  city: string
  state: string
  population: number
  latitude: number
  longitude: number
}

type KnownPropertyLocation = {
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
}

const defaultSearch: SearchForm = {
  loanType: 'Bridge',
  propertyType: 'Mixed-use',
  propertyCity: 'Booneville',
  propertyState: 'KY',
  propertyZipCode: '41314',
  loanAmount: '2400000',
  requestedLtv: '68',
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
    maxLtv: 75,
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
    maxLtv: 80,
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
    maxLtv: 70,
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
    maxLtv: 65,
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

const populatedAreas: PopulationArea[] = [
  { city: 'Los Angeles', state: 'CA', population: 3820914, latitude: 34.0522, longitude: -118.2437 },
  { city: 'New York', state: 'NY', population: 8258035, latitude: 40.7128, longitude: -74.006 },
  { city: 'Chicago', state: 'IL', population: 2664452, latitude: 41.8781, longitude: -87.6298 },
  { city: 'Houston', state: 'TX', population: 2314157, latitude: 29.7604, longitude: -95.3698 },
  { city: 'Phoenix', state: 'AZ', population: 1650070, latitude: 33.4484, longitude: -112.074 },
  { city: 'Philadelphia', state: 'PA', population: 1550542, latitude: 39.9526, longitude: -75.1652 },
  { city: 'Miami', state: 'FL', population: 455924, latitude: 25.7617, longitude: -80.1918 },
  { city: 'Atlanta', state: 'GA', population: 510823, latitude: 33.749, longitude: -84.388 },
  { city: 'Denver', state: 'CO', population: 715522, latitude: 39.7392, longitude: -104.9903 },
  { city: 'Seattle', state: 'WA', population: 755078, latitude: 47.6062, longitude: -122.3321 },
  { city: 'Austin', state: 'TX', population: 979882, latitude: 30.2672, longitude: -97.7431 },
  { city: 'Nashville', state: 'TN', population: 689447, latitude: 36.1627, longitude: -86.7816 },
  { city: 'Raleigh', state: 'NC', population: 476587, latitude: 35.7796, longitude: -78.6382 },
  { city: 'Bakersfield', state: 'CA', population: 410647, latitude: 35.3733, longitude: -119.0187 },
]

const knownPropertyLocations: KnownPropertyLocation[] = [
  { city: 'Booneville', state: 'KY', zipCode: '41314', latitude: 37.4762, longitude: -83.6746 },
  { city: 'Austin', state: 'TX', zipCode: '78701', latitude: 30.2711, longitude: -97.7437 },
  { city: 'Bakersfield', state: 'CA', zipCode: '93301', latitude: 35.3733, longitude: -119.0187 },
  { city: 'Miami', state: 'FL', zipCode: '33131', latitude: 25.7644, longitude: -80.1893 },
]

function getLoanAmount(value: string) {
  const parsed = Number(value.replace(/[^0-9]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function formatLoanAmountInput(value: string) {
  const loanAmount = getLoanAmount(value)
  return loanAmount > 0 ? numberFormatter.format(loanAmount) : ''
}

function getRequestedLtv(value?: string) {
  const parsed = Number((value ?? '').replace(/[^0-9.]/g, ''))
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 100) : 0
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

function getDistanceInMiles(
  first: Pick<KnownPropertyLocation, 'latitude' | 'longitude'>,
  second: Pick<PopulationArea, 'latitude' | 'longitude'>,
) {
  const earthRadiusMiles = 3958.8
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180
  const latitudeDelta = toRadians(second.latitude - first.latitude)
  const longitudeDelta = toRadians(second.longitude - first.longitude)
  const firstLatitude = toRadians(first.latitude)
  const secondLatitude = toRadians(second.latitude)
  const angle =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle))
}

function getKnownPropertyLocation(search: SearchForm) {
  const normalizedCity = search.propertyCity.trim().toLowerCase()
  const normalizedState = search.propertyState.trim().toUpperCase()
  const normalizedZipCode = search.propertyZipCode.replace(/[^0-9]/g, '')

  return knownPropertyLocations.find((location) => {
    const cityMatches = location.city.toLowerCase() === normalizedCity
    const stateMatches = location.state === normalizedState
    const zipMatches = location.zipCode === normalizedZipCode

    return (cityMatches && stateMatches) || zipMatches
  })
}

function getLocationVerification(search: SearchForm) {
  const propertyLocation = getKnownPropertyLocation(search)
  const locationLabel =
    [search.propertyCity.trim(), search.propertyState.trim().toUpperCase()]
      .filter(Boolean)
      .join(', ') || 'the property city'

  if (!propertyLocation) {
    return `Verify location manually: ${locationLabel} is not in the demo proximity dataset for 10,000+ population areas.`
  }

  const nearestArea = populatedAreas
    .map((area) => ({
      ...area,
      distance: getDistanceInMiles(propertyLocation, area),
    }))
    .sort((a, b) => a.distance - b.distance)[0]

  if (!nearestArea || nearestArea.population <= 10000 || nearestArea.distance > 20) {
    const nearestLabel = nearestArea
      ? `${nearestArea.city}, ${nearestArea.state} (${Math.round(nearestArea.distance)} miles away)`
      : 'no qualifying populated area'

    return `Verify with user: ${locationLabel} appears outside 20 miles of a 10,000+ population area; nearest demo match is ${nearestLabel}.`
  }

  return null
}

function rankLenders(search: SearchForm): RankedLender[] {
  const loanAmount = getLoanAmount(search.loanAmount)
  const requestedLtv = getRequestedLtv(search.requestedLtv)
  const creditScore = getCreditScore(search.creditScore)
  const locationVerification = getLocationVerification(search)

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

      if (requestedLtv > 0 && requestedLtv <= lender.maxLtv) {
        score += 10
        reasons.push(`Supports ${requestedLtv}% requested LTV`)
      } else if (requestedLtv > 0) {
        reasons.push(`Verify LTV: ${requestedLtv}% requested exceeds ${lender.maxLtv}% stated max`)
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

      if (locationVerification) {
        reasons.push(locationVerification)
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
  const submittedLocationVerification = useMemo(
    () => getLocationVerification(submittedSearch),
    [submittedSearch],
  )
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
                <span>LTV:</span>
                <span>{getRequestedLtv(form.requestedLtv)}%</span>
              </div>
              <div className="field">
                <span>Property:</span>
                <span>
                  {form.propertyCity}, {form.propertyState} {form.propertyZipCode}
                </span>
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
              Requested Loan to Value (LTV%)
              <input
                inputMode="decimal"
                max="100"
                min="0"
                step="0.1"
                type="number"
                value={form.requestedLtv}
                onChange={(event) => updateField('requestedLtv', event.target.value)}
              />
            </label>

            <label>
              Property city
              <input
                autoComplete="address-level2"
                type="text"
                value={form.propertyCity}
                onChange={(event) => updateField('propertyCity', event.target.value)}
              />
            </label>

            <label>
              Property state
              <input
                autoComplete="address-level1"
                maxLength={2}
                type="text"
                value={form.propertyState}
                onChange={(event) => updateField('propertyState', event.target.value.toUpperCase())}
              />
            </label>

            <label>
              Property Zip Code
              <input
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={5}
                pattern="[0-9]{5}"
                type="text"
                value={form.propertyZipCode}
                onChange={(event) =>
                  updateField('propertyZipCode', event.target.value.replace(/[^0-9]/g, ''))
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
              {submittedSearch.loanType} request at {getRequestedLtv(submittedSearch.requestedLtv)}%
              LTV in {submittedSearch.propertyCity}, {submittedSearch.propertyState}{' '}
              {submittedSearch.propertyZipCode}.
            </p>
          </div>

          {submittedLocationVerification ? (
            <div className="verification-alert" role="status">
              {submittedLocationVerification}
            </div>
          ) : null}

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
