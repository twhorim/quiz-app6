import { useState } from 'react'
import './MultipleChoice.css'

export default function MultipleChoice({ question, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const answered = selected !== null

  const handleSelect = (index) => {
    if (answered) return
    setSelected(index)
    onAnswer(index === question.answer)
  }

  return (
    <div className="mc-question animate-fade-in">
      <p className="mc-question-text">{question.question}</p>
      <div className="mc-options">
        {question.options.map((opt, i) => {
          let cls = 'btn mc-option'
          if (answered) {
            if (i === question.answer) cls += ' mc-correct'
            else if (i === selected) cls += ' mc-wrong'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleSelect(i)}
              disabled={answered}
            >
              <span className="mc-option-num">{i + 1}</span>
              <span className="mc-option-text">{opt}</span>
            </button>
          )
        })}
      </div>
      {answered && (
        <div className={`mc-feedback card animate-scale-in ${selected === question.answer ? 'mc-feedback-correct' : 'mc-feedback-wrong'}`}>
          <span className="mc-feedback-icon">
            {selected === question.answer ? '✅' : '❌'}
          </span>
          <span className="mc-feedback-label">
            {selected === question.answer ? '정답!' : '오답'}
          </span>
          <p className="mc-feedback-text">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
