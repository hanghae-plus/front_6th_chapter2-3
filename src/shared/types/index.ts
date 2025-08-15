// 예시: 공통 인터페이스, 유틸리티 타입 등
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface SortParams {
  field: string
  order: "asc" | "desc"
}
