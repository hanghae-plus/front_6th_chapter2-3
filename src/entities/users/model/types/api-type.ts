import type { User, UserInComment } from './data-type';
import type { Pagination } from '@/shared/model/types';

// 전체 사용자 목록 응답
export interface UsersResponse extends Pagination {
  users: UserInComment[];
}

// 개별 사용자 응답
export type UserResponse = User;
