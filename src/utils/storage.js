/* ===== localStorage wrapper ===== */

const STORAGE_PREFIX = 'algo-lab_';

/** Build a unique key from student ID (4 digits) + student Name */
function buildKey(studentId, name) {
  return `${STORAGE_PREFIX}${studentId}_${name}`;
}

/** Get the current session identity (studentId, name) */
export function getSession() {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}session`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    // Backward compatibility if old session format exists
    return {
      studentId: parsed.studentId || `${parsed.classCode || ''}${parsed.studentNum || ''}`,
      name: parsed.name || (parsed.classCode ? `${parsed.classCode}반 ${parsed.studentNum}번` : ''),
    };
  } catch {
    return null;
  }
}

/** Set session */
export function setSession(studentId, name) {
  localStorage.setItem(`${STORAGE_PREFIX}session`, JSON.stringify({ studentId, name }));
}

/** Clear session */
export function clearSession() {
  localStorage.removeItem(`${STORAGE_PREFIX}session`);
}

/** Get all student data */
export function getStudentData() {
  const session = getSession();
  if (!session) return createEmptyData();
  const key = buildKey(session.studentId, session.name);
  const raw = localStorage.getItem(key);
  if (!raw) return createEmptyData();
  try { return JSON.parse(raw); } catch { return createEmptyData(); }
}

/** Save all student data */
export function saveStudentData(data) {
  const session = getSession();
  if (!session) return;
  const key = buildKey(session.studentId, session.name);
  localStorage.setItem(key, JSON.stringify(data));
}

/** Save a single lesson result */
export function saveLessonResult(lessonId, result) {
  const data = getStudentData();
  data.lessons[lessonId] = {
    ...data.lessons[lessonId],
    ...result,
    completedAt: new Date().toISOString(),
  };
  saveStudentData(data);
  return data;
}

/** Save final assessment result */
export function saveFinalResult(result) {
  const data = getStudentData();
  data.finalAssessment = {
    ...result,
    completedAt: new Date().toISOString(),
  };
  saveStudentData(data);
  return data;
}

/** Save essay assignment answers */
export function saveEssayAssignments(essays) {
  const data = getStudentData();
  data.essayAssignments = {
    ...data.essayAssignments,
    ...essays,
    completedAt: new Date().toISOString(),
  };
  saveStudentData(data);
  return data;
}

/** Create empty data structure */
function createEmptyData() {
  return {
    lessons: {
      1: { quizAnswers: [], quizScore: null, understanding: null, reflection: '', activityCompleted: false },
      2: { quizAnswers: [], quizScore: null, understanding: null, reflection: '', activityCompleted: false },
      3: { quizAnswers: [], quizScore: null, understanding: null, reflection: '', activityCompleted: false },
      4: { quizAnswers: [], quizScore: null, understanding: null, reflection: '', activityCompleted: false },
    },
    finalAssessment: null,
    essayAssignments: null,
  };
}


/** Get all students data from localStorage */
export function getAllStudentsData() {
  const students = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX) && key !== `${STORAGE_PREFIX}session`) {
      try {
        const raw = localStorage.getItem(key);
        const data = JSON.parse(raw);
        const suffix = key.replace(STORAGE_PREFIX, '');
        const parts = suffix.split('_');
        const studentId = parts[0] || '';
        const name = parts.slice(1).join('_') || '';
        students.push({
          studentId,
          name,
          ...data,
        });
      } catch {
        // Skip malformed entries
      }
    }
  }
  return students.sort((a, b) => a.studentId.localeCompare(b.studentId));
}

/** Clear all student records from localStorage */
export function clearAllStudentsData() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX) && key !== `${STORAGE_PREFIX}session`) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}


/** Seed sample student data for demonstration/testing */
export function seedSampleData() {
  const samples = [
    {
      studentId: '1301',
      name: '김민준',
      lessons: {
        1: { quizScore: 100, understanding: 'green', reflection: '문제를 작은 단계로 나누니 로봇이 잘 움직였어요.' },
        2: { quizScore: 80, understanding: 'green', reflection: '조건에 따라 플로우차트 길이 달라지는 게 신기했습니다.' },
        3: { quizScore: 100, understanding: 'yellow', reflection: '리스트에 과일 추가하고 정렬하는 법을 배웠어요.' },
        4: { quizScore: 80, understanding: 'green', reflection: '선택과 반복을 조합해서 미로를 탈출했습니다!' },
      },
      finalAssessment: {
        score: 100,
        essayAnswer: '라면 끓일 때 물 끓이기(순차), 스프 맵기 선택(선택), 4분간 끓이기(반복)가 쓰입니다.',
      },
      essayAssignments: {
        1: '문제 분해는 복잡한 문제를 작은 단위의 하위 문제로 나누는 과정입니다. 예를 들어 자판기 프로그램에서 1) 금액 투입 및 잔액 계산, 2) 음료수 재고 및 선택 가능 여부 확인, 3) 선택 음료 배출 및 거스름돈 반환 단계로 나누어 각각 알고리즘을 작성하면 오류를 줄이고 개발하기 쉽습니다.',
        2: '신호등 건너기: 1) 보행자 버튼 누르고 대기(순차), 2) 초록불인지 확인하고 빨간불이면 멈춤(선택), 3) 신호등이 깜빡이는 동안 빠르게 건너며 남은 시간 카운트다운(반복) 구조가 결합되어 있습니다.',
        3: '변수는 하나의 값만 기억할 수 있는 상자이고, 리스트는 여러 개의 데이터를 순서대로 한 묶음으로 보관하는 사물함입니다. 학생 한 명의 점수는 변수가 적합하지만, 반 전체 30명의 성적을 처리할 때는 개별 변수를 30개 만드는 것보다 리스트를 사용하는 것이 훨씬 효율적입니다.',
        completedAt: new Date().toISOString(),
      },
    },
    {
      studentId: '1302',
      name: '이서연',
      lessons: {
        1: { quizScore: 80, understanding: 'green', reflection: '순서가 바뀌면 결과가 달라진다는 점을 배웠습니다.' },
        2: { quizScore: 100, understanding: 'green', reflection: '반복 구조를 쓰면 코드가 훨씬 짧아져요.' },
        3: { quizScore: 80, understanding: 'green', reflection: '변수는 새 값을 넣으면 이전 값이 지워집니다.' },
        4: { quizScore: 100, understanding: 'green', reflection: '블록 코딩으로 미로 탈출 성공했습니다.' },
      },
      finalAssessment: {
        score: 80,
        essayAnswer: '아침 기상 후 세수하기(순차), 비 오면 우산 챙기기(선택), 버스 올 때까지 기다리기(반복)',
      },
      essayAssignments: {
        1: '도서관 책 찾기 프로그램을 분해하면 1단계: 검색어 입력받기, 2단계: 데이터베이스에서 일치 도서 탐색, 3단계: 도서 청구기호 및 서가 위치 화면 출력으로 나눌 수 있습니다.',
        2: '자동문 센서 동작: 문 앞에 물체가 감지되었는지 조건 판단(선택), 감지되면 열고 3초 대기(순차), 물체가 벗어날 때까지 계속 감지 상태 반복 확인(반복)합니다.',
        3: '변수는 단일 값(예: 나의 현재 레벨), 리스트는 여러 값(예: 내가 획득한 아이템 목록)을 저장할 때 사용합니다.',
        completedAt: new Date().toISOString(),
      },
    },
    {
      studentId: '1315',
      name: '홍길동',
      lessons: {
        1: { quizScore: 100, understanding: 'green', reflection: '알고리즘 명령 순서 배치가 재미있었어요.' },
        2: { quizScore: 60, understanding: 'yellow', reflection: '선택 구조 조건식이 조금 헷갈렸어요.' },
        3: { quizScore: 80, understanding: 'yellow', reflection: '변수 상자 덮어쓰기 개념을 이해했습니다.' },
        4: { quizScore: null, understanding: null, reflection: '' },
      },
      finalAssessment: null,
    },
  ];

  samples.forEach((s) => {
    const key = `${STORAGE_PREFIX}${s.studentId}_${s.name}`;
    localStorage.setItem(key, JSON.stringify(s));
  });
}
