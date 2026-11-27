import { useState } from 'react'
import './ConditionLab.css'

export default function ConditionLab({ onComplete }) {
  const [activeTab, setActiveTab] = useState('selection') // 'selection' | 'iteration'
  const [scenario, setScenario] = useState('temp') // 'temp' | 'score'

  // Selection states
  const [temperature, setTemperature] = useState(25)
  const [score, setScore] = useState(85)

  // Iteration states
  const [repeatCount, setRepeatCount] = useState(4)
  const [isLooping, setIsLooping] = useState(false)
  const [currentLoopStep, setCurrentLoopStep] = useState(0)
  const [accumulatedCount, setAccumulatedCount] = useState(0)

  // Track if student explored both
  const [exploredSelection, setExploredSelection] = useState(false)
  const [exploredIteration, setExploredIteration] = useState(false)

  const handleTempChange = (e) => {
    setTemperature(Number(e.target.value))
    setExploredSelection(true)
  }

  const handleScoreChange = (e) => {
    setScore(Number(e.target.value))
    setExploredSelection(true)
  }

  const handleRepeatChange = (e) => {
    setRepeatCount(Number(e.target.value))
    setExploredIteration(true)
  }

  const runLoop = async () => {
    setIsLooping(true)
    setAccumulatedCount(0)
    setExploredIteration(true)

    for (let i = 1; i <= repeatCount; i++) {
      setCurrentLoopStep(i)
      setAccumulatedCount(i)
      await new Promise((r) => setTimeout(r, 500))
    }

    setIsLooping(false)
  }

  // Selection Condition checks
  const isTempHigh = temperature >= 28 // Condition: Temp >= 28
  const scoreGrade = score >= 90 ? 'A' : score >= 60 ? 'B' : 'C'

  return (
    <div className="condition-lab-activity card animate-fade-in">
      {/* Header */}
      <div className="cl-header">
        <div>
          <span className="badge badge-primary">2차시 탐구 활동</span>
          <h2 className="cl-title">🔀 조건 실험실: 선택과 반복 구조</h2>
          <p className="cl-desc">
            슬라이더를 움직여 조건값을 바꾸며 순서도(Flowchart)의 실행 경로가 어떻게 바뀌는지 관찰해 보세요.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="cl-tabs">
          <button
            className={`cl-tab-btn ${activeTab === 'selection' ? 'active' : ''}`}
            onClick={() => setActiveTab('selection')}
          >
            🔀 1. 선택 구조 (조건문)
          </button>
          <button
            className={`cl-tab-btn ${activeTab === 'iteration' ? 'active' : ''}`}
            onClick={() => setActiveTab('iteration')}
          >
            🔄 2. 반복 구조 (루프)
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="cl-workspace">
        {/* ===================== TAB 1: SELECTION ===================== */}
        {activeTab === 'selection' && (
          <div className="cl-content-grid">
            {/* Left Controls */}
            <div className="cl-control-panel">
              <div className="cl-scenario-selector">
                <span className="control-label">실험 시나리오 선택:</span>
                <div className="scenario-btn-group">
                  <button
                    className={`btn btn-sm ${scenario === 'temp' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setScenario('temp')}
                  >
                    🌡️ 스마트 에어컨 제어
                  </button>
                  <button
                    className={`btn btn-sm ${scenario === 'score' ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setScenario('score')}
                  >
                    💯 시험 점수 등급 판정
                  </button>
                </div>
              </div>

              {scenario === 'temp' ? (
                <div className="slider-box">
                  <div className="slider-header">
                    <span className="slider-title">현재 실내 온도:</span>
                    <span className="slider-value-display font-accent">{temperature}°C</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="38"
                    value={temperature}
                    onChange={handleTempChange}
                    className="cl-slider"
                  />
                  <div className="slider-ticks">
                    <span>15°C (시원함)</span>
                    <span className="threshold-marker">기준: 28°C</span>
                    <span>38°C (폭염)</span>
                  </div>
                  <div className="cl-rule-box">
                    <strong>규칙:</strong> 만약 실내 온도가 <code>28°C 이상</code>이면 에어컨을 켜고, 그렇지 않으면 에어컨을 끕니다.
                  </div>
                </div>
              ) : (
                <div className="slider-box">
                  <div className="slider-header">
                    <span className="slider-title">시험 점수:</span>
                    <span className="slider-value-display font-accent">{score}점</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={score}
                    onChange={handleScoreChange}
                    className="cl-slider"
                  />
                  <div className="slider-ticks">
                    <span>0점</span>
                    <span className="threshold-marker">60점 / 90점</span>
                    <span>100점</span>
                  </div>
                  <div className="cl-rule-box">
                    <strong>규칙:</strong> 90점 이상이면 <code>A등급</code>, 60점 이상이면 <code>B등급</code>, 그 외는 <code>C등급</code>입니다.
                  </div>
                </div>
              )}

              {/* Dynamic summary */}
              <div className="cl-decision-result card">
                <span className="result-badge">현재 실행 결과</span>
                {scenario === 'temp' ? (
                  <div className="result-text">
                    현재 온도 {temperature}°C는 28°C 이상이라는 조건이{' '}
                    <strong className={isTempHigh ? 'text-success' : 'text-error'}>
                      {isTempHigh ? '참(True)' : '거짓(False)'}
                    </strong>
                    이므로,{' '}
                    <span className="highlight-action">
                      {isTempHigh ? '❄️ 에어컨을 가동합니다!' : '🍃 에어컨을 끕니다.'}
                    </span>
                  </div>
                ) : (
                  <div className="result-text">
                    점수 {score}점에 따라 부여된 등급은{' '}
                    <span className="highlight-action">{scoreGrade}등급</span> 입니다.
                  </div>
                )}
              </div>
            </div>

            {/* Right Flowchart View */}
            <div className="cl-flowchart-panel">
              <h3 className="panel-heading">📊 실시간 순서도 (Flowchart)</h3>
              <p className="panel-sub">조건의 참/거짓에 따라 활성화된 경로가 주황색으로 표시됩니다.</p>

              {scenario === 'temp' ? (
                <div className="flowchart-canvas">
                  {/* Start */}
                  <div className="fc-node fc-terminal">시작</div>
                  <div className="fc-arrow">↓</div>

                  {/* Input / Read */}
                  <div className="fc-node fc-process">실내 온도 측정 ({temperature}°C)</div>
                  <div className="fc-arrow">↓</div>

                  {/* Decision */}
                  <div className="fc-node fc-decision">
                    <div className="fc-decision-text">온도 ≥ 28°C ?</div>
                  </div>

                  {/* Branches */}
                  <div className="fc-branch-container">
                    {/* True Branch */}
                    <div className={`fc-branch ${isTempHigh ? 'active-branch' : 'inactive-branch'}`}>
                      <span className="branch-label text-success">참 (예)</span>
                      <div className="branch-arrow">↓</div>
                      <div className="fc-node fc-action action-cool">❄️ 에어컨 켜기</div>
                    </div>

                    {/* False Branch */}
                    <div className={`fc-branch ${!isTempHigh ? 'active-branch' : 'inactive-branch'}`}>
                      <span className="branch-label text-error">거짓 (아니오)</span>
                      <div className="branch-arrow">↓</div>
                      <div className="fc-node fc-action action-off">🍃 에어컨 끄기</div>
                    </div>
                  </div>

                  <div className="fc-arrow">↓</div>
                  <div className="fc-node fc-terminal">종료</div>
                </div>
              ) : (
                <div className="flowchart-canvas">
                  <div className="fc-node fc-terminal">시작</div>
                  <div className="fc-arrow">↓</div>
                  <div className="fc-node fc-process">점수 입력 ({score}점)</div>
                  <div className="fc-arrow">↓</div>

                  {/* Decision 1 */}
                  <div className="fc-node fc-decision">
                    <div className="fc-decision-text">점수 ≥ 90 ?</div>
                  </div>

                  <div className="fc-multi-branches">
                    <div className={`fc-branch ${scoreGrade === 'A' ? 'active-branch' : 'inactive-branch'}`}>
                      <span className="branch-label text-success">참 ➔ [A등급]</span>
                    </div>
                    <div className={`fc-branch ${scoreGrade !== 'A' ? 'active-branch' : 'inactive-branch'}`}>
                      <span className="branch-label text-error">거짓 ➔ 다음 조건</span>
                    </div>
                  </div>

                  {/* Decision 2 */}
                  <div className="fc-arrow">↓</div>
                  <div className="fc-node fc-decision">
                    <div className="fc-decision-text">점수 ≥ 60 ?</div>
                  </div>

                  <div className="fc-multi-branches">
                    <div className={`fc-branch ${scoreGrade === 'B' ? 'active-branch' : 'inactive-branch'}`}>
                      <span className="branch-label text-success">참 ➔ [B등급]</span>
                    </div>
                    <div className={`fc-branch ${scoreGrade === 'C' ? 'active-branch' : 'inactive-branch'}`}>
                      <span className="branch-label text-error">거짓 ➔ [C등급]</span>
                    </div>
                  </div>

                  <div className="fc-arrow">↓</div>
                  <div className="fc-node fc-terminal">결과 출력 후 종료</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: ITERATION ===================== */}
        {activeTab === 'iteration' && (
          <div className="cl-content-grid">
            {/* Left Controls */}
            <div className="cl-control-panel">
              <div className="slider-box">
                <div className="slider-header">
                  <span className="slider-title">반복 횟수 지정:</span>
                  <span className="slider-value-display font-accent">{repeatCount}회</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={repeatCount}
                  onChange={handleRepeatChange}
                  disabled={isLooping}
                  className="cl-slider"
                />
                <div className="slider-ticks">
                  <span>1회</span>
                  <span>5회</span>
                  <span>10회</span>
                </div>
              </div>

              <div className="cl-rule-box">
                <strong>반복 구조의 장점:</strong><br />
                같은 동작을 {repeatCount}번 복사해서 쓰지 않고, <code>{repeatCount}번 반복</code> 블록 하나로 간결하게 표현할 수 있습니다!
              </div>

              <div className="loop-action-box">
                <button
                  className="btn btn-primary btn-lg w-full"
                  onClick={runLoop}
                  disabled={isLooping}
                >
                  {isLooping ? `🔄 반복 중... (${currentLoopStep}/${repeatCount})` : '▶️ 반복문 실행하기'}
                </button>
              </div>

              <div className="loop-status-card card">
                <span className="result-badge">변수 count 누적값</span>
                <div className="loop-counter-display">
                  <span className="counter-num">{accumulatedCount}</span>
                  <span className="counter-desc">/ 총 {repeatCount}회 누적</span>
                </div>
              </div>
            </div>

            {/* Right Flowchart View for Loop */}
            <div className="cl-flowchart-panel">
              <h3 className="panel-heading">🔄 반복 순서도와 루프 흐름</h3>
              <p className="panel-sub">루프가 회전할 때마다 반복 조건 검사 ➔ 명령 실행 ➔ 되돌아가기가 수행됩니다.</p>

              <div className="flowchart-canvas">
                <div className="fc-node fc-terminal">시작 (count = 0)</div>
                <div className="fc-arrow">↓</div>

                {/* Loop Decision */}
                <div className={`fc-node fc-decision ${isLooping ? 'loop-active-node' : ''}`}>
                  <div className="fc-decision-text">count &lt; {repeatCount} ?</div>
                </div>

                <div className="loop-branch-wrapper">
                  <div className={`loop-body-box ${isLooping ? 'loop-animating' : ''}`}>
                    <span className="loop-label">참(반복 실행):</span>
                    <div className="fc-node fc-action">count = count + 1</div>
                    <div className="loop-back-arrow">⤴️ 조건으로 되돌아가기 (루프)</div>
                  </div>
                </div>

                <div className="fc-arrow">↓ 거짓 (반복 완료)</div>
                <div className="fc-node fc-terminal">종료 (최종 count = {accumulatedCount})</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="cl-footer">
        <div className="cl-status-hint">
          {exploredSelection && exploredIteration ? (
            <span className="text-success font-bold">✅ 선택 구조와 반복 구조를 모두 체험했습니다!</span>
          ) : !exploredSelection ? (
            <span>💡 1번 탭에서 슬라이더를 움직여 조건 분기를 관찰해 보세요.</span>
          ) : (
            <span>💡 2번 탭에서 반복 구조도 체험해 보세요.</span>
          )}
        </div>
        <button
          className="btn btn-accent btn-lg"
          onClick={onComplete}
          disabled={!exploredSelection}
        >
          탐구 활동 완료하고 퀴즈 풀기 ➔
        </button>
      </div>
    </div>
  )
}
