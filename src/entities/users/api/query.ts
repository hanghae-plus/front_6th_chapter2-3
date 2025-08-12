import { getUsers } from './remote';
import { useQuery } from '@tanstack/react-query';

export const useUsers = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => getUsers(),
  });
};
