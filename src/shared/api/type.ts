export interface PaginatedResponse {
  total: number
  skip: number
  limit: number
}

// 에러 응답 타입
export interface ApiError {
  message: string
  status: number
  code?: string
  details?: unknown
}
