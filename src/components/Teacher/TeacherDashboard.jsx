import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllStudentsData, clearAllStudentsData, seedSampleData } from '../../utils/storage'
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
  const [dataSource, setDataSource] = useState('local') // 'sheet' | 'local'
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [syncStatus, setSyncStatus] = useState(null)

  // Direct spreadsheet view URL
  const [sheetViewUrl, setSheetViewUrl] = useState(
    localStorage.getItem('teacher_custom_sheet_url') || config.spreadsheetViewUrl || 'https://sheets.google.com'
  )

  // Load students data: tries Google Sheet first, falls back to LocalStorage
  const loadData = async () => {
    setIsLoading(true)
    let sheetDataLoaded = false

    // 1. Try to fetch from Google Sheet Web App (doGet)
    if (config.googleSheetUrl) {
      try {
        const res = await fetch(config.googleSheetUrl, { method: 'GET' })
        if (res.ok) {
          const json = await res.json()
          if (json.result === 'success' && Array.isArray(json.data) && json.data.length > 0) {
            setStudents(json.data)
            setDataSource('sheet')
            sheetDataLoaded = true
          }
        }
      } catch (err) {
        console.warn('Google Sheet fetch error:', err)
      }
    }

    // 2. If no data from sheet, load from this device's LocalStorage
    if (!sheetDataLoaded) {
      const list = getAllStudentsData()
      setStudents(list)
      setDataSource('local')
    }

    setIsLoading(false)
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
      setPinError('비밀번호가 올바르지 않습니다. (비밀번호: 8688)')
      setPinInput('')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('teacher_auth')
    setIsAuthenticated(false)
    navigate('/')
  }

  // Edit custom spreadsheet URL
  const handleEditSheetUrl = () => {
    const input = window.prompt(
      '선생님의 구글 스프레드시트 주소(URL)를 입력해 주세요:\n(예: https://docs.google.com/spreadsheets/d/시트ID/edit)',
      sheetViewUrl
    )
    if (input && input.trim()) {
      localStorage.setItem('teacher_custom_sheet_url', input.trim())
      setSheetViewUrl(input.trim())
      alert('스프레드시트 주소가 설정되었습니다!')
    }
  }

  // Clear all data
  const handleClearAll = () => {
    if (window.confirm('이 기기에 저장된 모든 학생 기록을 초기화하시겠습니까?')) {
      clearAllStudentsData()
      loadData()
      alert('기록이 초기화되었습니다.')
    }
  }

  // Create sample student records for demonstration
  const handleSeedSamples = () => {
    seedSampleData()
    loadData()
    alert('가상 학생 3명(김민준, 이서연, 홍길동)의 학습 데이터가 생성되었습니다!')
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
      setTimeout(() => {
        setSyncStatus(null)
        loadData()
      }, 2000)
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
      '서술형1(문제분해)',
      '서술형2(제어구조)',
      '서술형3(변수·리스트)',
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
      const essays = s.essayAssignments || {}
      const e1 = essays[1] || essays.essay1 || ''
      const e2 = essays[2] || essays.essay2 || ''
      const e3 = essays[3] || essays.essay3 || ''

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
        `"${e1.replace(/"/g, '""')}"`,
        `"${e2.replace(/"/g, '""')}"`,
        `"${e3.replace(/"/g, '""')}"`,
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
              placeholder="비밀번호 입력 (8688)"
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
          <span className="badge badge-accent">선생님 관리자 모드 · {config.appVersion}</span>
          <h1 className="td-title">🎓 학생 학습 결과 대시보드</h1>
          <p className="td-desc">
            학생들의 차시별 형성평가 점수, 이해도 신호등, 성찰 내용 및 단원평가 결과를 확인합니다.
          </p>
        </div>

        <div className="td-header-right">
          <div className="stat-pill">
            <span className="stat-label">조회된 학생 수</span>
            <span className="stat-num">{students.length}명</span>
          </div>

          <div className="stat-pill">
            <span className="stat-label">데이터 소스</span>
            <span className="stat-val font-bold text-primary">
              {dataSource === 'sheet' ? '☁️ 구글 시트 실시간 연동' : '💻 이 기기 로컬 저장소'}
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
          {/* Direct Link to Google Spreadsheet */}
          <div className="sheet-open-group">
            <a
              href={sheetViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent btn-sheet-link"
            >
              📊 구글 스프레드시트 열기 ↗
            </a>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleEditSheetUrl}
              title="내 구글 시트 주소 직접 입력"
            >
              ⚙️ 주소설정
            </button>
          </div>

          <button className="btn btn-primary" onClick={handleExportCSV} disabled={students.length === 0}>
            📥 엑셀(CSV) 다운로드
          </button>
          <button className="btn btn-outline" onClick={loadData} disabled={isLoading}>
            {isLoading ? '불러오는 중...' : '🔄 새로고침'}
          </button>
          <button className="btn btn-outline" onClick={handleTestSync} disabled={syncStatus === 'sending'}>
            🚀 구글 시트 연결 테스트
          </button>

          {syncStatus === 'sending' && <span className="sync-msg text-info">전송 중...</span>}
          {syncStatus === 'success' && <span className="sync-msg text-success">✅ 시트 전송 성공! (시트 확인)</span>}
          {syncStatus === 'fail' && <span className="sync-msg text-error">❌ 전송 실패 (URL 확인)</span>}
        </div>

        <div className="toolbar-right">
          <button className="btn btn-outline" onClick={handleSeedSamples} title="테스트용 가상 학생 3명을 생성합니다">
            🧪 가상 학생 3명 생성
          </button>
          <button className="btn btn-ghost text-error" onClick={handleClearAll} disabled={students.length === 0}>
            🗑️ 기록 비우기
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="td-table-card card">
        {students.length === 0 ? (
          <div className="td-empty-box">
            <span className="empty-icon">📂</span>
            <h3>현재 대시보드 표에 표시할 학생 데이터가 없습니다.</h3>
            <div className="empty-explanation">
              <p>💡 <strong>학생들이 제출한 결과는 어디에 있나요?</strong></p>
              <ul>
                <li>학생들이 각자의 태블릿에서 제출한 기록은 <strong>선생님의 구글 스프레드시트</strong>로 모이고 있습니다.</li>
                <li>위의 <strong>[📊 구글 스프레드시트 열기 ↗]</strong> 링크를 누르시면 학생 전원의 결과가 모인 시트가 새 창으로 바로 열립니다.</li>
                <li>대시보드 기능(표, 모달, 엑셀 다운로드)을 시험해 보시려면 아래 <strong>[🧪 가상 학생 3명 데이터 생성해보기]</strong> 버튼을 클릭해 보세요!</li>
              </ul>
            </div>
            <div className="empty-actions mt-md">
              <a
                href={sheetViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent btn-lg"
              >
                📊 구글 스프레드시트 확인하기 ↗
              </a>
              <button className="btn btn-primary btn-lg" onClick={handleSeedSamples}>
                🧪 가상 학생 3명 데이터 생성해보기
              </button>
            </div>
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
                        {s.essayAssignments && (s.essayAssignments[1] || s.essayAssignments.essay1) ? (
                          <span className="badge badge-success font-bold" title="서술형 3문항 완료">
                            ✍️ 서술형 완료
                          </span>
                        ) : final && final.essayAnswer ? (
                          <span className="essay-snippet" title={final.essayAnswer}>
                            {final.essayAnswer.slice(0, 20)}...
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

              {/* Essay Assignments (3 Questions) */}
              <div className="detail-section mt-md">
                <h3>✍️ 서술형 수행 과제 (3문항)</h3>
                {selectedStudent.essayAssignments && (selectedStudent.essayAssignments[1] || selectedStudent.essayAssignments.essay1) ? (
                  <div className="essay-detail-list">
                    <div className="essay-detail-item card">
                      <div className="essay-item-title font-bold">Q1. 문제 분해와 알고리즘 설계</div>
                      <div className="essay-item-body">
                        {selectedStudent.essayAssignments[1] || selectedStudent.essayAssignments.essay1 || '(미작성)'}
                      </div>
                    </div>
                    <div className="essay-detail-item card mt-xs">
                      <div className="essay-item-title font-bold">Q2. 제어 구조(순차·선택·반복) 분석</div>
                      <div className="essay-item-body">
                        {selectedStudent.essayAssignments[2] || selectedStudent.essayAssignments.essay2 || '(미작성)'}
                      </div>
                    </div>
                    <div className="essay-detail-item card mt-xs">
                      <div className="essay-item-title font-bold">Q3. 변수와 리스트의 차이점 및 필요성</div>
                      <div className="essay-item-body">
                        {selectedStudent.essayAssignments[3] || selectedStudent.essayAssignments.essay3 || '(미작성)'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">아직 서술형 과제를 제출하지 않았습니다.</p>
                )}
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
