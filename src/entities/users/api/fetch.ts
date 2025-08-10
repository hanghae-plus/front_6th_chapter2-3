import { UserResponse } from '../types.ts';

export const getUsers = async (user: UserResponse) => {
  try {
    const response = await fetch(`/api/users/${user.id}`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
  }
};
