import './LearningObjective.css'

export default function LearningObjective({ lesson, onNext }) {
  return (
    <div className="learning-objective animate-fade-in">
      <div className="card objective-card">
        <div className="objective-icon">{lesson.icon}</div>
        <h2 className="objective-title">{lesson.title}</h2>
        <div className="objective-label">🎯 학습 목표</div>
        <p className="objective-text">{lesson.objective}</p>
        <button className="btn btn-primary btn-lg objective-btn" onClick={onNext}>
          학습 시작
        </button>
      </div>
    </div>
  )
}
