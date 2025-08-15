import { User } from "../model/types"
const BASE_URL = '/api/users';

export interface GetUsersParams {
  limit?: number
  select?: string
}

export interface UsersResponse {
  users: User[]
  total: number
}

export const userApi = {
  // 모든 사용자 (username, image만)
  getUsers: async (params: GetUsersParams = {}): Promise<UsersResponse> => {
    const { limit = 0, select = "username,image" } = params
    const response = await fetch(`${BASE_URL}?limit=${limit}&select=${select}`);
    if (!response.ok) throw new Error('모든 사용자 정보보 가져오기 오류: ' + response.statusText);
    return response.json();
  },

  // 특정 사용자
  getUser: async (id: number): Promise<User> => {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error('사용자 정보 가져오기 오류: ' + response.statusText);
    return response.json();
  },

  // 기존 메서드 (호환성 유지)
  getUserById: async (id: number): Promise<User> => {
    return userApi.getUser(id)
  }
}