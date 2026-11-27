import { config } from '../config';

/**
 * 구글 스프레드시트로 학생 학습 결과를 백그라운드 전송합니다.
 * - Apps Script 특성상 text/plain 과 mode: 'no-cors'를 사용하여
 *   브라우저의 CORS 차단 및 리다이렉트 문제를 원천 방지합니다.
 * - 전송 실패 시에도 학생 화면의 진행을 절대 방해하지 않습니다.
 * 
 * @param {Object} payload 전송할 데이터 객체
 */
export async function sendToGoogleSheet(payload) {
  const url = config.googleSheetUrl;
  if (!url || typeof url !== 'string' || !url.trim()) {
    // URL이 설정되지 않은 경우 조용히 건너뜁니다.
    return;
  }

  try {
    await fetch(url.trim(), {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.warn('[구글 시트 연동] 백그라운드 전송 중 경고 (학생 화면 영향 없음):', error);
    return false;
  }
}
