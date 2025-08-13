import type { UsersResponse } from '../types';
import { remote } from '@/shared/api';

export const getUsers = async (): Promise<UsersResponse> => {
  return await remote(`/api/users?limit=0&select=username,image`);
};
