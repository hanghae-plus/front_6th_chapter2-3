import type { UserResponse, UsersResponse } from '../model';
import { remote } from '@/shared/api';

export const getUsers = async (): Promise<UsersResponse> => {
  return await remote(`/api/users`, {
    params: {
      limit: 0,
      select: 'username,image',
    },
  });
};

export const getUser = async (userId: number): Promise<UserResponse> => {
  return await remote(`/api/users/${userId}`);
};
