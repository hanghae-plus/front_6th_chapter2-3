// HTTP 클라이언트 설정
class HttpClient {
  private requestInterceptors: Array<(config: any) => any> = [];

  // 요청 인터셉터 추가
  addRequestInterceptor(interceptor: (config: any) => any) {
    this.requestInterceptors.push(interceptor);
  }

  // 모든 인터셉터를 적용하여 최종 설정 반환
  private applyInterceptors(config: any): any {
    return this.requestInterceptors.reduce((finalConfig, interceptor) => {
      return interceptor(finalConfig);
    }, config);
  }

  // GET 요청
  async get(url: string, options?: RequestInit): Promise<Response> {
    const config = { url, method: 'GET', ...options };
    const finalConfig = this.applyInterceptors(config);

    return fetch(finalConfig.url, {
      method: finalConfig.method,
      headers: finalConfig.headers,
      ...finalConfig,
    });
  }

  // POST 요청
  async post(url: string, data?: any, options?: RequestInit): Promise<Response> {
    const config = { url, method: 'POST', body: data, ...options };
    const finalConfig = this.applyInterceptors(config);

    return fetch(finalConfig.url, {
      method: finalConfig.method,
      headers: finalConfig.headers,
      body: finalConfig.body ? JSON.stringify(finalConfig.body) : undefined,
      ...finalConfig,
    });
  }

  // PATCH 요청
  async patch(url: string, data?: any, options?: RequestInit): Promise<Response> {
    const config = { url, method: 'PATCH', body: data, ...options };
    const finalConfig = this.applyInterceptors(config);

    return fetch(finalConfig.url, {
      method: finalConfig.method,
      headers: finalConfig.headers,
      body: finalConfig.body ? JSON.stringify(finalConfig.body) : undefined,
      ...finalConfig,
    });
  }

  // DELETE 요청
  async delete(url: string, options?: RequestInit): Promise<Response> {
    const config = { url, method: 'DELETE', ...options };
    const finalConfig = this.applyInterceptors(config);

    return fetch(finalConfig.url, {
      method: finalConfig.method,
      headers: finalConfig.headers,
      ...finalConfig,
    });
  }
}

// HTTP 클라이언트 인스턴스 생성
export const httpClient = new HttpClient();

// 프로덕션에서는 dev 프록시가 없으므로 "/api" 프리픽스를 제거한다
if (!import.meta.env.DEV) {
  httpClient.addRequestInterceptor((config) => {
    try {
      const url = new URL(config.url);
      url.pathname = url.pathname.replace(/^\/api/, '');
      return { ...config, url: url.toString() };
    } catch {
      // 절대 URL이 아닐 경우(이 경우는 거의 없음) 안전하게 치환
      return { ...config, url: config.url.replace(/^\/api/, '') };
    }
  });
}
