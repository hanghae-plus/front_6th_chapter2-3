import { getUsers, getUser } from './remote';
import { useQuery } from '@tanstack/react-query';
import { USER_QUERY_KEYS } from './query-keys';

export const useUsers = () => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.users(),
    queryFn: () => getUsers(),
  });
};

export const useUser = (userId?: number) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.user(userId!),
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  });
};
