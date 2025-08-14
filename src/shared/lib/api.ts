type Params = Record<string, string | number | boolean | undefined | null>;
type BaseOpts = { params?: Params; headers?: Record<string, string> };

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 쿼리 스트링 생성
 * @param params - 쿼리 파라미터
 * @returns 쿼리 스트링
 */
function queryString(params?: Params) {
  if (!params) return '';
  const urlSearchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) urlSearchParams.set(k, String(v));
  });
  const queryString = urlSearchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * 요청 처리
 * @param path - 요청 경로
 * @param init - 요청 옵션
 * @returns 요청 결과
 */
async function request<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(BASE_URL + path, init);
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

/**
 * API 요청 함수
 */
export const api = {
  get: <T>(path: string, opts: BaseOpts = {}) =>
    request<T>(`${path}${queryString(opts.params)}`, {
      method: 'GET',
      headers: opts.headers,
    }),

  post: <T, B = unknown>(path: string, body?: B, opts: BaseOpts = {}) =>
    request<T>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      body: body == null ? undefined : JSON.stringify(body),
    }),

  put: <T, B = unknown>(path: string, body?: B, opts: BaseOpts = {}) =>
    request<T>(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      body: body == null ? undefined : JSON.stringify(body),
    }),

  patch: <T, B = unknown>(path: string, body?: B, opts: BaseOpts = {}) =>
    request<T>(path, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      body: body == null ? undefined : JSON.stringify(body),
    }),

  delete: <T>(path: string, opts: BaseOpts = {}) =>
    request<T>(path, { method: 'DELETE', headers: opts.headers }),
};
