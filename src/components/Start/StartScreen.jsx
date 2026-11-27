import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setSession } from '../../utils/storage';
import './StartScreen.css';

function StartScreen({ onLogin }) {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStudentIdChange = (e) => {
    // Only allow numbers and max 4 digits
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setStudentId(val);
    if (errorMsg) setErrorMsg('');
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedId = studentId.trim();
    const trimmedName = name.trim();

    if (!trimmedId || trimmedId.length !== 4) {
      setErrorMsg('학번 4자리를 정확히 입력해 주세요. (예: 1315 ➔ 1학년 3반 15번)');
      return;
    }
    if (!trimmedName) {
      setErrorMsg('성명을 입력해 주세요.');
      return;
    }

    setSession(trimmedId, trimmedName);
    onLogin({ studentId: trimmedId, name: trimmedName });
  };

  return (
    <div className="start-screen">
      <div className="card start-card animate-scale-in">
        <span className="start-icon">🧪</span>
        <h1 className="start-title">알고리즘 랩</h1>
        <p className="start-subtitle">중학교 정보 · 컴퓨팅 사고력 알고리즘 학습</p>

        <form className="start-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="studentId">
              학번 4자리 <span className="label-sub">(학년·반·번호)</span>
            </label>
            <input
              id="studentId"
              className="form-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="예: 1315 (1학년 3반 15번)"
              value={studentId}
              onChange={handleStudentIdChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="studentName">
              성명
            </label>
            <input
              id="studentName"
              className="form-input"
              type="text"
              placeholder="이름을 입력하세요 (예: 홍길동)"
              value={name}
              onChange={handleNameChange}
            />
          </div>

          {errorMsg && (
            <div className="start-error-msg animate-fade-in">
              ⚠️ {errorMsg}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg start-submit">
            🚀 학습 시작하기
          </button>
        </form>

        <div className="start-teacher-link-wrap">
          <button
            type="button"
            className="btn btn-ghost start-teacher-btn"
            onClick={() => navigate('/teacher')}
          >
            🔒 선생님 결과 확인
          </button>
        </div>

        <p className="start-footer">2022 개정 교육과정 중학교 정보 · for vibecoding 5차시</p>
      </div>
    </div>
  );
}

export default StartScreen;
