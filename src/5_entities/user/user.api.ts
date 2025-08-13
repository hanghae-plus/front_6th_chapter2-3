import { PaginationResponse } from '@/shared/types';

import { User } from './user.type';

export interface GetUsersResponse extends PaginationResponse {
  users: User[];
}

export interface GetUsersParams {
  limit: number;
  select: string;
}

export const getUsers: ({
  limit,
  select,
}: GetUsersParams) => Promise<GetUsersResponse> = async ({ limit, select }) => {
  const response = await fetch(`/api/users?limit=${limit}&select=${select}`);
  return response.json();
};

export const postUser = async () => {};

export const putUser = async () => {};

export const deleteUser = async () => {};

export const getUser = async () => {};
