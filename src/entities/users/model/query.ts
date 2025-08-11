import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/fetch.ts'
export const useGetUser = (userId:number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: ()=>getUsers(userId)
  });

  return {data,isLoading, error};
};
