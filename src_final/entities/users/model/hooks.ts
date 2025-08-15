import { useQuery } from '@tanstack/react-query';

import userApi from '../api';

export const useGetUser = (userId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userApi.getUser(userId),
  });

  return { data, isLoading, error };
};

export const useGetPost = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => userApi.getUserPost(),
  });

  return { data, isLoading, error };
};
