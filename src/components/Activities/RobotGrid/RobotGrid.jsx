import { useState, useRef, useEffect } from 'react'
import './RobotGrid.css'

const LEVELS = [
  {
    id: 1,
    title: '레벨 1: 직진 탐험',
    desc: '로봇을 앞으로 2칸 이동시켜 깃발에 도달해 보세요.',
    gridSize: 5,
    start: { x: 0, y: 0, dir: 0 }, // dir: 0=우(0도), 1=하(90도), 2=좌(180도), 3=상(270도)
    goal: { x: 2, y: 0 },
    obstacles: [],
  },
  {
    id: 2,
    title: '레벨 2: 방향 전환',
    desc: '앞으로 이동한 뒤 오른쪽으로 회전하여 깃발을 향해 가보세요.',
    gridSize: 5,
    start: { x: 0, y: 0, dir: 0 },
    goal: { x: 2, y: 2 },
    obstacles: [{ x: 3, y: 0 }, { x: 2, y: 1 }],
  },
  {
    id: 3,
    title: '레벨 3: 장애물 피해가기',
    desc: '장애물(🚧)을 피해 깃발까지 도달하는 알고리즘을 설계해 보세요.',
    gridSize: 5,
    start: { x: 0, y: 1, dir: 0 },
    goal: { x: 3, y: 3 },
    obstacles: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 1, y: 3 }],
  },
]

const PALETTE_BLOCKS = [
  { type: 'FORWARD', label: '⬆️ 앞으로 이동', color: 'blue' },
  { type: 'TURN_LEFT', label: '↩️ 왼쪽 회전', color: 'orange' },
  { type: 'TURN_RIGHT', label: '↪️ 오른쪽 회전', color: 'orange' },
]

export default function RobotGrid({ onComplete }) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0)
  const level = LEVELS[currentLevelIdx]

  // Program blocks sequence
  const [commands, setCommands] = useState([])
  const [robotState, setRobotState] = useState(level.start)
  const [isRunning, setIsRunning] = useState(false)
  const [activeCommandIdx, setActiveCommandIdx] = useState(-1)
  const [statusMessage, setStatusMessage] = useState({ text: '명령 블록을 추가하고 실행 버튼을 눌러보세요!', type: 'info' })
  const [clearedLevels, setClearedLevels] = useState([false, false, false])

  // Reset when level changes
  useEffect(() => {
    setRobotState(level.start)
    setCommands([])
    setIsRunning(false)
    setActiveCommandIdx(-1)
    setStatusMessage({ text: level.desc, type: 'info' })
  }, [currentLevelIdx])

  const addCommand = (block) => {
    if (isRunning) return
    if (commands.length >= 12) {
      setStatusMessage({ text: '최대 12개 명령까지만 추가할 수 있어요.', type: 'warn' })
      return
    }
    setCommands((prev) => [...prev, { id: Date.now() + Math.random(), ...block }])
  }

  const removeCommand = (index) => {
    if (isRunning) return
    setCommands((prev) => prev.filter((_, i) => i !== index))
  }

  const clearCommands = () => {
    if (isRunning) return
    setCommands([])
    setRobotState(level.start)
    setActiveCommandIdx(-1)
    setStatusMessage({ text: '명령이 초기화되었습니다.', type: 'info' })
  }

  const resetRobot = () => {
    setRobotState(level.start)
    setActiveCommandIdx(-1)
    setIsRunning(false)
    setStatusMessage({ text: '로봇이 시작 위치로 돌아갔습니다.', type: 'info' })
  }

  // Execution engine
  const runProgram = async () => {
    if (commands.length === 0) {
      setStatusMessage({ text: '실행할 명령 블록이 없습니다! 블록을 먼저 추가해 주세요.', type: 'warn' })
      return
    }

    setIsRunning(true)
    let current = { ...level.start }
    setRobotState(current)

    for (let i = 0; i < commands.length; i++) {
      setActiveCommandIdx(i)
      const cmd = commands[i]

      // Wait 400ms per step
      await new Promise((r) => setTimeout(r, 450))

      if (cmd.type === 'FORWARD') {
        let { x, y, dir } = current
        if (dir === 0) x += 1 // Right
        else if (dir === 1) y += 1 // Down
        else if (dir === 2) x -= 1 // Left
        else if (dir === 3) y -= 1 // Up

        // Wall Collision check
        if (x < 0 || x >= level.gridSize || y < 0 || y >= level.gridSize) {
          setStatusMessage({ text: '💥 로봇이 벽에 부딪혔습니다! 순서를 다시 생각해 보세요.', type: 'error' })
          setIsRunning(false)
          return
        }

        // Obstacle Collision check
        const isObstacle = level.obstacles.some((o) => o.x === x && o.y === y)
        if (isObstacle) {
          setStatusMessage({ text: '🚧 장애물과 충돌했습니다! 다른 길로 우회해 보세요.', type: 'error' })
          setIsRunning(false)
          return
        }

        current = { ...current, x, y }
      } else if (cmd.type === 'TURN_LEFT') {
        current = { ...current, dir: (current.dir + 3) % 4 }
      } else if (cmd.type === 'TURN_RIGHT') {
        current = { ...current, dir: (current.dir + 1) % 4 }
      }

      setRobotState({ ...current })
    }

    setActiveCommandIdx(-1)
    setIsRunning(false)

    // Check goal condition
    if (current.x === level.goal.x && current.y === level.goal.y) {
      const updatedCleared = [...clearedLevels]
      updatedCleared[currentLevelIdx] = true
      setClearedLevels(updatedCleared)
      setStatusMessage({
        text: `🎉 축하합니다! ${level.title}를 성공적으로 완수했습니다!`,
        type: 'success',
      })
    } else {
      setStatusMessage({
        text: '깃발에 도달하지 못했어요. 명령 순서나 방향을 확인해 보세요!',
        type: 'warn',
      })
    }
  }

  const robotAngle = robotState.dir * 90 // 0=0deg, 1=90deg, 2=180deg, 3=270deg

  return (
    <div className="robot-grid-activity card animate-fade-in">
      {/* Activity Header */}
      <div className="rg-header">
        <div>
          <span className="badge badge-primary">1차시 탐구 활동</span>
          <h2 className="rg-title">🤖 로봇 길 안내하기: 알고리즘 설계</h2>
          <p className="rg-desc">명령 블록을 차례대로 배치하여 로봇이 깃발까지 이동하도록 알고리즘을 만들어 보세요.</p>
        </div>

        {/* Level Selector */}
        <div className="rg-levels">
          {LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              className={`rg-level-btn ${currentLevelIdx === idx ? 'active' : ''} ${clearedLevels[idx] ? 'cleared' : ''}`}
              onClick={() => !isRunning && setCurrentLevelIdx(idx)}
              disabled={isRunning}
            >
              {clearedLevels[idx] ? '✅ ' : ''}레벨 {lvl.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace (3-column layout) */}
      <div className="rg-workspace">
        {/* Left: Palette */}
        <div className="rg-panel rg-palette">
          <h3 className="rg-panel-title">📦 명령 블록</h3>
          <p className="rg-hint">클릭하여 프로그램에 추가하세요</p>
          <div className="rg-block-list">
            {PALETTE_BLOCKS.map((block) => (
              <button
                key={block.type}
                className={`rg-block-btn block-${block.color}`}
                onClick={() => addCommand(block)}
                disabled={isRunning}
              >
                {block.label}
                <span className="rg-add-icon">＋</span>
              </button>
            ))}
          </div>

          <div className="rg-concept-tip">
            <strong>💡 알고리즘 원리:</strong><br />
            컴퓨터는 작성된 명령을 위에서 아래로 순서대로 실행합니다. 순서가 바뀌면 결과도 달라져요!
          </div>
        </div>

        {/* Center: Command Queue */}
        <div className="rg-panel rg-program">
          <div className="rg-panel-header">
            <h3 className="rg-panel-title">📝 작성한 알고리즘 ({commands.length}/12)</h3>
            <button className="btn btn-ghost btn-sm" onClick={clearCommands} disabled={isRunning || commands.length === 0}>
              전체 비우기
            </button>
          </div>

          <div className="rg-program-list">
            {commands.length === 0 ? (
              <div className="rg-empty-queue">
                <span className="empty-icon">👈</span>
                <p>왼쪽에서 명령 블록을 추가해 주세요.</p>
              </div>
            ) : (
              commands.map((cmd, idx) => (
                <div
                  key={cmd.id}
                  className={`rg-cmd-item block-${cmd.color} ${activeCommandIdx === idx ? 'running-active' : ''}`}
                >
                  <span className="cmd-num">{idx + 1}</span>
                  <span className="cmd-label">{cmd.label}</span>
                  <button
                    className="cmd-del-btn"
                    onClick={() => removeCommand(idx)}
                    disabled={isRunning}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="rg-program-actions">
            <button
              className="btn btn-primary btn-lg rg-run-btn"
              onClick={runProgram}
              disabled={isRunning || commands.length === 0}
            >
              {isRunning ? '🤖 이동 중...' : '▶️ 알고리즘 실행'}
            </button>
            <button
              className="btn btn-outline"
              onClick={resetRobot}
              disabled={isRunning}
            >
              🔄 위치 초기화
            </button>
          </div>
        </div>

        {/* Right: 5x5 Grid Map */}
        <div className="rg-panel rg-stage">
          <h3 className="rg-panel-title">🗺️ 실행 맵</h3>
          <div className="rg-grid-board">
            {Array.from({ length: level.gridSize }).map((_, r) => (
              <div key={r} className="rg-grid-row">
                {Array.from({ length: level.gridSize }).map((_, c) => {
                  const isRobot = robotState.x === c && robotState.y === r
                  const isGoal = level.goal.x === c && level.goal.y === r
                  const isObstacle = level.obstacles.some((o) => o.x === c && o.y === r)
                  const isStart = level.start.x === c && level.start.y === r

                  return (
                    <div
                      key={c}
                      className={`rg-cell ${isGoal ? 'cell-goal' : ''} ${isObstacle ? 'cell-obstacle' : ''} ${isStart ? 'cell-start' : ''}`}
                    >
                      {isObstacle && <span className="obstacle-mark">🚧</span>}
                      {isGoal && !isRobot && <span className="goal-mark">🚩</span>}
                      {isRobot && (
                        <div
                          className="robot-entity"
                          style={{
                            transform: `rotate(${robotAngle}deg)`,
                          }}
                        >
                          🤖
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Feedback message banner */}
          <div className={`rg-feedback-box feedback-${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        </div>
      </div>

      {/* Footer Complete button */}
      <div className="rg-footer">
        <div className="rg-summary-note">
          {clearedLevels[0]
            ? '✅ 기본 목표를 달성했습니다! 다음 단계로 넘어가거나 다음 레벨에 도전해 보세요.'
            : '레벨 1을 완수하면 다음 단계로 넘어갈 수 있습니다.'}
        </div>
        <button
          className="btn btn-accent btn-lg"
          onClick={onComplete}
          disabled={!clearedLevels[0]}
        >
          탐구 활동 완료하고 퀴즈 풀기 ➔
        </button>
      </div>
    </div>
  )
}
