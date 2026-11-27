import { useLocation, useNavigate, Link } from 'react-router-dom';
import { lessons } from '../../data/lessons';
import { getStudentData, clearSession } from '../../utils/storage';
import './Layout.css';

function Layout({ session, onLogout, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const studentData = getStudentData();

  const isActive = (path) => location.pathname === path;
  const isLessonActive = (id) => location.pathname === `/lesson/${id}`;

  const isLessonCompleted = (id) => {
    const lesson = studentData.lessons[id];
    return lesson && lesson.quizScore !== null;
  };

  const handleLogout = () => {
    clearSession();
    onLogout();
    navigate('/');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar animate-slide-in">
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-title">🧪 알고리즘 랩</div>
          <div className="sidebar-session">
            🏫 {session.classCode}반 · {session.studentNum}번
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Home */}
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <span>🗺️</span>
            <span>단원 지도</span>
          </Link>

          <div className="sidebar-divider" />
          <div className="sidebar-section-label">학습 차시</div>

          {/* Lesson links */}
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/lesson/${lesson.id}`}
              className={`nav-link ${isLessonActive(lesson.id) ? 'active' : ''}`}
            >
              <span>{lesson.icon}</span>
              <span>{lesson.id}. {lesson.title}</span>
              {isLessonCompleted(lesson.id) && <span className="nav-check">✅</span>}
            </Link>
          ))}

          <Link
            to="/final"
            className={`nav-link ${isActive('/final') ? 'active' : ''}`}
          >
            <span>🏆</span>
            <span>단원 마무리</span>
          </Link>

          <div className="sidebar-divider" />

          {/* Records */}
          <Link to="/records" className={`nav-link ${isActive('/records') ? 'active' : ''}`}>
            <span>📊</span>
            <span>학습 기록</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="btn logout-btn" onClick={handleLogout}>
            🚪 로그아웃
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
