import { useState } from 'react'
import './Reflection.css'

export default function Reflection({ onSubmit }) {
  const [text, setText] = useState('')
  const maxLen = 200

  const handleSubmit = () => {
    if (!text.trim()) return
    onSubmit(text.trim())
  }

  return (
    <div className="reflection animate-fade-in">
      <div className="card reflection-card">
        <h3 className="reflection-title">✍️ 학습 성찰</h3>
        <p className="reflection-desc">
          오늘 배운 내용 중 가장 기억에 남는 것을 적어 보세요.
        </p>
        <div className="reflection-input-wrap">
          <textarea
            className="reflection-textarea"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxLen))}
            placeholder="여기에 적어 주세요..."
            rows={4}
            maxLength={maxLen}
          />
          <span className="reflection-count">
            {text.length} / {maxLen}
          </span>
        </div>
        <button
          className="btn btn-primary btn-lg reflection-submit"
          onClick={handleSubmit}
          disabled={!text.trim()}
        >
          제출하기
        </button>
      </div>
    </div>
  )
}
