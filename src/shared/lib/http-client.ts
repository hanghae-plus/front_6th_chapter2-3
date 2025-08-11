// HTTP 클라이언트 응답 타입 정의
export interface HttpResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Headers
}

// HTTP 에러 클래스
export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public response: Response,
    message?: string,
  ) {
    super(message || `HTTP Error ${status}: ${statusText}`)
    this.name = "HttpError"
  }
}

// HTTP 클라이언트 설정 타입
export interface HttpClientConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

// 요청 옵션 타입
export interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  timeout?: number
  params?: Record<string, string | number | boolean>
  body?: BodyInit | null
}

// 인터셉터 타입
export type RequestInterceptor = (
  config: RequestInit & { url: string },
) => (RequestInit & { url: string }) | Promise<RequestInit & { url: string }>
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>

export class HttpClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private timeout: number
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL || ""
    this.timeout = config.timeout || 10000
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    }
  }

  // 요청 인터셉터 추가
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor)
  }

  // 응답 인터셉터 추가
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor)
  }

  // URL과 쿼리 파라미터 조합
  private buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
    const fullUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`

    if (!params) return fullUrl

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value))
    })

    const separator = fullUrl.includes("?") ? "&" : "?"
    return `${fullUrl}${separator}${searchParams.toString()}`
  }

  // 요청 실행
  private async executeRequest<T>(url: string, method: string, options: RequestOptions = {}): Promise<HttpResponse<T>> {
    const { timeout = this.timeout, params, ...fetchOptions } = options

    // URL 구성
    const requestUrl = this.buildUrl(url, params)

    // 요청 설정 구성
    let requestConfig: RequestInit & { url: string } = {
      url: requestUrl,
      method,
      headers: {
        ...this.defaultHeaders,
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    }

    // 요청 인터셉터 적용
    for (const interceptor of this.requestInterceptors) {
      requestConfig = await interceptor(requestConfig)
    }

    // AbortController를 사용한 타임아웃 처리
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      // fetch 요청 실행
      let response = await fetch(requestConfig.url, {
        ...requestConfig,
        signal: controller.signal,
      })

      // 응답 인터셉터 적용
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response)
      }

      // 응답 상태 확인
      if (!response.ok) {
        throw new HttpError(response.status, response.statusText, response)
      }

      // 응답 데이터 파싱
      const contentType = response.headers.get("content-type")
      let data: T

      if (contentType?.includes("application/json")) {
        data = await response.json()
      } else if (contentType?.includes("text/")) {
        data = (await response.text()) as unknown as T
      } else {
        data = (await response.blob()) as unknown as T
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      }
    } catch (error) {
      if (error instanceof HttpError) {
        throw error
      }

      if ((error as Error).name === "AbortError") {
        throw new Error(`Request timeout after ${timeout}ms`)
      }

      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  // GET 요청
  async get<T = unknown>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.executeRequest<T>(url, "GET", options)
  }

  // POST 요청
  async post<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.executeRequest<T>(url, "POST", {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT 요청
  async put<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.executeRequest<T>(url, "PUT", {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PATCH 요청
  async patch<T = unknown>(url: string, data?: unknown, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.executeRequest<T>(url, "PATCH", {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE 요청
  async delete<T = unknown>(url: string, options?: RequestOptions): Promise<HttpResponse<T>> {
    return this.executeRequest<T>(url, "DELETE", options)
  }
}

// 기본 HTTP 클라이언트 인스턴스 생성
export const httpClient = new HttpClient({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 편의 함수들
export const api = {
  get: <T = unknown>(url: string, options?: RequestOptions) => httpClient.get<T>(url, options),
  post: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) => httpClient.post<T>(url, data, options),
  put: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) => httpClient.put<T>(url, data, options),
  patch: <T = unknown>(url: string, data?: unknown, options?: RequestOptions) =>
    httpClient.patch<T>(url, data, options),
  delete: <T = unknown>(url: string, options?: RequestOptions) => httpClient.delete<T>(url, options),
}
