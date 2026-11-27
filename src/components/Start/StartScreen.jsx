import { useState } from 'react';
import { setSession } from '../../utils/storage';
import './StartScreen.css';

function StartScreen({ onLogin }) {
  const [classCode, setClassCode] = useState('');
  const [studentNum, setStudentNum] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedClass = classCode.trim();
    const trimmedNum = studentNum.trim();
    if (!trimmedClass || !trimmedNum) return;
    setSession(trimmedClass, trimmedNum);
    onLogin({ classCode: trimmedClass, studentNum: trimmedNum });
  };

  return (
    <div className="start-screen">
      <div className="card start-card animate-scale-in">
        <span className="start-icon">🧪</span>
        <h1 className="start-title">알고리즘 랩</h1>
        <p className="start-subtitle">컴퓨팅 사고력을 키우는 알고리즘 학습</p>

        <form className="start-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="classCode">학급 (예: 1-3)</label>
            <input
              id="classCode"
              className="form-input"
              type="text"
              placeholder="1-3"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="studentNum">번호 (예: 15)</label>
            <input
              id="studentNum"
              className="form-input"
              type="text"
              placeholder="15"
              value={studentNum}
              onChange={(e) => setStudentNum(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg start-submit">
            🚀 학습 시작하기
          </button>
        </form>

        <p className="start-footer">초등학교 소프트웨어·인공지능 교육</p>
      </div>
    </div>
  );
}

export default StartScreen;
