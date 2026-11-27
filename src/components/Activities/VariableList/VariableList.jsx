import { useState } from 'react'
import './VariableList.css'

export default function VariableList({ onComplete }) {
  // Variable states
  const [variables, setVariables] = useState({
    score: 0,
    playerName: '민수',
    lives: 3,
  })
  const [selectedVar, setSelectedVar] = useState('score')
  const [varOverwriteLog, setVarOverwriteLog] = useState('')

  // List states
  const [fruitList, setFruitList] = useState(['🍎 사과', '🍌 바나나'])
  const [newItemInput, setNewItemInput] = useState('')

  // Mission completion flags
  const [missionVarChanged, setMissionVarChanged] = useState(false)
  const [missionListAdded, setMissionListAdded] = useState(false)
  const [missionListRemoved, setMissionListRemoved] = useState(false)

  // Quick values for variable assignment
  const QUICK_VALUES = {
    score: [10, 50, 100, 999],
    playerName: ['지우', '로봇', '에이전트', '챔피언'],
    lives: [1, 2, 3, 5],
  }

  const setVariableValue = (varName, val) => {
    const oldVal = variables[varName]
    setVariables((prev) => ({ ...prev, [varName]: val }))
    setVarOverwriteLog(
      `변수 [${varName}]의 이전 값 '${oldVal}'이 사라지고 새 값 '${val}'(으)로 덮어씌워졌습니다!`
    )
    setMissionVarChanged(true)
  }

  // List operations
  const addToList = (item) => {
    if (!item.trim()) return
    if (fruitList.length >= 6) {
      alert('리스트에는 최대 6개까지만 담을 수 있습니다.')
      return
    }
    setFruitList((prev) => [...prev, item.trim()])
    setNewItemInput('')
    setMissionListAdded(true)
  }

  const removeFromList = (index) => {
    setFruitList((prev) => prev.filter((_, i) => i !== index))
    setMissionListRemoved(true)
  }

  const sortList = () => {
    setFruitList((prev) => [...prev].sort())
  }

  const clearList = () => {
    setFruitList([])
  }

  const allMissionsDone = missionVarChanged && (fruitList.length >= 3 || missionListAdded)

  return (
    <div className="variable-list-activity card animate-fade-in">
      {/* Header */}
      <div className="vl-header">
        <div>
          <span className="badge badge-primary">3차시 탐구 활동</span>
          <h2 className="vl-title">📦 변수 상자와 리스트 창고</h2>
          <p className="vl-desc">
            하나의 값만 담는 <strong>변수</strong>와 여러 값을 순서대로 담는 <strong>리스트</strong>의 차이를 직접 조작해 보세요.
          </p>
        </div>

        {/* Mission status checklist */}
        <div className="vl-missions-card">
          <span className="missions-title">🎯 탐구 미션</span>
          <div className="mission-item">
            <span>{missionVarChanged ? '✅' : '⬜'} 변수 상자에 새 값 넣어보기 (덮어쓰기 관찰)</span>
          </div>
          <div className="mission-item">
            <span>{fruitList.length >= 3 || missionListAdded ? '✅' : '⬜'} 리스트에 아이템 추가해보기</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Variables, Right List */}
      <div className="vl-workspace-grid">
        {/* ================= SECTION 1: VARIABLES ================= */}
        <div className="vl-panel vl-var-panel">
          <div className="panel-title-bar">
            <h3 className="vl-panel-title">📦 1. 변수 (Variable) 상자</h3>
            <span className="badge badge-primary">단 하나의 값만 저장</span>
          </div>
          <p className="vl-panel-desc">
            변수는 이름이 붙은 상자입니다. 새 값을 넣으면 기존 값은 지워집니다.
          </p>

          {/* Variable Boxes Grid */}
          <div className="var-boxes-container">
            {Object.entries(variables).map(([name, val]) => (
              <div
                key={name}
                className={`var-box ${selectedVar === name ? 'selected-var-box' : ''}`}
                onClick={() => setSelectedVar(name)}
              >
                <div className="var-tag">변수 이름: <strong>{name}</strong></div>
                <div className="var-slot">
                  <span className="var-current-val animate-scale-in" key={val}>
                    {val}
                  </span>
                </div>
                <span className="var-action-hint">클릭하여 값 변경</span>
              </div>
            ))}
          </div>

          {/* Value Injector */}
          <div className="var-injector-box">
            <span className="injector-label">
              선택된 변수 <code>[{selectedVar}]</code>에 넣을 값 선택:
            </span>
            <div className="quick-value-chips">
              {QUICK_VALUES[selectedVar]?.map((v) => (
                <button
                  key={v}
                  className="btn btn-sm btn-outline var-chip-btn"
                  onClick={() => setVariableValue(selectedVar, v)}
                >
                  {v} 넣기
                </button>
              ))}
            </div>
          </div>

          {/* Overwrite notification feedback */}
          {varOverwriteLog && (
            <div className="var-log-box animate-fade-in">
              <span className="log-icon">💡</span>
              <p>{varOverwriteLog}</p>
            </div>
          )}
        </div>

        {/* ================= SECTION 2: LIST ================= */}
        <div className="vl-panel vl-list-panel">
          <div className="panel-title-bar">
            <h3 className="vl-panel-title">📋 2. 리스트 (List) 창고</h3>
            <span className="badge badge-primary">여러 값을 순서대로 보관</span>
          </div>
          <p className="vl-panel-desc">
            리스트는 여러 값을 순서(번호/인덱스)대로 나열하여 보관하는 데이터 창고입니다.
          </p>

          {/* List display */}
          <div className="list-warehouse">
            <span className="warehouse-title">과일바구니 (fruits) 리스트 [길이: {fruitList.length}]</span>
            <div className="list-slots-row">
              {fruitList.length === 0 ? (
                <div className="empty-list-notice">리스트가 비어 있습니다. 아이템을 추가해 보세요!</div>
              ) : (
                fruitList.map((item, idx) => (
                  <div key={idx} className="list-item-card animate-scale-in">
                    <span className="item-index">{idx + 1}번 칸</span>
                    <span className="item-text">{item}</span>
                    <button
                      className="item-delete-btn"
                      onClick={() => removeFromList(idx)}
                      title="삭제"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* List Add and Operations Controls */}
          <div className="list-controls-box">
            <div className="list-add-row">
              <input
                type="text"
                placeholder="추가할 아이템 이름 (예: 🍇 포도)"
                value={newItemInput}
                onChange={(e) => setNewItemInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addToList(newItemInput)}
                className="list-input"
              />
              <button
                className="btn btn-primary"
                onClick={() => addToList(newItemInput)}
              >
                추가
              </button>
            </div>

            {/* Preset quick buttons */}
            <div className="quick-add-group">
              <span className="quick-label">빠른 추가:</span>
              {['🍇 포도', '🍓 딸기', '🍉 수박', '🍑 복숭아'].map((fruit) => (
                <button
                  key={fruit}
                  className="btn btn-sm btn-ghost quick-fruit-btn"
                  onClick={() => addToList(fruit)}
                >
                  {fruit}
                </button>
              ))}
            </div>

            {/* List Operations */}
            <div className="list-ops-row">
              <button className="btn btn-sm btn-outline" onClick={sortList} disabled={fruitList.length < 2}>
                🔤 가나다순 정렬
              </button>
              <button className="btn btn-sm btn-ghost text-error" onClick={clearList} disabled={fruitList.length === 0}>
                🗑️ 전체 비우기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="vl-footer">
        <div className="vl-summary-text">
          {allMissionsDone ? (
            <span className="text-success font-bold">
              🎉 탐구 미션을 완수했습니다! 변수와 리스트의 차이를 확실히 알게 되었네요.
            </span>
          ) : (
            <span>💡 변수에 값을 넣고 리스트에 아이템을 추가해 미션을 완료해 보세요.</span>
          )}
        </div>
        <button
          className="btn btn-accent btn-lg"
          onClick={onComplete}
          disabled={!allMissionsDone}
        >
          탐구 활동 완료하고 퀴즈 풀기 ➔
        </button>
      </div>
    </div>
  )
}
