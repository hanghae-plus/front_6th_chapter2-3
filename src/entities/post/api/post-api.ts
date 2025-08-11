import { POST } from '../config/constants';
import { IAddPost, IPost, IPosts } from '../model/type';
import { createRequest } from '../../../shared/lib/api';

/**
 * 게시물 목록
 */
export const getPostsApi = async (
  limit: number,
  skip: number
): Promise<IPosts> => {
  const response = await fetch(POST.LIST(limit, skip));

  if (!response.ok) {
    throw new Error('게시물 가져오기 오류');
  }

  return response.json();
};

/**
 * 게시물 검색
 */
export const getPostsBySearchApi = async (
  searchQuery: string
): Promise<IPosts> => {
  const response = await fetch(POST.BY_SEARCH(searchQuery));

  if (!response.ok) {
    throw new Error('게시물 검색 오류');
  }

  return response.json();
};

/**
 * 태그별 게시물
 */
export const getPostsByTagApi = async (tag: string): Promise<IPosts> => {
  const response = await fetch(POST.BY_TAG(tag));

  if (!response.ok) {
    throw new Error('태그별 게시물 가져오기 오류');
  }

  return response.json();
};

/**
 * 게시물 추가
 */
export const addPostApi = async (newPost: IAddPost): Promise<IPost> => {
  const response = await fetch(POST.ADD, createRequest('POST', newPost));

  if (!response.ok) {
    throw new Error('게시물 추가 오류');
  }

  return response.json();
};

/**
 * 게시물 업데이트
 */
export const updatePostApi = async (
  updatedPost: Partial<IPost>
): Promise<IPost> => {
  if (!updatedPost.id) {
    throw new Error('게시물 ID 오류');
  }

  const response = await fetch(
    POST.UPDATE(updatedPost.id),
    createRequest('PUT', updatedPost)
  );

  if (!response.ok) {
    throw new Error('게시물 업데이트 오류');
  }

  return response.json();
};

/**
 * 게시물 삭제
 */
export const deletePostApi = async (postId: number): Promise<void> => {
  const response = await fetch(POST.DELETE(postId), createRequest('DELETE'));

  if (!response.ok) {
    throw new Error('게시물 삭제 오류');
  }
};
