// 환경별 API 설정
export const API_CONFIG = {
  // 개발 환경: 로컬 API 사용
  development: {
    baseURL: '/api',
    useMock: false,
  },
  // 프로덕션 환경: Mock 데이터 사용
  production: {
    baseURL: '/api',
    useMock: true,
  },
};

// 현재 환경에 따른 설정
export const getApiConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return API_CONFIG[env as keyof typeof API_CONFIG] || API_CONFIG.development;
};

// Mock 데이터 사용 여부
export const shouldUseMock = () => {
  return getApiConfig().useMock;
};
