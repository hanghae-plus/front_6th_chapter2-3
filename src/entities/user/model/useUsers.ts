import { useQuery } from '@tanstack/react-query';

import { fetchAllUsers, fetchUserById } from '../api/userApi';

/**
 * @description 모든 사용자 목록을 가져오는 useQuery 훅
 */
export const useFetchAllUsers = () => {
  return useQuery({
    queryKey: ['users', 'all'],
    queryFn: fetchAllUsers,
  });
};

/**
 * @description 특정 사용자의 상세 정보를 가져오는 useQuery 훅
 * @param userId 조회할 사용자의 ID. ID가 없으면 쿼리는 비활성화됩니다.
 */
export const useFetchUserById = (userId: number | null) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUserById(userId!),
    enabled: !!userId,
  });
};
