import { useState } from 'react'
import './ConceptCard.css'

export default function ConceptCard({ concepts, onNext }) {
  const [current, setCurrent] = useState(0)
  const [visited, setVisited] = useState(new Set([0]))

  const total = concepts.length
  const concept = concepts[current]

  const goPrev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  const goNext = () => {
    if (current < total - 1) {
      const next = current + 1
      setCurrent(next)
      setVisited((prev) => new Set(prev).add(next))
    }
  }

  const goTo = (i) => {
    setCurrent(i)
    setVisited((prev) => new Set(prev).add(i))
  }

  const allViewed = visited.size === total

  return (
    <div className="concept-card-container animate-fade-in">
      <div className="card concept-card" key={current}>
        <div className="concept-emoji">{concept.emoji}</div>
        <h3 className="concept-title">{concept.title}</h3>
        <p className="concept-content">{concept.content}</p>
        <div className="concept-example">
          <span className="concept-example-label">💡 예시</span>
          <p>{concept.example}</p>
        </div>
      </div>

      <div className="concept-nav">
        <button
          className="btn btn-ghost"
          onClick={goPrev}
          disabled={current === 0}
        >
          ◀ 이전
        </button>

        <div className="concept-dots">
          {concepts.map((_, i) => (
            <button
              key={i}
              className={`concept-dot ${i === current ? 'active' : ''} ${visited.has(i) ? 'visited' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`개념 ${i + 1}`}
            />
          ))}
        </div>

        {current < total - 1 ? (
          <button className="btn btn-ghost" onClick={goNext}>
            다음 ▶
          </button>
        ) : (
          <span style={{ minWidth: 80 }} />
        )}
      </div>

      {allViewed && (
        <button
          className="btn btn-primary btn-lg concept-proceed animate-scale-in"
          onClick={onNext}
        >
          다음으로
        </button>
      )}
    </div>
  )
}
