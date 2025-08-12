import { useQuery } from '@tanstack/react-query';
import { getUserListApi, getUserDetail } from '../api/user-api';
import { IUsers, IUserDetail } from './type';

export const useUserListQuery = () => {
  return useQuery<IUsers>({
    queryKey: ['users'],
    queryFn: getUserListApi,
  });
};

export const useUserDetailQuery = (userId: number) => {
  return useQuery<IUserDetail>({
    queryKey: ['user', userId],
    queryFn: () => getUserDetail(userId),
    enabled: !!userId,
  });
};
