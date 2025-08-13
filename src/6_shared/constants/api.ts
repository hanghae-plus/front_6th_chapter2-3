/**
 * API 관련 상수 정의
 *
 * API 엔드포인트, 기본값, 쿼리 파라미터 등을 관리
 */

export const API_CONSTANTS = {
  // 기본 사용자 ID
  DEFAULT_USER_ID: 1,

  // 기본 반응 수치
  REACTIONS: {
    DEFAULT_LIKES: 0,
    DEFAULT_DISLIKES: 0,
    LIKE_INCREMENT: 1,
  },
} as const;

export type APIConstants = typeof API_CONSTANTS;
