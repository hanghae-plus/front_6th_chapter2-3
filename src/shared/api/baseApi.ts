interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
}

async function request<T>(
  baseUrl: string,
  endpoint: string,
  options: RequestOptions,
): Promise<T> {
  const url = `${baseUrl}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const requestOptions: RequestInit = {
    method: options.method,
    headers,
  };

  if (options.body) {
    requestOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(`API 요청 오류: ${response.statusText}`);
  }

  return response.json();
}

export function createApi(baseUrl: string) {
  return {
    async get<T>(endpoint: string): Promise<T> {
      return request<T>(baseUrl, endpoint, { method: "GET" });
    },

    async post<T>(endpoint: string, data: any): Promise<T> {
      return request<T>(baseUrl, endpoint, { method: "POST", body: data });
    },

    async put<T>(endpoint: string, data: any): Promise<T> {
      return request<T>(baseUrl, endpoint, { method: "PUT", body: data });
    },

    async patch<T>(endpoint: string, data: any): Promise<T> {
      return request<T>(baseUrl, endpoint, { method: "PATCH", body: data });
    },

    async delete(endpoint: string): Promise<void> {
      return request<void>(baseUrl, endpoint, { method: "DELETE" });
    },
  };
}
