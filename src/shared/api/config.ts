// API 기본 URL을 런타임에 결정하는 함수
const getApiBaseUrl = (): string => {
  // GitHub Pages 환경인지 확인
  const isGitHubPages =
    typeof window !== 'undefined' && window.location.hostname.includes('github.io');

  // 프로덕션 빌드이거나 GitHub Pages 환경이면 dummyjson.com 사용
  // GitHub Pages 환경에서는 무조건 dummyjson.com 사용
  if (isGitHubPages) {
    return 'https://dummyjson.com';
  }

  // 개발 환경에서는 프록시 사용
  return '/api';
};

// API 호출을 위한 공통 fetch 함수
export const apiClient = {
  get: async (endpoint: string) => {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  put: async (endpoint: string, data: any) => {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  delete: async (endpoint: string) => {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },

  patch: async (endpoint: string, data: any) => {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
  },
};

// 디버깅을 위한 현재 API Base URL 확인용
export const getCurrentApiBaseUrl = getApiBaseUrl;
