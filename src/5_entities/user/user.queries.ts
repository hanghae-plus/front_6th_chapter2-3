import { useQuery } from '@tanstack/react-query';

import { getUsers, GetUsersParams } from '@/entities/user';
import { queryKeys } from '@/shared/lib';

export const useGetUsersQuery = (params: GetUsersParams) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => getUsers(params),
  });
};

export const userQueryOptions = {
  getUsers: (params: GetUsersParams) => ({
    queryKey: queryKeys.users.list(params),
    queryFn: () => getUsers(params),
  }),
};
