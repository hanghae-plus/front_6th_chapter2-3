import { USER } from '../config/constants';
import { IUserDetail, IUsers } from '../model/type';

/**
 * 유저 목록 조회
 */
export const getUserListApi = async (): Promise<IUsers> => {
  const response = await fetch(USER.LIST);

  if (!response.ok) {
    throw new Error('유저 정보 가져오기 오류');
  }

  return response.json();
};

/**
 * 특정 유저 정보 조회
 */
export const getUserDetail = async (userId: number): Promise<IUserDetail> => {
  const response = await fetch(USER.DETAIL(userId));

  if (!response.ok) {
    throw new Error('유저 정보 가져오기 오류');
  }

  return response.json();
};
