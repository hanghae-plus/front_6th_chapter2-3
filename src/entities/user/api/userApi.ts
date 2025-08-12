import { useQuery } from '@tanstack/react-query';

import { User } from '../model/types';

const API_BASE_URL = '/api/users';

const fetchAllUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}?limit=0&select=username,image`);
  if (!response.ok) throw new Error('Failed to fetch users');
  const data = await response.json();
  return data.users;
};

const fetchUserById = async (userId: number): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/${userId}`);
  if (!response.ok) throw new Error(`Failed to fetch user with id ${userId}`);
  return response.json();
};

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
