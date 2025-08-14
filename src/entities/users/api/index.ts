import { api } from '@/shared/lib/api.ts';

import { UserResponse } from '../model/types.ts';

import { api } from '@/shared/lib/api.ts';

const userApi = {
  getUser: async (userId: number): Promise<UserResponse> => {
    return api.get<UserResponse>(`/users/${userId}`);
  },
  getUserPost: () => {
    return api.get('/api/users?limit=0&select=username,image');
  },
};

export default userApi;
