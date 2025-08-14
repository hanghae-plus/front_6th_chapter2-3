import { API_BASE_URL } from '../../../shared/config/api';
import { UserBasic, UserDetail } from '../model/type';

// 유저 조회
export async function fetchUserBasic(): Promise<{ users: UserBasic[] }> {
  const response = await fetch('/api/users?limit=0&select=username,image');
  if (!response.ok) throw new Error('유저 조회 실패');
  return response.json();
}

// 유저 상세 정보 조회
export async function fetchUserDetail(userId: number): Promise<UserDetail> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error('사용자 정보 가져오기 실패');
    }
    return await response.json();
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    throw error;
  }
}
