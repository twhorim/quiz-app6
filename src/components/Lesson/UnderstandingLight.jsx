import './UnderstandingLight.css'

export default function UnderstandingLight({ onSelect }) {
  const lights = [
    { key: 'green', emoji: '🟢', label: '잘 이해함', color: 'var(--color-light-green)' },
    { key: 'yellow', emoji: '🟡', label: '보통', color: 'var(--color-light-yellow)' },
    { key: 'red', emoji: '🔴', label: '어려움', color: 'var(--color-light-red)' },
  ]

  return (
    <div className="understanding-light animate-fade-in">
      <div className="card understanding-card">
        <h3 className="understanding-title">이해도를 선택해 주세요</h3>
        <p className="understanding-desc">오늘 배운 내용이 얼마나 이해되었나요?</p>
        <div className="understanding-buttons">
          {lights.map((light) => (
            <button
              key={light.key}
              className="btn understanding-btn"
              style={{ '--light-color': light.color }}
              onClick={() => onSelect(light.key)}
            >
              <span className="understanding-emoji">{light.emoji}</span>
              <span className="understanding-label">{light.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
