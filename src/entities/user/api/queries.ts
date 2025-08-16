import { useQuery } from '@tanstack/react-query';

import { GetUsersListRequestType } from '../model';

import { getUser, getUsers } from './index';

export const useUserListQuery = (params: GetUsersListRequestType) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  });
};

export const useUserQuery = (id: number) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUser(id),
  });
};
