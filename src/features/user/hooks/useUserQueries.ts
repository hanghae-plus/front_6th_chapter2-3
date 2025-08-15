import { useQuery } from '@tanstack/react-query';
import * as userAPI from '../../../entities/user/api';

// 단일 사용자 조회
export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const data = await userAPI.fetchUser(userId);
      return data;
    },
    enabled: !!userId,
  });
};

// 전체 사용자 목록 조회
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await userAPI.fetchUsers();
      return data;
    },
  });
};
