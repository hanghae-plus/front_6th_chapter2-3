// HTTP 클라이언트 설정
class HttpClient {
  private baseUrl: string;
  private isDev: boolean;

  constructor() {
    // 개발 환경인지 확인 (PROD가 true면 프로덕션)
    this.isDev = !(import.meta as any).env?.PROD;
    // 개발 환경에서는 빈 문자열, 프로덕션에서는 외부 API
    this.baseUrl = this.isDev ? '' : 'https://dummyjson.com';
    
    console.log(`[HTTP Client] 환경 감지: isDev=${this.isDev}, baseUrl=${this.baseUrl}`);
  }

  // URL을 완전한 API URL로 변환
  private buildUrl(path: string): string {
    if (path.startsWith('/api')) {
      if (this.isDev) {
        // 개발 환경: /api를 그대로 두어 Vite proxy가 처리하도록 함
        return path;
      } else {
        // 프로덕션 환경: /api를 제거하고 외부 API 사용
        const apiPath = path.replace(/^\/api/, '');
        const fullUrl = `${this.baseUrl}${apiPath}`;
        console.log(`[HTTP Client] URL 변환: ${path} → ${fullUrl}`);
        return fullUrl;
      }
    }
    return path;
  }

  // GET 요청
  async get(url: string, options?: RequestInit): Promise<Response> {
    const fullUrl = this.buildUrl(url);
    console.log(`[HTTP Client] GET 요청: ${url} → ${fullUrl}`);
    
    return fetch(fullUrl, {
      method: 'GET',
      headers: options?.headers,
      ...options,
    });
  }

  // POST 요청
  async post(url: string, data?: any, options?: RequestInit): Promise<Response> {
    const fullUrl = this.buildUrl(url);
    console.log(`[HTTP Client] POST 요청: ${url} → ${fullUrl}`);
    
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
    console.log(`[HTTP Client] PUT 요청: ${url} → ${fullUrl}`);
    
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
    console.log(`[HTTP Client] PATCH 요청: ${url} → ${fullUrl}`);
    
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
    console.log(`[HTTP Client] DELETE 요청: ${url} → ${fullUrl}`);
    
    return fetch(fullUrl, {
      method: 'DELETE',
      headers: options?.headers,
      ...options,
    });
  }
}

// HTTP 클라이언트 인스턴스 생성
export const httpClient = new HttpClient();
