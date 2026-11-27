/**
 * 알고리즘 랩 설정 파일
 */

export const config = {
  // 앱 배포 확인용 버전
  appVersion: 'v07',

  // 구글 Apps Script 웹 앱 배포 URL (데이터 수합 및 대시보드 조회)
  googleSheetUrl:
    import.meta.env.VITE_GOOGLE_SHEET_URL ||
    'https://script.google.com/macros/s/AKfycbxZ3jUm7l6wXvLRk8yLDA_pF84wdotZiS6C804X75inlrqd3Gbn_bYDqgfeLvRUR10lcw/exec',

  // 선생님의 실제 구글 스프레드시트 바로가기 URL
  spreadsheetViewUrl:
    import.meta.env.VITE_SPREADSHEET_VIEW_URL ||
    'https://sheets.google.com',
};
