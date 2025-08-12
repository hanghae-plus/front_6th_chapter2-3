type Params = Record<string, string | number | boolean | undefined | null>

/**
 * API 요청 함수
 */

type RequestOpts = {
  params?: Params
  headers?: Record<string, string>
}

const toQuery = (params?: Params) => {
  if (!params) return ""
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) sp.set(k, String(v))
  }
  const qs = sp.toString()
  return qs ? `?${qs}` : ""
}

const trimSlashes = (s: string) => s.replace(/(^\/+|\/+$)/g, "")
const joinPath = (...parts: Array<string | undefined>) =>
  "/" +
  parts
    .filter((p): p is string => !!p && p.length > 0)
    .map((p) => trimSlashes(p))
    .join("/")

/** 확장용 베이스 클라이언트 */
export class ApiClient {
  protected readonly basePath: string
  protected readonly defaultHeaders: Record<string, string>

  constructor(basePath = "", defaultHeaders: Record<string, string> = {}) {
    this.basePath = trimSlashes(basePath) ? "/" + trimSlashes(basePath) : ""
    this.defaultHeaders = { ...defaultHeaders }
  }

  /** 하위 클래스에서 응답 처리 커스터마이징 가능 */
  protected async parseResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) return undefined as unknown as T
    const ct = res.headers.get("Content-Type") || ""
    if (ct.includes("application/json")) return (await res.json()) as T
    return (await res.text()) as unknown as T
  }

  protected buildUrl(path: string, params?: Params) {
    return joinPath(this.basePath, path) + toQuery(params)
  }

  protected async request<T>(method: string, path: string, body?: unknown, opts: RequestOpts = {}): Promise<T> {
    const url = this.buildUrl(path, opts.params)
    const headers: Record<string, string> = { ...this.defaultHeaders, ...(opts.headers || {}) }
    const init: RequestInit = { method, headers }

    if (body !== undefined) {
      if (!headers["Content-Type"]) headers["Content-Type"] = "application/json"
      init.body = headers["Content-Type"].includes("application/json")
        ? JSON.stringify(body)
        : (body as string | FormData | URLSearchParams | ReadableStream)
    }

    const res = await fetch(url, init)
    if (!res.ok) {
      let detail = ""
      try {
        detail = (await res.text()).slice(0, 300)
      } catch {
        // 응답 텍스트 읽기 실패 시 무시
      }
      throw new Error(`API ${res.status} ${res.statusText}${detail ? ` - ${detail}` : ""}`)
    }
    return this.parseResponse<T>(res)
  }

  // HTTP verbs
  get = <T>(path: string, opts?: RequestOpts) => this.request<T>("GET", path, undefined, opts)
  delete = <T>(path: string, opts?: RequestOpts) => this.request<T>("DELETE", path, undefined, opts)
  post = <T, B = unknown>(path: string, body?: B, opts?: RequestOpts) => this.request<T>("POST", path, body, opts)
  put = <T, B = unknown>(path: string, body?: B, opts?: RequestOpts) => this.request<T>("PUT", path, body, opts)
  patch = <T, B = unknown>(path: string, body?: B, opts?: RequestOpts) => this.request<T>("PATCH", path, body, opts)
}
