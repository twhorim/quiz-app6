import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllStudentsData, clearAllStudentsData } from '../../utils/storage'
import { sendToGoogleSheet } from '../../utils/sheetService'
import { config } from '../../config'
import './TeacherDashboard.css'

const TEACHER_PIN = '8688'

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('teacher_auth') === TEACHER_PIN
  )
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')

  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [syncStatus, setSyncStatus] = useState(null)

  // Load students data
  const loadData = () => {
    const list = getAllStudentsData()
    setStudents(list)
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  // Authentication handler
  const handlePinSubmit = (e) => {
    e.preventDefault()
    if (pinInput.trim() === TEACHER_PIN) {
      sessionStorage.setItem('teacher_auth', TEACHER_PIN)
      setIsAuthenticated(true)
      setPinError('')
    } else {
      setPinError('비밀번호가 올바르지 않습니다. 다시 입력해 주세요.')
      setPinInput('')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('teacher_auth')
    setIsAuthenticated(false)
    navigate('/')
  }

  // Clear all data
  const handleClearAll = () => {
    if (window.confirm('정말로 이 기기에 저장된 모든 학생 기록을 초기화하시겠습니까?')) {
      clearAllStudentsData()
      loadData()
      alert('모든 학생 기록이 초기화되었습니다.')
    }
  }

  // Test Google Sheet connection
  const handleTestSync = async () => {
    setSyncStatus('sending')
    const success = await sendToGoogleSheet({
      type: 'lesson',
      studentId: '9999',
      name: '선생님테스트',
      lessonId: 1,
      quizScore: 100,
      understanding: 'green',
      reflection: '선생님 대시보드 연결 테스트 성공!',
    })

    if (success !== false) {
      setSyncStatus('success')
      setTimeout(() => setSyncStatus(null), 4000)
    } else {
      setSyncStatus('fail')
      setTimeout(() => setSyncStatus(null), 4000)
    }
  }

  // Export to CSV (Excel compatible with UTF-8 BOM)
  const handleExportCSV = () => {
    if (students.length === 0) {
      alert('내보낼 학생 데이터가 없습니다.')
      return
    }

    const headers = [
      '학번',
      '성명',
      '1차시 점수',
      '1차시 이해도',
      '1차시 성찰',
      '2차시 점수',
      '2차시 이해도',
      '2차시 성찰',
      '3차시 점수',
      '3차시 이해도',
      '3차시 성찰',
      '4차시 점수',
      '4차시 이해도',
      '4차시 성찰',
      '단원평가 점수',
      '단원평가 서술형답변',
    ]

    const getLightText = (level) => {
      if (level === 'green') return '🟢 잘 이해함'
      if (level === 'yellow') return '🟡 보통'
      if (level === 'red') return '🔴 어려움'
      return '-'
    }

    const rows = students.map((s) => {
      const l1 = s.lessons?.[1] || {}
      const l2 = s.lessons?.[2] || {}
      const l3 = s.lessons?.[3] || {}
      const l4 = s.lessons?.[4] || {}
      const final = s.finalAssessment || {}

      return [
        s.studentId,
        `"${s.name}"`,
        l1.quizScore !== null && l1.quizScore !== undefined ? `${l1.quizScore}점` : '-',
        getLightText(l1.understanding),
        `"${(l1.reflection || '').replace(/"/g, '""')}"`,
        l2.quizScore !== null && l2.quizScore !== undefined ? `${l2.quizScore}점` : '-',
        getLightText(l2.understanding),
        `"${(l2.reflection || '').replace(/"/g, '""')}"`,
        l3.quizScore !== null && l3.quizScore !== undefined ? `${l3.quizScore}점` : '-',
        getLightText(l3.understanding),
        `"${(l3.reflection || '').replace(/"/g, '""')}"`,
        l4.quizScore !== null && l4.quizScore !== undefined ? `${l4.quizScore}점` : '-',
        getLightText(l4.understanding),
        `"${(l4.reflection || '').replace(/"/g, '""')}"`,
        final.score !== null && final.score !== undefined ? `${final.score}점` : '-',
        `"${(final.essayAnswer || '').replace(/"/g, '""')}"`,
      ]
    })

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `알고리즘랩_학생학습결과_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // 1. Password Screen
  if (!isAuthenticated) {
    return (
      <div className="teacher-auth-screen animate-fade-in">
        <div className="card teacher-auth-card animate-scale-in">
          <div className="auth-lock-icon">🔒</div>
          <h1 className="auth-title">선생님 전용 결과 확인</h1>
          <p className="auth-desc">학습 결과 대시보드에 접근하려면 비밀번호를 입력해 주세요.</p>

          <form onSubmit={handlePinSubmit} className="auth-form">
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              placeholder="비밀번호 4자리 입력"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="form-input auth-pin-input"
              autoFocus
            />

            {pinError && <div className="auth-error-msg animate-fade-in">{pinError}</div>}

            <button type="submit" className="btn btn-primary btn-lg w-full">
              확인 ➔
            </button>
          </form>

          <button className="btn btn-ghost mt-md" onClick={() => navigate('/')}>
            ← 학생 화면으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  // 2. Dashboard Screen
  return (
    <div className="teacher-dashboard animate-fade-in">
      {/* Top Header */}
      <div className="td-header card">
        <div className="td-header-left">
          <span className="badge badge-accent">관리자 모드</span>
          <h1 className="td-title">🎓 학생 학습 결과 대시보드</h1>
          <p className="td-desc">
            학생들의 차시별 형성평가 점수, 이해도 신호등, 성찰 내용 및 단원평가 결과를 확인합니다.
          </p>
        </div>

        <div className="td-header-right">
          <div className="stat-pill">
            <span className="stat-label">총 참여 학생</span>
            <span className="stat-num">{students.length}명</span>
          </div>

          <div className="stat-pill">
            <span className="stat-label">구글 시트 연동</span>
            <span className="stat-val font-bold text-success">
              {config.googleSheetUrl ? '🟢 연동 중' : '⚪ 미설정'}
            </span>
          </div>

          <button className="btn btn-outline" onClick={handleLogout}>
            🚪 나가기
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="td-toolbar card">
        <div className="toolbar-left">
          <button className="btn btn-primary" onClick={handleExportCSV}>
            📥 엑셀(CSV) 파일로 다운로드
          </button>
          <button className="btn btn-outline" onClick={loadData}>
            🔄 새로고침
          </button>
          <button className="btn btn-outline" onClick={handleTestSync} disabled={syncStatus === 'sending'}>
            🚀 구글 시트 연동 테스트
          </button>

          {syncStatus === 'sending' && <span className="sync-msg text-info">전송 중...</span>}
          {syncStatus === 'success' && <span className="sync-msg text-success">✅ 시트 전송 성공!</span>}
          {syncStatus === 'fail' && <span className="sync-msg text-error">❌ 전송 실패 (URL 확인)</span>}
        </div>

        <div className="toolbar-right">
          <button className="btn btn-ghost text-error" onClick={handleClearAll} disabled={students.length === 0}>
            🗑️ 전체 기록 초기화
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="td-table-card card">
        {students.length === 0 ? (
          <div className="td-empty-box">
            <span className="empty-icon">📂</span>
            <h3>아직 제출된 학생 데이터가 없습니다.</h3>
            <p>학생이 차시 학습을 완료하거나 단원평가를 제출하면 여기에 실시간으로 표시됩니다.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="td-table">
              <thead>
                <tr>
                  <th>학번</th>
                  <th>성명</th>
                  <th>1차시 (문제 분해)</th>
                  <th>2차시 (제어 구조)</th>
                  <th>3차시 (변수·리스트)</th>
                  <th>4차시 (프로그램)</th>
                  <th>단원평가 점수</th>
                  <th>서술형 답변</th>
                  <th>상세</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const l1 = s.lessons?.[1]
                  const l2 = s.lessons?.[2]
                  const l3 = s.lessons?.[3]
                  const l4 = s.lessons?.[4]
                  const final = s.finalAssessment

                  const renderLessonCell = (lessonData) => {
                    if (!lessonData || lessonData.quizScore === null || lessonData.quizScore === undefined) {
                      return <span className="text-muted">-</span>
                    }
                    const emoji =
                      lessonData.understanding === 'green'
                        ? '🟢'
                        : lessonData.understanding === 'yellow'
                        ? '🟡'
                        : lessonData.understanding === 'red'
                        ? '🔴'
                        : ''
                    return (
                      <div className="table-lesson-cell">
                        <span className="cell-score font-bold">{lessonData.quizScore}점</span>
                        <span className="cell-light" title={lessonData.understanding}>{emoji}</span>
                        {lessonData.reflection && (
                          <span className="cell-reflection-snippet" title={lessonData.reflection}>
                            "{lessonData.reflection.slice(0, 15)}..."
                          </span>
                        )}
                      </div>
                    )
                  }

                  return (
                    <tr key={`${s.studentId}-${s.name}`}>
                      <td className="font-bold">{s.studentId}</td>
                      <td className="font-bold">{s.name}</td>
                      <td>{renderLessonCell(l1)}</td>
                      <td>{renderLessonCell(l2)}</td>
                      <td>{renderLessonCell(l3)}</td>
                      <td>{renderLessonCell(l4)}</td>
                      <td>
                        {final && final.score !== null && final.score !== undefined ? (
                          <span className="final-score-badge font-bold">{final.score}점</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {final && final.essayAnswer ? (
                          <span className="essay-snippet" title={final.essayAnswer}>
                            {final.essayAnswer.slice(0, 25)}...
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => setSelectedStudent(s)}
                        >
                          보기
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="modal-backdrop animate-fade-in" onClick={() => setSelectedStudent(null)}>
          <div className="card student-detail-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                👤 [{selectedStudent.studentId}] {selectedStudent.name} 학생의 전체 기록
              </h2>
              <button className="modal-close-btn" onClick={() => setSelectedStudent(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>📚 차시별 학습 내역</h3>
                <div className="detail-grid">
                  {[1, 2, 3, 4].map((id) => {
                    const l = selectedStudent.lessons?.[id]
                    return (
                      <div key={id} className="detail-lesson-box card">
                        <div className="detail-lesson-title font-bold">{id}차시</div>
                        {l && l.quizScore !== null && l.quizScore !== undefined ? (
                          <>
                            <div className="detail-row">
                              <span>점수:</span>
                              <strong>{l.quizScore}점</strong>
                            </div>
                            <div className="detail-row">
                              <span>이해도:</span>
                              <span>
                                {l.understanding === 'green'
                                  ? '🟢 잘 이해함'
                                  : l.understanding === 'yellow'
                                  ? '🟡 보통'
                                  : '🔴 어려움'}
                              </span>
                            </div>
                            <div className="detail-row-col">
                              <span>한 줄 성찰:</span>
                              <div className="reflection-quote">"{l.reflection || '(미작성)'}"</div>
                            </div>
                          </>
                        ) : (
                          <span className="text-muted">아직 완료하지 않음</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="detail-section mt-md">
                <h3>🏆 단원 마무리 평가</h3>
                {selectedStudent.finalAssessment ? (
                  <div className="final-detail-box card">
                    <div className="detail-row">
                      <span>종합 평가 점수:</span>
                      <strong className="text-primary font-bold">
                        {selectedStudent.finalAssessment.score}점
                      </strong>
                    </div>
                    <div className="detail-row-col mt-sm">
                      <span>서술형 과제 답변:</span>
                      <div className="essay-full-text">
                        {selectedStudent.finalAssessment.essayAnswer || '(미작성)'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">아직 단원 마무리를 완료하지 않았습니다.</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setSelectedStudent(null)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
