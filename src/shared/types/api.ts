/**
 * API 응답 관련 공통 타입들
 */

// Posts API 응답 타입
export interface PostsApiResponse {
  posts: any[];
  total: number;
  skip: number;
  limit: number;
}

// Users API 응답 타입
export interface UsersApiResponse {
  users: any[];
  total: number;
  skip: number;
  limit: number;
}
