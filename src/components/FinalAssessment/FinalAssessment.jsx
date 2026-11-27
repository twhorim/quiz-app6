import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { finalQuiz } from '../../data/quizzes'
import { saveFinalResult, getStudentData } from '../../utils/storage'
import MultipleChoice from '../Quiz/MultipleChoice'
import OXQuestion from '../Quiz/OXQuestion'
import ShortAnswer from '../Quiz/ShortAnswer'
import './FinalAssessment.css'

export default function FinalAssessment() {
  const navigate = useNavigate()
  const objectiveQuestions = finalQuiz.filter((q) => q.type !== 'essay')
  const essayQuestion = finalQuiz.find((q) => q.type === 'essay')

  // State
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [answeredCurrent, setAnsweredCurrent] = useState(false)
  const [inEssayStep, setInEssayStep] = useState(false)
  const [essayText, setEssayText] = useState('')
  const [showResult, setShowResult] = useState(false)

  // Retry mode for incorrect answers
  const [isRetryMode, setIsRetryMode] = useState(false)
  const [retryQuestions, setRetryQuestions] = useState([])
  const [retryAnswers, setRetryAnswers] = useState([])

  const currentQ = isRetryMode ? retryQuestions[currentIdx] : objectiveQuestions[currentIdx]
  const totalObjective = isRetryMode ? retryQuestions.length : objectiveQuestions.length

  const handleAnswer = (isCorrect) => {
    if (isRetryMode) {
      setRetryAnswers((prev) => [...prev, isCorrect])
    } else {
      setAnswers((prev) => [...prev, isCorrect])
    }
    setAnsweredCurrent(true)
  }

  const handleNext = () => {
    if (currentIdx < totalObjective - 1) {
      setCurrentIdx((prev) => prev + 1)
      setAnsweredCurrent(false)
    } else {
      // Reached end of objective questions
      if (isRetryMode) {
        // Apply retried answers back
        const updatedAnswers = [...answers]
        retryQuestions.forEach((rq, rIdx) => {
          const originalIdx = objectiveQuestions.findIndex((q) => q.question === rq.question)
          if (originalIdx !== -1 && retryAnswers[rIdx]) {
            updatedAnswers[originalIdx] = true
          }
        })
        setAnswers(updatedAnswers)
        setIsRetryMode(false)
        setShowResult(true)
      } else {
        setInEssayStep(true)
      }
    }
  }

  const handleEssaySubmit = () => {
    const correctCount = answers.filter(Boolean).length
    const scorePercent = Math.round((correctCount / objectiveQuestions.length) * 100)

    saveFinalResult({
      score: scorePercent,
      correctCount,
      totalCount: objectiveQuestions.length,
      essayAnswer: essayText,
      answers,
    })

    setShowResult(true)
  }

  const startRetry = () => {
    const wrongList = objectiveQuestions.filter((_, idx) => !answers[idx])
    if (wrongList.length === 0) return
    setRetryQuestions(wrongList)
    setRetryAnswers([])
    setCurrentIdx(0)
    setAnsweredCurrent(false)
    setIsRetryMode(true)
    setShowResult(false)
    setInEssayStep(false)
  }

  // Final Results Screen
  if (showResult) {
    const correctCount = answers.filter(Boolean).length
    const totalCount = objectiveQuestions.length
    const scorePercent = Math.round((correctCount / totalCount) * 100)
    const hasWrong = answers.some((a) => !a)

    return (
      <div className="final-result-card card animate-fade-in">
        <div className="final-badge">단원 종합 평가 결과</div>
        <h1 className="final-title">
          {scorePercent === 100 ? '🏆 알고리즘 마스터!' : scorePercent >= 60 ? '🎉 단원 학습 완수!' : '💪 조금 더 복습해 볼까요?'}
        </h1>
        <p className="final-sub">
          '알고리즘과 프로그래밍' 단원의 종합 평가와 서술형 과제를 모두 마쳤습니다.
        </p>

        {/* Score banner */}
        <div className="score-summary-box">
          <div className="score-main">
            <span className="score-value">{scorePercent}</span>
            <span className="score-unit">점</span>
          </div>
          <div className="score-detail">
            객관식/단답형 정답: <strong>{correctCount}</strong> / {totalCount}문항
          </div>
        </div>

        {/* Item by item review */}
        <div className="review-list">
          <h3 className="review-heading">📋 문항별 결과 점검</h3>
          {objectiveQuestions.map((q, idx) => (
            <div key={idx} className="review-item">
              <span className={`badge ${answers[idx] ? 'badge-success' : 'badge-error'}`}>
                {answers[idx] ? '✅ 정답' : '❌ 오답'}
              </span>
              <div className="review-content">
                <p className="review-q-text"><strong>{idx + 1}번.</strong> {q.question}</p>
                <p className="review-explanation">💡 <em>{q.explanation}</em></p>
              </div>
            </div>
          ))}
        </div>

        {/* Essay Answer Review */}
        <div className="essay-review-box">
          <h3 className="review-heading">✍️ 나의 서술형 답변</h3>
          <p className="essay-student-response">{essayText || '(작성된 답변 없음)'}</p>
          <div className="essay-model-answer">
            <strong>모범 예시 답안:</strong> {essayQuestion?.sampleAnswer}
            <br />
            <strong>채점 기준:</strong> {essayQuestion?.explanation}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="final-actions-row">
          {hasWrong && (
            <button className="btn btn-outline btn-lg" onClick={startRetry}>
              🔄 오답만 다시 풀기
            </button>
          )}
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/records')}>
            📊 내 전체 학습 기록 보기
          </button>
          <button className="btn btn-accent btn-lg" onClick={() => navigate('/')}>
            🏠 단원 지도로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  // Essay Question Step
  if (inEssayStep) {
    return (
      <div className="final-essay-step card animate-fade-in">
        <div className="essay-header">
          <span className="badge badge-accent">단원 마무리 서술형 문항</span>
          <h2 className="essay-q-title">{essayQuestion.question}</h2>
          <p className="essay-guide">
            일상생활에서 경험한 일 중, <strong>순차</strong>, <strong>선택</strong>, <strong>반복</strong> 구조가 들어간 상황을 자유롭게 작성해 보세요.
          </p>
        </div>

        <div className="essay-input-wrapper">
          <textarea
            className="essay-textarea"
            placeholder="예시: 아침에 일어나서 양치하고 세수한다(순차). 비가 오면 우산을 챙긴다(선택). 목적지까지 걷는 것을 반복한다(반복)."
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            rows={6}
          />
          <div className="essay-char-count">{essayText.length}자 입력됨</div>
        </div>

        <div className="essay-actions">
          <button
            className="btn btn-primary btn-lg w-full"
            onClick={handleEssaySubmit}
            disabled={essayText.trim().length < 5}
          >
            서술형 답변 제출하고 최종 결과 보기 ➔
          </button>
        </div>
      </div>
    )
  }

  // Objective Question Step
  const QuestionComponent =
    currentQ.type === 'mc'
      ? MultipleChoice
      : currentQ.type === 'ox'
      ? OXQuestion
      : ShortAnswer

  return (
    <div className="final-assessment-container animate-fade-in">
      <div className="fa-header card">
        <div className="fa-title-box">
          <span className="badge badge-primary">
            {isRetryMode ? '🔄 오답 다시 풀기' : '🏆 단원 마무리 종합 평가'}
          </span>
          <h2 className="fa-title">
            문제 {currentIdx + 1} / {totalObjective}
          </h2>
        </div>

        {/* Progress bar */}
        <div className="fa-progress-bar">
          <div
            className="fa-progress-fill"
            style={{ width: `${((currentIdx + 1) / totalObjective) * 100}%` }}
          />
        </div>
      </div>

      <div className="card fa-question-card" key={`${isRetryMode}-${currentIdx}`}>
        <QuestionComponent question={currentQ} onAnswer={handleAnswer} />
      </div>

      {answeredCurrent && (
        <button
          className="btn btn-primary btn-lg fa-next-btn animate-scale-in"
          onClick={handleNext}
        >
          {currentIdx < totalObjective - 1 ? '다음 문제 ➔' : isRetryMode ? '결과 다시 확인' : '서술형 문제로 이동 ➔'}
        </button>
      )}
    </div>
  )
}
