import { userApi } from './user-api';
import { userKeys } from './user-keys';

export const userQueries = {
  list: () => ({
    queryKey: userKeys.list(),
    queryFn: userApi.getUsers,
  }),

  detail: (id: number) => ({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUserById(id),
    enabled: !!id,
  }),
};