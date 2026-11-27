import { useState } from 'react'
import './OXQuestion.css'

export default function OXQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const answered = selected !== null

  const handleSelect = (value) => {
    if (answered) return
    setSelected(value)
    onAnswer(value === question.answer)
  }

  const getClass = (value) => {
    let cls = 'btn ox-btn'
    if (value === true) cls += ' ox-o'
    else cls += ' ox-x'
    if (answered) {
      if (value === question.answer) cls += ' ox-correct'
      else if (value === selected) cls += ' ox-wrong'
    }
    return cls
  }

  return (
    <div className="ox-question animate-fade-in">
      <p className="ox-question-text">{question.question}</p>
      <div className="ox-buttons">
        <button
          className={getClass(true)}
          onClick={() => handleSelect(true)}
          disabled={answered}
        >
          ⭕
          <span>맞다</span>
        </button>
        <button
          className={getClass(false)}
          onClick={() => handleSelect(false)}
          disabled={answered}
        >
          ❌
          <span>틀리다</span>
        </button>
      </div>
      {answered && (
        <div className={`ox-feedback card animate-scale-in ${selected === question.answer ? 'ox-feedback-correct' : 'ox-feedback-wrong'}`}>
          <span className="ox-feedback-icon">
            {selected === question.answer ? '✅' : '❌'}
          </span>
          <span className="ox-feedback-label">
            {selected === question.answer ? '정답!' : '오답'}
          </span>
          <p className="ox-feedback-text">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
