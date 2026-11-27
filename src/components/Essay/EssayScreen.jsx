import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { essayQuestions } from '../../data/essayQuestions'
import { saveEssayAssignments, getStudentData, getSession } from '../../utils/storage'
import { sendToGoogleSheet } from '../../utils/sheetService'
import './EssayScreen.css'

export default function EssayScreen() {
  const navigate = useNavigate()
  const session = getSession()
  const studentData = getStudentData()

  // Initial answers from storage if previously saved
  const initialSaved = studentData.essayAssignments || {}
  const [activeTab, setActiveTab] = useState(1) // 1, 2, 3
  const [answers, setAnswers] = useState({
    1: initialSaved[1] || '',
    2: initialSaved[2] || '',
    3: initialSaved[3] || '',
  })
  const [isSubmitted, setIsSubmitted] = useState(Boolean(initialSaved.completedAt))
  const [showSample, setShowSample] = useState(Boolean(initialSaved.completedAt))

  const currentQ = essayQuestions.find((q) => q.id === activeTab)

  const handleAnswerChange = (val) => {
    setAnswers((prev) => ({ ...prev, [activeTab]: val }))
  }

  const handleNext = () => {
    if (activeTab < 3) {
      setActiveTab((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (activeTab > 1) {
      setActiveTab((prev) => prev - 1)
    }
  }

  const isAllAnswered =
    answers[1].trim().length >= 10 &&
    answers[2].trim().length >= 10 &&
    answers[3].trim().length >= 10

  const handleSubmit = async () => {
    if (!isAllAnswered) {
      alert('모든 문항을 최소 10자 이상 성실히 작성해 주세요.')
      return
    }

    // 1. Save to local storage
    saveEssayAssignments({
      1: answers[1],
      2: answers[2],
      3: answers[3],
    })

    // 2. Background sync to Google Sheet
    if (session) {
      sendToGoogleSheet({
        type: 'essay_assignments',
        studentId: session.studentId,
        name: session.name,
        essay1: answers[1],
        essay2: answers[2],
        essay3: answers[3],
      })
    }

    setIsSubmitted(true)
    setShowSample(true)
  }

  return (
    <div className="essay-screen animate-fade-in">
      {/* Header */}
      <div className="essay-header-card card">
        <div className="essay-header-left">
          <span className="badge badge-accent">컴퓨팅 사고력 서술형 평가</span>
          <h1 className="essay-main-title">✍️ 단원 핵심 역량 서술형 과제</h1>
          <p className="essay-main-desc">
            '알고리즘과 프로그래밍' 단원에서 배운 핵심 개념을 일상생활의 문제와 스마트 기기에 적용하여 서술해 보세요.
          </p>
        </div>

        {isSubmitted && (
          <div className="essay-submitted-tag animate-scale-in">
            ✅ 과제 제출 완료
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="essay-nav-tabs">
        {essayQuestions.map((q) => {
          const isDone = answers[q.id]?.trim().length >= 10
          return (
            <button
              key={q.id}
              className={`essay-tab-btn ${activeTab === q.id ? 'active' : ''}`}
              onClick={() => setActiveTab(q.id)}
            >
              <span className="tab-icon">{q.icon}</span>
              <span className="tab-text">{q.category}</span>
              {isDone && <span className="tab-check">✓</span>}
            </button>
          )
        })}
      </div>

      {/* Main Question Body */}
      <div className="essay-content-card card animate-fade-in" key={currentQ.id}>
        <div className="q-title-row">
          <span className="q-badge">{currentQ.icon} 문항 {currentQ.id}</span>
          <h2 className="q-title-text">{currentQ.title}</h2>
        </div>

        <div className="q-prompt-box">
          <p className="q-prompt-text">{currentQ.question}</p>
        </div>

        <div className="q-guide-box">
          <div className="q-guide-content">
            {currentQ.guide.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>

        {/* Textarea Input */}
        <div className="essay-textarea-wrapper">
          <label className="textarea-label">내 생각 작성하기:</label>
          <textarea
            className="essay-input-area"
            rows={7}
            placeholder="여기에 서술형 답변을 논리적이고 자세하게 작성해 주세요. (최소 10자 이상)"
            value={answers[activeTab]}
            onChange={(e) => handleAnswerChange(e.target.value)}
          />
          <div className="textarea-footer">
            <span className="char-count">
              현재 글자 수: <strong>{answers[activeTab].length}</strong>자
              {answers[activeTab].trim().length < 10 && (
                <span className="char-warning"> (최소 10자 이상 입력 필요)</span>
              )}
            </span>
          </div>
        </div>

        {/* Sample Answer Box (Revealed upon submit or toggle) */}
        {showSample && (
          <div className="sample-answer-box animate-fade-in">
            <div className="sample-header">
              <span className="sample-badge">💡 모범 예시 답안 및 채점 기준</span>
            </div>
            <div className="sample-content">
              {currentQ.sampleAnswer.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="essay-bottom-actions">
          <div className="left-step-buttons">
            <button
              className="btn btn-outline"
              onClick={handlePrev}
              disabled={activeTab === 1}
            >
              ← 이전 문항
            </button>
            <button
              className="btn btn-outline"
              onClick={handleNext}
              disabled={activeTab === 3}
            >
              다음 문항 →
            </button>
          </div>

          <div className="right-submit-buttons">
            <button
              className={`btn btn-lg ${isAllAnswered ? 'btn-accent' : 'btn-primary'}`}
              onClick={handleSubmit}
            >
              {isSubmitted ? '🔄 수정하여 다시 제출하기' : '🚀 3문항 전체 최종 제출하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
