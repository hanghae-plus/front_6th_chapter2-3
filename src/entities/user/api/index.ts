import { User } from '../types';

// 순수한 API 호출 함수들 (상태 관리 로직 제거)
export const fetchUser = async (userId: number) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
};

export const fetchUsers = async () => {
  const response = await fetch('/api/users?limit=0&select=username,image');
  return response.json();
};
