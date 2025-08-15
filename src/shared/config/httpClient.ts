// HTTP 클라이언트 설정
class HttpClient {
  private baseUrl: string;

  constructor() {
    // 개발 환경에서는 프록시 사용, 프로덕션에서는 직접 API 호출
    this.baseUrl = (import.meta as any).env?.DEV ? '' : 'https://dummyjson.com';
  }

  // URL을 완전한 API URL로 변환
  private buildUrl(path: string): string {
    if (path.startsWith('/api')) {
      const apiPath = path.replace(/^\/api/, '');
      return `${this.baseUrl}${apiPath}`;
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
