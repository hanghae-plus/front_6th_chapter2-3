import { getUsers, getUser } from './remote';
import { useQuery } from '@tanstack/react-query';

export const useUsers = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => getUsers(),
  });
};

export const useUser = (userId?: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  });
};
