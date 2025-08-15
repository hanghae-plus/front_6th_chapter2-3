import { httpClient } from '../../../shared/config/httpClient';
import { UserBasic, UserDetail } from '../model/type';

// 유저 조회
export async function fetchUserBasic(): Promise<{ users: UserBasic[] }> {
  const response = await httpClient.get('/api/users?limit=0&select=username,image');
  if (!response.ok) throw new Error('유저 조회 실패');
  return response.json();
}

// 유저 상세 정보 조회
export async function fetchUserDetail(userId: number): Promise<UserDetail> {
  try {
    const response = await httpClient.get(`/api/users/${userId}`);
    if (!response.ok) throw new Error('유저 상세 정보 조회 실패');
    return response.json();
  } catch (error) {
    console.error('유저 상세 정보 조회 오류:', error);
    throw error;
  }
}
