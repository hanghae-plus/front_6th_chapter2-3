export interface BaseProps {
  className?: string;
}

export interface BasePropsWithChildren extends BaseProps {
  children?: React.ReactNode;
}

// API 응답 기본 타입
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// 페이지네이션 관련 타입
export interface PaginationParams {
  skip: number;
  limit: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

// 검색 관련 타입
export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
}

// 정렬 관련 타입
export type SortOrder = 'asc' | 'desc';

export interface SortParams {
  field: string;
  order: SortOrder;
}
