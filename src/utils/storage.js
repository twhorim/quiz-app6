/* ===== localStorage wrapper ===== */

const STORAGE_PREFIX = 'algo-lab_';

/** Build a unique key from class code + student number */
function buildKey(classCode, studentNum) {
  return `${STORAGE_PREFIX}${classCode}_${studentNum}`;
}

/** Get the current session identity (classCode, studentNum) */
export function getSession() {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}session`);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

/** Set session */
export function setSession(classCode, studentNum) {
  localStorage.setItem(`${STORAGE_PREFIX}session`, JSON.stringify({ classCode, studentNum }));
}

/** Clear session */
export function clearSession() {
  localStorage.removeItem(`${STORAGE_PREFIX}session`);
}

/** Get all student data */
export function getStudentData() {
  const session = getSession();
  if (!session) return createEmptyData();
  const key = buildKey(session.classCode, session.studentNum);
  const raw = localStorage.getItem(key);
  if (!raw) return createEmptyData();
  try { return JSON.parse(raw); } catch { return createEmptyData(); }
}

/** Save all student data */
export function saveStudentData(data) {
  const session = getSession();
  if (!session) return;
  const key = buildKey(session.classCode, session.studentNum);
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
  };
}
