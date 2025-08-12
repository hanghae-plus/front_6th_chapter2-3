import { useQuery } from '@tanstack/react-query';
import { getUserListApi, getUserDetail } from '../api/user-api';
import { IUsers, IUserDetail } from './type';

/**
 * 유저 목록 조회
 */
export const useUserListQuery = () => {
  return useQuery<IUsers>({
    queryKey: ['users'],
    queryFn: getUserListApi,
  });
};

/**
 * 특정 유저 정보 조회
 */
export const useUserDetailQuery = (userId: number) => {
  return useQuery<IUserDetail>({
    queryKey: ['user', userId],
    queryFn: () => getUserDetail(userId),
    enabled: !!userId,
  });
};
