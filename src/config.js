/**
 * 알고리즘 랩 설정 파일
 * 
 * 구글 스프레드시트 연동 방법:
 * 1. 구글 스프레드시트 생성 ➔ [확장 프로그램] ➔ [Apps Script]
 * 2. 제공된 Apps Script 코드 붙여넣기 ➔ [배포] ➔ [새 배포]
 * 3. 유형: '웹 앱' 선택
 *    - 다음 사용자 권한으로 실행: '나(내 계정)'
 *    - 액세스 권한: '모든 사용자(Anyone)' 선택 ➔ [배포]
 * 4. 발급된 '웹 앱 URL'을 아래 googleSheetUrl에 붙여넣거나,
 *    .env 파일에 VITE_GOOGLE_SHEET_URL=https://... 형태로 설정하세요.
 */

export const config = {
  // 앱 배포 확인용 버전
  appVersion: 'v05',

  // 구글 Apps Script 웹 앱 배포 URL
  googleSheetUrl:
    import.meta.env.VITE_GOOGLE_SHEET_URL ||
    'https://script.google.com/macros/s/AKfycbxZ3jUm7l6wXvLRk8yLDA_pF84wdotZiS6C804X75inlrqd3Gbn_bYDqgfeLvRUR10lcw/exec',
};
