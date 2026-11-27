import { useState } from 'react'
import MultipleChoice from './MultipleChoice'
import OXQuestion from './OXQuestion'
import ShortAnswer from './ShortAnswer'
import './Quiz.css'

export default function Quiz({ questions, onComplete }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [answered, setAnswered] = useState(false)

  const total = questions.length
  const question = questions[current]

  const handleAnswer = (isCorrect) => {
    setAnswers((prev) => [...prev, isCorrect])
    setAnswered(true)
  }

  const handleNext = () => {
    if (current < total - 1) {
      setCurrent(current + 1)
      setAnswered(false)
    } else {
      setShowResults(true)
    }
  }

  if (showResults) {
    const score = answers.filter(Boolean).length
    return (
      <div className="quiz-results animate-fade-in">
        <div className="card quiz-results-card">
          <h3 className="quiz-results-title">📝 퀴즈 결과</h3>
          <div className="quiz-score">
            <span className="quiz-score-num">{score}</span>
            <span className="quiz-score-sep">/</span>
            <span className="quiz-score-total">{total}</span>
          </div>
          <div className="quiz-score-label">
            {score === total
              ? '🎉 완벽해요!'
              : score >= total * 0.6
                ? '👍 잘했어요!'
                : '💪 다시 복습해 봐요!'}
          </div>
          <div className="quiz-results-list">
            {questions.map((q, i) => (
              <div key={i} className="quiz-result-row">
                <span className={`badge ${answers[i] ? 'badge-success' : 'badge-error'}`}>
                  {answers[i] ? '✅ 정답' : '❌ 오답'}
                </span>
                <span className="quiz-result-q">
                  {i + 1}. {q.question.length > 40 ? q.question.slice(0, 40) + '…' : q.question}
                </span>
              </div>
            ))}
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onComplete({ score, total, answers })}
          >
            다음으로
          </button>
        </div>
      </div>
    )
  }

  const QuestionComponent =
    question.type === 'mc'
      ? MultipleChoice
      : question.type === 'ox'
        ? OXQuestion
        : ShortAnswer

  return (
    <div className="quiz-container animate-fade-in">
      <div className="quiz-header">
        <span className="badge badge-primary">
          문제 {current + 1} / {total}
        </span>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="card quiz-question-card" key={current}>
        <QuestionComponent question={question} onAnswer={handleAnswer} />
      </div>

      {answered && (
        <button
          className="btn btn-primary quiz-next-btn animate-scale-in"
          onClick={handleNext}
        >
          {current < total - 1 ? '다음 문제' : '결과 보기'}
        </button>
      )}
    </div>
  )
}
