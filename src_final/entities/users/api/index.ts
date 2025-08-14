import { api } from '@/shared/lib/api.ts';

import { UserInit, UserResponse } from '../model/types.ts';

const userApi = {
  getUser: async (userId: number): Promise<UserResponse> => {
    return api.get<UserResponse>(`/users/${userId}`);
  },
  getUserPost: async (): Promise<UserInit> => {
    return api.get('/users?limit=0&select=username,image');
  },
};

export default userApi;
