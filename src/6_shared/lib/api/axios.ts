import axios from 'axios';

const baseURL = 'https://dummyjson.com';

// 기본 axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
