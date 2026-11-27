import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { getSession } from './utils/storage'
import StartScreen from './components/Start/StartScreen'
import Layout from './components/Layout/Layout'
import UnitMap from './components/UnitMap/UnitMap'
import LessonScreen from './components/Lesson/LessonScreen'
import RecordsScreen from './components/Records/RecordsScreen'
import FinalAssessment from './components/FinalAssessment/FinalAssessment'
import TeacherDashboard from './components/Teacher/TeacherDashboard'

function App() {
  const [session, setSessionState] = useState(getSession())

  const handleLogin = (s) => {
    setSessionState(s)
  }

  const handleLogout = () => {
    setSessionState(null)
  }

  return (
    <>
      <MinScreenGuard />
      <Routes>
        <Route path="/teacher" element={<TeacherDashboard />} />
        {!session ? (
          <Route path="*" element={<StartScreen onLogin={handleLogin} />} />
        ) : (
          <Route
            path="/*"
            element={
              <Layout session={session} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<UnitMap />} />
                  <Route path="/lesson/:lessonId" element={<LessonScreen />} />
                  <Route path="/final" element={<FinalAssessment />} />
                  <Route path="/records" element={<RecordsScreen />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            }
          />
        )}
      </Routes>
    </>
  )
}

function MinScreenGuard() {
  return (
    <div className="min-screen-guard">
      <div className="icon">📱</div>
      <h2>화면이 너무 작아요!</h2>
      <p>태블릿이나 노트북을 가로로 돌려서 열어 주세요. (최소 1024×768)</p>
    </div>
  )
}

export default App
