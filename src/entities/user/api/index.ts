import { User, UserBasic, UsersResponse } from '../types';

export const userAPI = {
  // 사용자 목록 가져오기 (간단한 정보만)
  async fetchUsers(): Promise<UsersResponse> {
    const response = await fetch('/api/users?limit=0&select=username,image');
    if (!response.ok) {
      throw new Error('사용자 목록 가져오기 실패');
    }
    return response.json();
  },

  // 특정 사용자 정보 가져오기
  async fetchUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error('사용자 정보 가져오기 실패');
    }
    return response.json();
  },
};
