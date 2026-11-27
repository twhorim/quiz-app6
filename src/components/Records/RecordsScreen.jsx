import { lessons } from '../../data/lessons';
import { getStudentData } from '../../utils/storage';
import './RecordsScreen.css';

function RecordsScreen() {
  const studentData = getStudentData();

  const getUnderstandingEmoji = (level) => {
    if (level === 'green') return '🟢';
    if (level === 'yellow') return '🟡';
    if (level === 'red') return '🔴';
    return '⚪';
  };

  const getUnderstandingLabel = (level) => {
    if (level === 'green') return '잘 이해했어요';
    if (level === 'yellow') return '보통이에요';
    if (level === 'red') return '어려웠어요';
    return '미응답';
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-mid';
    return 'score-low';
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}. ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const hasAnyRecord = lessons.some(
    (l) => studentData.lessons[l.id]?.quizScore !== null
  ) || studentData.finalAssessment;

  return (
    <div className="records-screen animate-fade-in">
      <div className="records-header">
        <h1>📊 학습 기록</h1>
        <p>지금까지의 학습 여정을 확인해 보세요.</p>
      </div>

      {!hasAnyRecord ? (
        <div className="card records-empty">
          <span className="empty-icon">📝</span>
          <p>아직 완료한 학습이 없어요.</p>
          <p>차시를 학습하면 여기에 기록이 나타납니다!</p>
        </div>
      ) : (
        <div className="records-list">
          {lessons.map((lesson) => {
            const data = studentData.lessons[lesson.id];
            const completed = data && data.quizScore !== null;

            return (
              <div key={lesson.id} className="card record-card animate-scale-in">
                <div className="record-card-header">
                  <span className="record-icon">{lesson.icon}</span>
                  <div className="record-title-area">
                    <div className="record-lesson-num">{lesson.id}차시</div>
                    <div className="record-lesson-title">{lesson.title}</div>
                  </div>
                  {completed ? (
                    <span className="badge badge-success">✅ 완료</span>
                  ) : (
                    <span className="badge badge-primary">미완료</span>
                  )}
                </div>

                {completed ? (
                  <>
                    <div className="record-body">
                      <div className="record-stat">
                        <div className="stat-label">퀴즈 점수</div>
                        <div className={`stat-value ${getScoreClass(data.quizScore)}`}>
                          {data.quizScore}%
                        </div>
                      </div>
                      <div className="record-stat">
                        <div className="stat-label">이해도</div>
                        <div className="stat-value">
                          {getUnderstandingEmoji(data.understanding)}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                          {getUnderstandingLabel(data.understanding)}
                        </div>
                      </div>
                      <div className="record-stat">
                        <div className="stat-label">활동</div>
                        <div className="stat-value">
                          {data.activityCompleted ? '✅' : '❌'}
                        </div>
                      </div>
                    </div>

                    {data.reflection && (
                      <div className="record-reflection">
                        <div className="reflection-label">💭 성찰 기록</div>
                        {data.reflection}
                      </div>
                    )}

                    {data.completedAt && (
                      <div className="record-date">
                        📅 {formatDate(data.completedAt)}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="not-completed">
                    아직 이 차시를 완료하지 않았어요.
                  </div>
                )}
              </div>
            );
          })}

          {/* Final Assessment */}
          <div className={`card record-card final-record-card animate-scale-in`}>
            <div className="record-card-header">
              <span className="record-icon">🏆</span>
              <div className="record-title-area">
                <div className="record-lesson-num">단원 마무리</div>
                <div className="record-lesson-title">최종 평가</div>
              </div>
              {studentData.finalAssessment ? (
                <span className="badge badge-success">✅ 완료</span>
              ) : (
                <span className="badge badge-primary">미완료</span>
              )}
            </div>

            {studentData.finalAssessment ? (
              <>
                <div className="record-body">
                  <div className="record-stat">
                    <div className="stat-label">최종 점수</div>
                    <div className={`stat-value ${getScoreClass(studentData.finalAssessment.score)}`}>
                      {studentData.finalAssessment.score}%
                    </div>
                  </div>
                  <div className="record-stat">
                    <div className="stat-label">정답 수</div>
                    <div className="stat-value" style={{ color: 'var(--color-primary)' }}>
                      {studentData.finalAssessment.correctCount ?? '—'}/{studentData.finalAssessment.totalCount ?? '—'}
                    </div>
                  </div>
                  <div className="record-stat">
                    <div className="stat-label">평가일</div>
                    <div style={{ fontSize: '15px', color: 'var(--color-text)', marginTop: '8px' }}>
                      {formatDate(studentData.finalAssessment.completedAt)}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="not-completed">
                아직 단원 마무리 평가를 완료하지 않았어요.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordsScreen;
