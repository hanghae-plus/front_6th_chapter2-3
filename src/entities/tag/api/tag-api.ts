import { TAG } from '../config/constants';
import { ITag } from '../model/type';

/**
 * 태그 목록 조회
 */
export const getTags = async (): Promise<ITag[]> => {
  const response = await fetch(TAG.LIST);

  if (!response.ok) {
    throw new Error('태그 가져오기 오류');
  }

  return response.json();
};
