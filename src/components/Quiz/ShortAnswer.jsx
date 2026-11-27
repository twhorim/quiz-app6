import { useState } from 'react'
import './ShortAnswer.css'

export default function ShortAnswer({ question, onAnswer }) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (submitted || !value.trim()) return
    const trimmed = value.trim().toLowerCase()
    const correct = question.answer.some(
      (ans) => ans.trim().toLowerCase() === trimmed
    )
    setIsCorrect(correct)
    setSubmitted(true)
    onAnswer(correct)
  }

  return (
    <div className="short-question animate-fade-in">
      <p className="short-question-text">{question.question}</p>
      <form className="short-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="short-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="답을 입력하세요"
          disabled={submitted}
          autoComplete="off"
        />
        {!submitted && (
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!value.trim()}
          >
            제출
          </button>
        )}
      </form>
      {submitted && (
        <div className={`short-feedback card animate-scale-in ${isCorrect ? 'short-feedback-correct' : 'short-feedback-wrong'}`}>
          <span className="short-feedback-icon">
            {isCorrect ? '✅' : '❌'}
          </span>
          <span className="short-feedback-label">
            {isCorrect ? '정답!' : '오답'}
          </span>
          {!isCorrect && (
            <p className="short-feedback-answer">
              정답: {question.answer[0]}
            </p>
          )}
          <p className="short-feedback-text">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
