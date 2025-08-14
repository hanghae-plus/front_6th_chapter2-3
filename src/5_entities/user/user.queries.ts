import { useQuery } from '@tanstack/react-query';

import { getUser, getUsers, GetUsersParams, User } from '@/entities/user';
import { queryKeys } from '@/shared/lib';
import { Nullable } from '@/shared/types';

export const useGetUsersQuery = <K extends keyof User>(
  params: GetUsersParams<K>
) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => getUsers(params),
  });
};

export const useGetUserQuery = (userId: Nullable<number>) => {
  return useQuery({
    queryKey: queryKeys.users.detail(userId ?? 0),
    queryFn: () => getUser(userId ?? 0),
    enabled: !!userId,
  });
};
