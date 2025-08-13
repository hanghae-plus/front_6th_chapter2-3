// 공통 API 응답 타입
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// 페이지네이션 응답 타입
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

// API 클라이언트 설정 타입
export interface ApiConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}
