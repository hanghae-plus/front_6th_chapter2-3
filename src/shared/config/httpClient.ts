// HTTP 클라이언트 - 환경별 API 분기 처리
class HttpClient {
  private baseUrl: string;
  private isDev: boolean;

  constructor() {
    // GitHub Pages 도메인 체크로 환경 감지
    const isGitHubPages = window.location.hostname === 'adds9810.github.io';
    this.isDev = !isGitHubPages;

    // 개발: 로컬 API, 프로덕션: 외부 API
    this.baseUrl = this.isDev ? '' : 'https://dummyjson.com';
  }

  // URL을 환경에 맞게 변환
  private buildUrl(path: string): string {
    if (path.startsWith('/api')) {
      if (this.isDev) {
        // 개발 환경: Vite proxy가 처리
        return path;
      } else {
        // 프로덕션 환경: 외부 API로 변환
        const apiPath = path.replace(/^\/api/, '');
        return `${this.baseUrl}${apiPath}`;
      }
    }
    return path;
  }

  // GET 요청
  async get(url: string, options?: RequestInit): Promise<Response> {
    const fullUrl = this.buildUrl(url);
    return fetch(fullUrl, {
      method: 'GET',
      headers: options?.headers,
      ...options,
    });
  }

  // POST 요청
  async post(url: string, data?: any, options?: RequestInit): Promise<Response> {
    const fullUrl = this.buildUrl(url);
    return fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  // PUT 요청
  async put(url: string, data?: any, options?: RequestInit): Promise<Response> {
    const fullUrl = this.buildUrl(url);
    return fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  // PATCH 요청
  async patch(url: string, data?: any, options?: RequestInit): Promise<Response> {
    const fullUrl = this.buildUrl(url);
    return fetch(fullUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  // DELETE 요청
  async delete(url: string, options?: RequestInit): Promise<Response> {
    const fullUrl = this.buildUrl(url);
    return fetch(fullUrl, {
      method: 'DELETE',
      headers: options?.headers,
      ...options,
    });
  }
}

// HTTP 클라이언트 인스턴스
export const httpClient = new HttpClient();
