/**
 * UI 관련 상수 정의
 *
 * 전역적으로 사용되는 UI 요소들의 크기, 스타일, 설정값 등을 관리
 */

export const UI_CONSTANTS = {
  // 텍스트 영역 행 수
  TEXTAREA_ROWS: {
    LARGE: 30, // 게시물 작성용
    MEDIUM: 15, // 게시물 수정용
    SMALL: 5, // 댓글 작성용
  },

  // 아이콘 크기 (Tailwind CSS 클래스)
  ICON_SIZES: {
    SMALL: 'w-3 h-3', // 댓글 버튼용
    MEDIUM: 'w-4 h-4', // 일반 버튼용
    LARGE: 'w-8 h-8', // 프로필 이미지용
  },

  // 페이지네이션 설정
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    DEFAULT_SKIP: 0,
    LIMIT_OPTIONS: [10, 20, 30] as const,
  },

  // 스타일링 관련
  STYLES: {
    TAG_SELECTED: 'text-white bg-blue-500 hover:bg-blue-600',
    TAG_DEFAULT: 'text-blue-800 bg-blue-100 hover:bg-blue-200',
    TAG_SIZE: 'px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer',
  },

  // 레이아웃 관련
  LAYOUT: {
    SPACE_Y_1: 'space-y-1',
    SPACE_Y_2: 'space-y-2',
    FLEX_GAP_1: 'gap-1',
    FLEX_GAP_2: 'gap-2',
  },
} as const;

export type UIConstants = typeof UI_CONSTANTS;
