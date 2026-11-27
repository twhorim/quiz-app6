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
