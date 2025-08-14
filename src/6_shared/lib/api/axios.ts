import axios from 'axios';

// 기본 axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
