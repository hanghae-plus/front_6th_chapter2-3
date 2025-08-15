// HTTP 클라이언트 설정
class HttpClient {
  private baseUrl: string;
  private isDev: boolean;

  constructor() {
    console.log('[HTTP Client] 생성자 호출됨');

    // 더 확실한 환경 감지: GitHub Pages 도메인 체크
    const isGitHubPages = window.location.hostname === 'adds9810.github.io';
    this.isDev = !isGitHubPages;

    // 개발 환경에서는 빈 문자열, 프로덕션에서는 외부 API
    this.baseUrl = this.isDev ? '' : 'https://dummyjson.com';

    console.log(
      `[HTTP Client] 환경 감지: hostname=${window.location.hostname}, isDev=${this.isDev}, baseUrl=${this.baseUrl}`,
    );

    // 전역 객체에 저장하여 디버깅
    (window as any).httpClientDebug = {
      isDev: this.isDev,
      baseUrl: this.baseUrl,
      hostname: window.location.hostname,
    };
  }

  // URL을 완전한 API URL로 변환
  private buildUrl(path: string): string {
    console.log(`[HTTP Client] buildUrl 호출: ${path}`);

    if (path.startsWith('/api')) {
      if (this.isDev) {
        // 개발 환경: /api를 그대로 두어 Vite proxy가 처리하도록 함
        console.log(`[HTTP Client] 개발 환경: ${path} 유지`);
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
    console.log(`[HTTP Client] get 메서드 호출: ${url}`);
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
    console.log(`[HTTP Client] post 메서드 호출: ${url}`);
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
    console.log(`[HTTP Client] put 메서드 호출: ${url}`);
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
    console.log(`[HTTP Client] patch 메서드 호출: ${url}`);
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
    console.log(`[HTTP Client] delete 메서드 호출: ${url}`);
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
console.log('[HTTP Client] 인스턴스 생성 시작');
export const httpClient = new HttpClient();
console.log('[HTTP Client] 인스턴스 생성 완료:', httpClient);
