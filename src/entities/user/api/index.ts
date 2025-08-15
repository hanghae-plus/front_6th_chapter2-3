import { httpClient } from '../../../shared/config/httpClient';

// 특정 사용자 정보 조회
export const fetchUser = async (userId: number) => {
  const response = await httpClient.get(`/api/users/${userId}`);
  return response.json();
};

// 사용자 목록 조회 (이름과 이미지만 선택)
export const fetchUsers = async () => {
  const response = await httpClient.get('/api/users?limit=0&select=username,image');
  return response.json();
};
