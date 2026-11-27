/* ===== Quiz data: all assessment questions ===== */

/**
 * Question types: 'mc' (multiple choice), 'ox' (true/false), 'short' (short answer)
 * Each question has: type, question, options (for mc), answer, explanation
 */

export const lessonQuizzes = {
  1: [
    {
      type: 'mc',
      question: '알고리즘이란 무엇인가?',
      options: [
        '컴퓨터 부품의 이름',
        '문제를 해결하는 절차를 순서대로 나열한 것',
        '인터넷 주소',
        '프로그래밍 언어의 종류',
      ],
      answer: 1,
      explanation: '알고리즘은 문제를 해결하기 위한 단계적 절차를 의미합니다.',
    },
    {
      type: 'ox',
      question: '"문제 분해란 큰 문제를 작은 단계로 나누는 것이다."',
      answer: true,
      explanation: '문제 분해는 복잡한 문제를 해결 가능한 작은 단위로 쪼개는 과정입니다.',
    },
    {
      type: 'mc',
      question: '로봇이 오른쪽을 보고 있을 때, "앞으로 2칸 → 왼쪽 회전 → 앞으로 1칸" 명령을 실행하면 로봇이 최종적으로 향하는 방향은?',
      options: ['위', '아래', '왼쪽', '오른쪽'],
      answer: 0,
      explanation: '오른쪽을 보고 앞으로 간 뒤, 왼쪽 회전하면 위를 향하게 됩니다.',
    },
    {
      type: 'ox',
      question: '"알고리즘의 명령 순서를 바꾸면 결과도 달라질 수 있다."',
      answer: true,
      explanation: '순서가 다르면 실행 결과가 달라지므로 올바른 순서 배치가 중요합니다.',
    },
    {
      type: 'short',
      question: '복잡한 문제를 작은 단계로 나누는 것을 무엇이라 하나요?',
      answer: ['문제 분해', '문제분해', '분해'],
      explanation: '문제 분해(Decomposition)는 컴퓨팅 사고력의 핵심 요소 중 하나입니다.',
    },
  ],

  2: [
    {
      type: 'mc',
      question: '명령을 위에서 아래로 차례대로 실행하는 구조는?',
      options: ['순차 구조', '선택 구조', '반복 구조', '함수 구조'],
      answer: 0,
      explanation: '순차 구조는 명령을 작성된 순서 그대로 하나씩 실행합니다.',
    },
    {
      type: 'mc',
      question: '"만약 점수가 60점 이상이면 \'합격\', 아니면 \'불합격\'"은 어떤 구조인가?',
      options: ['순차', '선택', '반복', '입력'],
      answer: 1,
      explanation: '조건에 따라 실행할 명령이 달라지므로 선택 구조입니다.',
    },
    {
      type: 'ox',
      question: '"반복 구조를 사용하면 같은 명령을 여러 번 쓰지 않아도 된다."',
      answer: true,
      explanation: '반복 구조는 동일한 명령을 지정 횟수만큼 자동으로 되풀이합니다.',
    },
    {
      type: 'short',
      question: '조건이 참일 때와 거짓일 때 서로 다른 명령을 실행하는 구조의 이름은?',
      answer: ['선택 구조', '선택구조', '선택', '조건문'],
      explanation: '선택 구조(조건문)는 조건의 참/거짓에 따라 다른 경로를 실행합니다.',
    },
    {
      type: 'mc',
      question: '다음 중 반복 구조의 예로 알맞은 것은?',
      options: [
        '아침에 일어나서 세수한다',
        '비가 오면 우산을 쓴다',
        '계단을 10번 오른다',
        '이름을 입력한다',
      ],
      answer: 2,
      explanation: '"10번 오른다"는 같은 동작을 정해진 횟수만큼 반복하는 구조입니다.',
    },
  ],

  3: [
    {
      type: 'mc',
      question: '변수에 대한 설명으로 올바른 것은?',
      options: [
        '여러 값을 동시에 저장한다',
        '하나의 값을 저장하는 공간이다',
        '한 번 저장하면 바꿀 수 없다',
        '프로그램의 이름이다',
      ],
      answer: 1,
      explanation: '변수는 하나의 값을 저장하는 이름이 붙은 공간으로, 값을 바꿀 수 있습니다.',
    },
    {
      type: 'ox',
      question: '"변수에 새 값을 넣으면 이전 값은 사라진다."',
      answer: true,
      explanation: '변수는 한 번에 하나의 값만 저장하므로, 새 값을 넣으면 이전 값은 덮어씌워집니다.',
    },
    {
      type: 'mc',
      question: '리스트에 [사과, 바나나, 포도]가 저장되어 있을 때, 두 번째 요소는?',
      options: ['사과', '바나나', '포도', '없음'],
      answer: 1,
      explanation: '리스트의 두 번째 위치에 있는 값은 "바나나"입니다.',
    },
    {
      type: 'short',
      question: '여러 개의 값을 순서대로 저장할 수 있는 자료 구조의 이름은?',
      answer: ['리스트', 'List', 'list', '배열'],
      explanation: '리스트(List)는 여러 값을 순서대로 묶어 하나의 이름으로 관리하는 자료 구조입니다.',
    },
    {
      type: 'ox',
      question: '"리스트에서 요소를 추가하거나 삭제할 수 있다."',
      answer: true,
      explanation: '리스트는 요소의 추가, 삭제, 정렬 등 다양한 조작이 가능합니다.',
    },
  ],

  4: [
    {
      type: 'mc',
      question: '로봇이 벽 앞에서 "만약 앞에 벽이 있으면 오른쪽 회전, 아니면 앞으로"를 실행할 때 사용된 구조는?',
      options: ['순차', '선택', '반복', '변수'],
      answer: 1,
      explanation: '조건(벽 유무)에 따라 다른 동작을 하므로 선택 구조입니다.',
    },
    {
      type: 'ox',
      question: '"프로그램은 순차, 선택, 반복 구조를 조합하여 만들 수 있다."',
      answer: true,
      explanation: '대부분의 프로그램은 세 가지 제어 구조의 조합으로 이루어집니다.',
    },
    {
      type: 'mc',
      question: '로봇이 미로를 탈출하려면 "벽이 없을 때까지 앞으로 이동"을 반복해야 합니다. 이때 사용되는 구조는?',
      options: ['순차', '선택', '반복', '리스트'],
      answer: 2,
      explanation: '조건이 만족될 때까지 같은 동작을 되풀이하므로 반복 구조입니다.',
    },
    {
      type: 'short',
      question: '프로그램에서 이동 횟수를 세기 위해 값을 저장하는 공간을 무엇이라 하나요?',
      answer: ['변수', '변수(Variable)', 'variable'],
      explanation: '변수에 이동 횟수를 저장하고 이동할 때마다 1씩 증가시킵니다.',
    },
    {
      type: 'mc',
      question: '다음 블록 프로그램의 실행 결과는?\n[변수 count = 0] → [3번 반복: count를 1 증가] → [count 출력]',
      options: ['0', '1', '3', '4'],
      answer: 2,
      explanation: 'count가 0에서 시작하여 3번 1씩 증가하면 최종값은 3입니다.',
    },
  ],
};

export const finalQuiz = [
  {
    type: 'mc',
    question: '문제를 해결하기 위한 단계적 절차를 무엇이라 하는가?',
    options: ['프로그래밍', '알고리즘', '디버깅', '컴파일'],
    answer: 1,
    explanation: '알고리즘은 문제 해결을 위한 명확한 절차입니다.',
  },
  {
    type: 'mc',
    question: '다음 중 선택 구조에 해당하는 것은?',
    options: [
      '1부터 10까지 더한다',
      '비가 오면 우산을 쓴다',
      '아침에 일어나서 양치한다',
      '노래를 5번 부른다',
    ],
    answer: 1,
    explanation: '조건(비가 오는지)에 따라 행동이 달라지므로 선택 구조입니다.',
  },
  {
    type: 'ox',
    question: '"변수와 리스트는 모두 하나의 값만 저장할 수 있다."',
    answer: false,
    explanation: '변수는 하나의 값, 리스트는 여러 값을 순서대로 저장할 수 있습니다.',
  },
  {
    type: 'short',
    question: '같은 명령을 여러 번 실행할 때 사용하는 제어 구조는?',
    answer: ['반복 구조', '반복구조', '반복'],
    explanation: '반복 구조를 사용하면 동일한 코드를 효율적으로 여러 번 실행할 수 있습니다.',
  },
  {
    type: 'mc',
    question: '리스트 [10, 20, 30]에서 세 번째 요소를 삭제하면 결과는?',
    options: ['[10, 20]', '[10, 30]', '[20, 30]', '[10, 20, 30]'],
    answer: 0,
    explanation: '세 번째 요소(30)가 삭제되어 [10, 20]만 남습니다.',
  },
  {
    type: 'essay',
    question: '일상생활에서 순차·선택·반복 구조가 모두 포함된 예시를 하나 들고, 각 구조가 어디에 해당하는지 설명하세요.',
    sampleAnswer: '아침에 일어나서 세수하고 옷을 입는다(순차). 비가 오면 우산을 가져간다(선택). 버스 정류장까지 걸음을 반복한다(반복).',
    explanation: '세 가지 제어 구조를 일상 속 사례와 연결하여 설명할 수 있으면 정답입니다. 순차(차례대로 실행), 선택(조건 분기), 반복(되풀이)이 명확히 구분되어야 합니다.',
  },
];
