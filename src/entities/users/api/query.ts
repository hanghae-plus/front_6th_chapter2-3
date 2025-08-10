import { useQuery } from '@tanstack/react-query';

export const useGetUser = (userId: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
  });
};
