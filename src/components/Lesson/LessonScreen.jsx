import { useState, lazy, Suspense } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { lessons } from '../../data/lessons'
import { lessonQuizzes } from '../../data/quizzes'
import { saveLessonResult, getStudentData } from '../../utils/storage'
import LearningObjective from './LearningObjective'
import ConceptCard from './ConceptCard'
import Quiz from '../Quiz/Quiz'
import UnderstandingLight from './UnderstandingLight'
import Reflection from './Reflection'
import './LessonScreen.css'

// Lazy loaded activity components
const RobotGrid = lazy(() => import('../Activities/RobotGrid/RobotGrid'))
const ConditionLab = lazy(() => import('../Activities/ConditionLab/ConditionLab'))
const VariableList = lazy(() => import('../Activities/VariableList/VariableList'))
const MazeEscape = lazy(() => import('../Activities/MazeEscape/MazeEscape'))

const STEPS = [
  { key: 'objective', label: '학습 목표' },
  { key: 'concepts', label: '개념 카드' },
  { key: 'activity', label: '탐구 활동' },
  { key: 'quiz', label: '형성평가' },
  { key: 'understanding', label: '이해도 확인' },
  { key: 'reflection', label: '한 줄 성찰' },
]

export default function LessonScreen() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const id = parseInt(lessonId, 10)

  const lesson = lessons.find((l) => l.id === id)
  const quizzes = lessonQuizzes[id] || []

  // Current sub-step in this lesson
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // Transient state collected during the flow
  const [quizResult, setQuizResult] = useState(null)
  const [understanding, setUnderstanding] = useState(null)
  const [activityDone, setActivityDone] = useState(false)
  const [completed, setCompleted] = useState(false)

  if (!lesson) {
    return (
      <div className="card text-center p-xl">
        <h2>존재하지 않는 차시입니다.</h2>
        <button className="btn btn-primary mt-md" onClick={() => navigate('/')}>
          단원 지도로 이동
        </button>
      </div>
    )
  }

  const currentStep = STEPS[currentStepIndex]?.key

  // Handlers for step progression
  const handleObjectiveNext = () => {
    setCurrentStepIndex(1) // to concepts
  }

  const handleConceptsNext = () => {
    setCurrentStepIndex(2) // to activity
  }

  const handleActivityComplete = () => {
    setActivityDone(true)
    setCurrentStepIndex(3) // to quiz
  }

  const handleQuizComplete = (result) => {
    setQuizResult(result)
    setCurrentStepIndex(4) // to understanding
  }

  const handleUnderstandingSelect = (color) => {
    setUnderstanding(color)
    setCurrentStepIndex(5) // to reflection
  }

  const handleReflectionSubmit = (text) => {
    // Save to localStorage
    saveLessonResult(id, {
      quizScore: quizResult ? Math.round((quizResult.score / quizResult.total) * 100) : 100,
      quizAnswers: quizResult ? quizResult.answers : [],
      understanding,
      reflection: text,
      activityCompleted: true,
    })
    setCompleted(true)
  }

  const renderActivity = () => {
    switch (id) {
      case 1:
        return <RobotGrid onComplete={handleActivityComplete} />
      case 2:
        return <ConditionLab onComplete={handleActivityComplete} />
      case 3:
        return <VariableList onComplete={handleActivityComplete} />
      case 4:
        return <MazeEscape onComplete={handleActivityComplete} />
      default:
        return (
          <div className="card p-xl text-center">
            <p>탐구 활동 준비 중입니다.</p>
            <button className="btn btn-primary mt-md" onClick={handleActivityComplete}>
              다음 단계로
            </button>
          </div>
        )
    }
  }

  if (completed) {
    return (
      <div className="lesson-complete-view card animate-fade-in">
        <div className="complete-icon">🎉</div>
        <h2>{lesson.id}차시 학습을 완료했어요!</h2>
        <p className="complete-sub">
          <strong>{lesson.title}</strong> 탐구 활동과 퀴즈를 모두 마쳤습니다.
        </p>

        <div className="complete-summary">
          <div className="summary-item">
            <span className="summary-label">형성평가 점수</span>
            <span className="summary-value font-accent">
              {quizResult ? `${quizResult.score} / ${quizResult.total}` : '-'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">이해도 신호등</span>
            <span className="summary-value">
              {understanding === 'green' ? '🟢 잘 이해함' : understanding === 'yellow' ? '🟡 보통' : '🔴 어려움'}
            </span>
          </div>
        </div>

        <div className="complete-actions">
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/records')}>
            내 학습 기록 보기
          </button>
          {id < 4 ? (
            <button className="btn btn-primary btn-lg" onClick={() => navigate(`/lesson/${id + 1}`)}>
              다음 {id + 1}차시 학습하기 ➔
            </button>
          ) : (
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/final')}>
              🏆 단원 마무리 평가로 가기
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="lesson-screen">
      {/* Lesson Header */}
      <div className="lesson-header">
        <div className="lesson-title-bar">
          <span className="lesson-badge">{lesson.id}차시</span>
          <h1 className="lesson-title">
            <span className="lesson-emoji">{lesson.icon}</span> {lesson.title}
          </h1>
        </div>

        {/* Stepper progress */}
        <div className="step-progress-wrapper">
          <div className="step-progress-bar">
            {STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex
              const isCurrent = idx === currentStepIndex
              return (
                <div
                  key={step.key}
                  className={`step-node ${isPast ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                >
                  <div className="step-circle">{isPast ? '✓' : idx + 1}</div>
                  <span className="step-label">{step.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Step Content */}
      <div className="lesson-content-area animate-fade-in" key={currentStep}>
        {currentStep === 'objective' && (
          <LearningObjective lesson={lesson} onNext={handleObjectiveNext} />
        )}

        {currentStep === 'concepts' && (
          <ConceptCard concepts={lesson.concepts} onNext={handleConceptsNext} />
        )}

        {currentStep === 'activity' && (
          <div className="activity-container">
            <Suspense
              fallback={
                <div className="loading-box card p-xl text-center">
                  <div className="spinner"></div>
                  <p>탐구 활동을 불러오는 중...</p>
                </div>
              }
            >
              {renderActivity()}
            </Suspense>
          </div>
        )}

        {currentStep === 'quiz' && (
          <Quiz questions={quizzes} onComplete={handleQuizComplete} />
        )}

        {currentStep === 'understanding' && (
          <UnderstandingLight onSelect={handleUnderstandingSelect} />
        )}

        {currentStep === 'reflection' && (
          <Reflection onSubmit={handleReflectionSubmit} />
        )}
      </div>
    </div>
  )
}
