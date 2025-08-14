const BASE_URL = import.meta.env.VITE_API_BASE_URL
export const api = {
  get: <T>(path: string, init?: RequestInit) =>
    fetch(`${BASE_URL}${path}`, { ...init }).then((r) => r.json() as Promise<T>),
  // post/put/delete 등...
}

type Params = Record<string, string | number | boolean | undefined | null>
type BaseOpts = { params?: Params; headers?: Record<string, string> }

/**
 * 쿼리 스트링 생성
 * @param params - 쿼리 파라미터
 * @returns 쿼리 스트링
 */
function queryString(params?: Params): string {
  if (!params) return ""
  const urlSearchParams = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) urlSearchParams.set(k, String(v))
  })
  const queryString = urlSearchParams.toString()
  return queryString ? `?${queryString}` : ""
}

/**
 * API 클라이언트 클래스
 * 기본 경로를 설정하고 HTTP 메서드를 제공합니다.
 */
export class ApiClient {
  private basePath: string

  constructor(basePath: string = "") {
    this.basePath = basePath
  }

  /**
   * 전체 URL 생성
   * @param path - 상대 경로
   * @returns 전체 URL
   */
  private buildUrl(path: string): string {
    // basePath가 이미 /api로 시작하면 중복 방지
    if (this.basePath.startsWith("/api")) {
      return this.basePath + path
    }
    // basePath가 비어있거나 /api로 시작하지 않으면 /api 추가
    return "/api" + this.basePath + path
  }

  /**
   * 요청 처리
   * @param path - 요청 경로
   * @param init - 요청 옵션
   * @returns 요청 결과
   */
  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const url = this.buildUrl(path)
    const res = await fetch(url, init)

    if (!res.ok) {
      throw new Error(`API ${res.status} ${res.statusText}`)
    }

    if (res.status === 204) {
      return undefined as unknown as T
    }

    return res.json() as Promise<T>
  }

  /**
   * GET 요청
   * @param path - 요청 경로
   * @param opts - 요청 옵션
   * @returns 요청 결과
   */
  protected get<T>(path: string, opts: BaseOpts = {}): Promise<T> {
    return this.request<T>(`${path}${queryString(opts.params)}`, {
      method: "GET",
      headers: opts.headers,
    })
  }

  /**
   * POST 요청
   * @param path - 요청 경로
   * @param body - 요청 본문
   * @param opts - 요청 옵션
   * @returns 요청 결과
   */
  protected post<T, B = unknown>(path: string, body?: B, opts: BaseOpts = {}): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      body: body == null ? undefined : JSON.stringify(body),
    })
  }

  /**
   * PUT 요청
   * @param path - 요청 경로
   * @param body - 요청 본문
   * @param opts - 요청 옵션
   * @returns 요청 결과
   */
  protected put<T, B = unknown>(path: string, body?: B, opts: BaseOpts = {}): Promise<T> {
    return this.request<T>(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      body: body == null ? undefined : JSON.stringify(body),
    })
  }

  /**
   * PATCH 요청
   * @param path - 요청 경로
   * @param body - 요청 본문
   * @param opts - 요청 옵션
   * @returns 요청 결과
   */
  protected patch<T, B = unknown>(path: string, body?: B, opts: BaseOpts = {}): Promise<T> {
    return this.request<T>(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      body: body == null ? undefined : JSON.stringify(body),
    })
  }

  /**
   * DELETE 요청
   * @param path - 요청 경로
   * @param opts - 요청 옵션
   * @returns 요청 결과
   */
  protected delete<T>(path: string, opts: BaseOpts = {}): Promise<T> {
    return this.request<T>(path, {
      method: "DELETE",
      headers: opts.headers,
    })
  }
}
