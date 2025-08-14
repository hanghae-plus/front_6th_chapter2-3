import { User, UserPick } from '@/entities/user';
import { PaginationMeta } from '@/shared/types';

export interface GetUsersResponse<T> extends PaginationMeta {
  users: T[];
}

export interface GetUsersParams<K extends keyof User> {
  limit: number;
  select: K[];
}

// select에 따라 UserPick 타입을 동적으로 만들 수 없으므로,
// 반환 타입을 런타임에 맞게 제네릭으로 받도록 getUsers를 제네릭 함수로 변경합니다.

export const getUsers = async <K extends keyof User>({
  limit,
  select,
}: GetUsersParams<K>): Promise<GetUsersResponse<UserPick<K>>> => {
  const response = await fetch(
    `/api/users?limit=${limit}&select=${select.join(',')}`
  );
  return response.json();
};

export const postUser = async () => {};

export const putUser = async () => {};

export const deleteUser = async () => {};

export const getUser = async (userId: number): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
};
