import { useState } from 'react'
import './MazeEscape.css'

const MISSIONS = [
  {
    id: 1,
    title: '미션 1: 순차 코딩으로 첫 탈출',
    desc: '앞으로 3칸 이동 후 회전하여 깃발에 도달하는 기본 블록 프로그램을 조립해 보세요.',
    map: [
      ['S', '.', '.', 'W', 'W'],
      ['W', 'W', '.', 'W', 'W'],
      ['W', 'W', 'G', 'W', 'W'],
      ['W', 'W', 'W', 'W', 'W'],
    ],
    start: { x: 0, y: 0, dir: 0 },
    goal: { x: 2, y: 2 },
    allowedBlocks: ['FORWARD', 'TURN_RIGHT', 'TURN_LEFT'],
  },
  {
    id: 2,
    title: '미션 2: 선택과 반복 구조의 결합',
    desc: '지그재그 통로를 통과하기 위해 순차·선택·반복 블록을 조합하여 완성해 보세요.',
    map: [
      ['S', '.', 'W', 'W', 'W'],
      ['W', '.', 'W', 'W', 'W'],
      ['W', '.', '.', '.', 'W'],
      ['W', 'W', 'W', 'G', 'W'],
    ],
    start: { x: 0, y: 0, dir: 0 },
    goal: { x: 3, y: 3 },
    allowedBlocks: ['FORWARD', 'TURN_RIGHT', 'TURN_LEFT', 'IF_WALL_TURN', 'REPEAT_3'],
  },
]

export default function MazeEscape({ onComplete }) {
  const [missionIdx, setMissionIdx] = useState(0)
  const currentMission = MISSIONS[missionIdx]

  const [program, setProgram] = useState([])
  const [robot, setRobot] = useState(currentMission.start)
  const [stepCount, setStepCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)
  const [resultMsg, setResultMsg] = useState({ text: '블록을 추가하여 로봇의 프로그램을 완성해 보세요!', type: 'info' })
  const [completedMissions, setCompletedMissions] = useState([false, false])

  const addBlock = (blockType, label) => {
    if (isRunning) return
    if (program.length >= 10) return
    setProgram((prev) => [...prev, { id: Date.now() + Math.random(), type: blockType, label }])
  }

  const removeBlock = (idx) => {
    if (isRunning) return
    setProgram((prev) => prev.filter((_, i) => i !== idx))
  }

  const resetAll = () => {
    setRobot(currentMission.start)
    setStepCount(0)
    setIsRunning(false)
    setActiveStep(-1)
    setResultMsg({ text: '초기화되었습니다.', type: 'info' })
  }

  const executeProgram = async () => {
    if (program.length === 0) {
      setResultMsg({ text: '실행할 프로그램 블록이 없습니다!', type: 'warn' })
      return
    }

    setIsRunning(true)
    let current = { ...currentMission.start }
    setRobot(current)
    let count = 0
    setStepCount(0)

    // Expand macro blocks if any (e.g. REPEAT_3 expands into inner sequences)
    let executionList = []
    for (const b of program) {
      if (b.type === 'REPEAT_3') {
        // Repeat next logic or 3 steps forward
        executionList.push({ type: 'FORWARD' }, { type: 'FORWARD' }, { type: 'FORWARD' })
      } else {
        executionList.push(b)
      }
    }

    for (let i = 0; i < executionList.length; i++) {
      setActiveStep(i)
      const cmd = executionList[i]
      await new Promise((r) => setTimeout(r, 450))

      if (cmd.type === 'FORWARD') {
        let { x, y, dir } = current
        if (dir === 0) x += 1
        else if (dir === 1) y += 1
        else if (dir === 2) x -= 1
        else if (dir === 3) y -= 1

        // Wall check
        if (
          y < 0 ||
          y >= currentMission.map.length ||
          x < 0 ||
          x >= currentMission.map[0].length ||
          currentMission.map[y][x] === 'W'
        ) {
          setResultMsg({ text: '💥 벽에 부딪혔습니다! 순서와 회전을 점검해 보세요.', type: 'error' })
          setIsRunning(false)
          return
        }

        current = { ...current, x, y }
        count += 1
        setStepCount(count)
      } else if (cmd.type === 'TURN_RIGHT') {
        current = { ...current, dir: (current.dir + 1) % 4 }
      } else if (cmd.type === 'TURN_LEFT') {
        current = { ...current, dir: (current.dir + 3) % 4 }
      } else if (cmd.type === 'IF_WALL_TURN') {
        // Condition: Check if front is wall
        let { x, y, dir } = current
        let frontX = x + (dir === 0 ? 1 : dir === 2 ? -1 : 0)
        let frontY = y + (dir === 1 ? 1 : dir === 3 ? -1 : 0)
        const isWallFront =
          frontY < 0 ||
          frontY >= currentMission.map.length ||
          frontX < 0 ||
          frontX >= currentMission.map[0].length ||
          currentMission.map[frontY][frontX] === 'W'

        if (isWallFront) {
          current = { ...current, dir: (current.dir + 1) % 4 } // turn right
        } else {
          current = { ...current, x: frontX, y: frontY } // go forward
          count += 1
          setStepCount(count)
        }
      }

      setRobot({ ...current })
    }

    setIsRunning(false)
    setActiveStep(-1)

    // Check goal
    if (current.x === currentMission.goal.x && current.y === currentMission.goal.y) {
      const updated = [...completedMissions]
      updated[missionIdx] = true
      setCompletedMissions(updated)
      setResultMsg({
        text: `🎉 미션 완수! 이동 횟수(변수): ${count}회로 깃발에 도달했습니다!`,
        type: 'success',
      })
    } else {
      setResultMsg({
        text: '도착점에 도달하지 못했습니다. 블록을 수정해 보세요!',
        type: 'warn',
      })
    }
  }

  const robotAngle = robot.dir * 90

  return (
    <div className="maze-escape-activity card animate-fade-in">
      {/* Header */}
      <div className="me-header">
        <div>
          <span className="badge badge-primary">4차시 탐구 활동</span>
          <h2 className="me-title">🚀 미로 탈출 블록 코딩</h2>
          <p className="me-desc">
            순차·선택·반복 구조와 변수를 종합하여 로봇이 미로를 탈출하는 프로그램을 직접 조립해 보세요.
          </p>
        </div>

        {/* Mission Switcher */}
        <div className="me-mission-tabs">
          {MISSIONS.map((m, idx) => (
            <button
              key={m.id}
              className={`me-mission-tab ${missionIdx === idx ? 'active' : ''} ${completedMissions[idx] ? 'cleared' : ''}`}
              onClick={() => {
                if (!isRunning) {
                  setMissionIdx(idx)
                  setProgram([])
                  setRobot(MISSIONS[idx].start)
                  setStepCount(0)
                  setResultMsg({ text: MISSIONS[idx].desc, type: 'info' })
                }
              }}
            >
              {completedMissions[idx] ? '✅ ' : ''}미션 {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace */}
      <div className="me-workspace">
        {/* Left Palette */}
        <div className="me-panel me-palette">
          <h3 className="me-panel-title">🧱 블록 서랍</h3>
          <p className="me-sub">클릭하여 프로그램에 블록을 조립하세요</p>

          <div className="me-blocks-group">
            <span className="block-group-title">순차 블록</span>
            <button
              className="me-code-block block-move"
              onClick={() => addBlock('FORWARD', '⬆️ 앞으로 1칸 이동')}
              disabled={isRunning}
            >
              ⬆️ 앞으로 1칸 이동
            </button>
            <button
              className="me-code-block block-turn"
              onClick={() => addBlock('TURN_RIGHT', '↪️ 오른쪽으로 90도 회전')}
              disabled={isRunning}
            >
              ↪️ 오른쪽으로 90도 회전
            </button>
            <button
              className="me-code-block block-turn"
              onClick={() => addBlock('TURN_LEFT', '↩️ 왼쪽으로 90도 회전')}
              disabled={isRunning}
            >
              ↩️ 왼쪽으로 90도 회전
            </button>

            {currentMission.allowedBlocks.includes('IF_WALL_TURN') && (
              <>
                <span className="block-group-title mt-sm">선택/반복 블록</span>
                <button
                  className="me-code-block block-if"
                  onClick={() => addBlock('IF_WALL_TURN', '🔀 만약 벽이면 우회전, 아니면 직진')}
                  disabled={isRunning}
                >
                  🔀 만약 벽이면 우회전, 아니면 직진
                </button>
                <button
                  className="me-code-block block-repeat"
                  onClick={() => addBlock('REPEAT_3', '🔄 3회 앞으로 반복 실행')}
                  disabled={isRunning}
                >
                  🔄 3회 앞으로 반복 실행
                </button>
              </>
            )}
          </div>
        </div>

        {/* Center: Program Assembly Area */}
        <div className="me-panel me-assembly">
          <div className="me-panel-header">
            <h3 className="me-panel-title">💻 조립된 프로그램</h3>
            <span className="step-counter-badge">이동 카운트: <strong>{stepCount}</strong></span>
          </div>

          <div className="assembly-slot-list">
            <div className="block-start-cap">🏁 프로그램 시작</div>
            {program.length === 0 ? (
              <div className="assembly-empty">왼쪽 서랍에서 블록을 클릭해 조립해 보세요.</div>
            ) : (
              program.map((b, idx) => (
                <div
                  key={b.id}
                  className={`assembled-block ${activeStep === idx ? 'block-running' : ''}`}
                >
                  <span className="block-order">{idx + 1}</span>
                  <span className="block-text">{b.label}</span>
                  <button
                    className="block-del"
                    onClick={() => removeBlock(idx)}
                    disabled={isRunning}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
            <div className="block-end-cap">🛑 프로그램 종료</div>
          </div>

          <div className="me-actions-row">
            <button
              className="btn btn-primary btn-lg flex-1"
              onClick={executeProgram}
              disabled={isRunning || program.length === 0}
            >
              {isRunning ? '🤖 프로그램 실행 중...' : '▶️ 프로그램 실행'}
            </button>
            <button className="btn btn-outline" onClick={resetAll} disabled={isRunning}>
              🔄 위치 리셋
            </button>
          </div>
        </div>

        {/* Right: Maze Canvas */}
        <div className="me-panel me-map-panel">
          <h3 className="me-panel-title">🗺️ 미로 맵</h3>
          <div className="maze-board">
            {currentMission.map.map((row, r) => (
              <div key={r} className="maze-row">
                {row.map((cell, c) => {
                  const isRobot = robot.x === c && robot.y === r
                  const isGoal = currentMission.goal.x === c && currentMission.goal.y === r
                  const isWall = cell === 'W'

                  return (
                    <div
                      key={c}
                      className={`maze-cell ${isWall ? 'cell-wall' : 'cell-path'} ${isGoal ? 'cell-target' : ''}`}
                    >
                      {isWall && <span className="wall-icon">🧱</span>}
                      {isGoal && !isRobot && <span className="goal-icon">🚩</span>}
                      {isRobot && (
                        <div
                          className="robot-avatar"
                          style={{ transform: `rotate(${robotAngle}deg)` }}
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

          <div className={`me-feedback-banner feedback-${resultMsg.type}`}>
            {resultMsg.text}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="me-footer">
        <div className="me-footer-hint">
          {completedMissions[0]
            ? '🎉 미션을 완수했습니다! 이제 형성평가에서 개념을 마무리해 보세요.'
            : '미션 1을 완수하여 프로그램을 성공적으로 실행해 보세요.'}
        </div>
        <button
          className="btn btn-accent btn-lg"
          onClick={onComplete}
          disabled={!completedMissions[0]}
        >
          탐구 활동 완료하고 퀴즈 풀기 ➔
        </button>
      </div>
    </div>
  )
}
