import { useNavigate } from 'react-router-dom';
import { lessons } from '../../data/lessons';
import { getStudentData } from '../../utils/storage';
import './UnitMap.css';

function UnitMap() {
  const navigate = useNavigate();
  const studentData = getStudentData();

  const isCompleted = (id) => {
    const lesson = studentData.lessons[id];
    return lesson && lesson.quizScore !== null;
  };

  const getScore = (id) => {
    const lesson = studentData.lessons[id];
    return lesson ? lesson.quizScore : null;
  };

  const completedCount = lessons.filter((l) => isCompleted(l.id)).length;
  const allCompleted = completedCount === lessons.length;

  return (
    <div className="unit-map animate-fade-in">
      {/* Welcome */}
      <div className="welcome-header">
        <h1>👋 학습을 시작해 볼까요?</h1>
        <p>아래 차시를 클릭하여 알고리즘의 세계를 탐험하세요!</p>
      </div>

      {/* Progress */}
      <div className="progress-section">
        <span className="progress-label">
          학습 진행률: {completedCount}/{lessons.length} 완료
        </span>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${(completedCount / lessons.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Lesson Grid */}
      <div className="lesson-grid">
        {lessons.map((lesson, idx) => {
          const completed = isCompleted(lesson.id);
          const score = getScore(lesson.id);

          return (
            <div
              key={lesson.id}
              className="card lesson-card animate-scale-in"
              style={{ animationDelay: `${idx * 0.08}s`, animationFillMode: 'both' }}
              onClick={() => navigate(`/lesson/${lesson.id}`)}
            >
              <div className="lesson-card-header">
                <span className="lesson-icon">{lesson.icon}</span>
                <div className="lesson-info">
                  <div className="lesson-number">{lesson.id}차시</div>
                  <div className="lesson-title">{lesson.title}</div>
                </div>
              </div>

              {completed && (
                <span className="lesson-status badge badge-success">✅ 완료</span>
              )}
              {!completed && (
                <span className="lesson-status badge badge-primary">📝 미완료</span>
              )}

              <p className="lesson-objective">{lesson.objective}</p>

              {completed && score !== null && (
                <div className="lesson-score">🎯 퀴즈 점수: {score}%</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final Assessment */}
      <div
        className={`card final-card ${allCompleted ? '' : 'disabled'}`}
        onClick={() => { if (allCompleted) navigate('/final'); }}
      >
        <span className="final-icon">🏆</span>
        <div className="final-title">단원 마무리</div>
        <p className="final-desc">
          {allCompleted
            ? '모든 차시를 완료했어요! 단원 마무리 평가에 도전하세요.'
            : `아직 ${lessons.length - completedCount}개 차시가 남아 있어요. 모든 차시를 완료하면 열려요!`}
        </p>
      </div>
    </div>
  );
}

export default UnitMap;
