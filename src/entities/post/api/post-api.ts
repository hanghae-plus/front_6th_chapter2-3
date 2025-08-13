import { POST } from '../config/constants';
import {
  IPost,
  IPosts,
  IPostTag,
  IAddPost,
  IAddPostResponse,
  IEditPostResponse,
} from '../model/type';
import { createRequest } from '../../../shared/lib/api';
import { getQueryString } from '../../../shared/lib/getQueryString';

interface PostsParams {
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
  searchQuery: string;
  selectedTag: string;
}

/**
 * 게시물 목록 조회
 */

export const getPostListApi = async (params: PostsParams): Promise<IPosts> => {
  const { searchQuery, selectedTag, ...otherParams } = params;
  const queryString = getQueryString({ ...otherParams });

  const url: string = (() => {
    if (searchQuery) return POST.BY_SEARCH(searchQuery, queryString);
    if (selectedTag) return POST.BY_TAG(selectedTag, queryString);
    return POST.LIST(queryString);
  })();

  const res = await fetch(url);
  if (!res.ok) throw new Error('게시물 가져오기 오류');

  return res.json();
};

/**
 * 게시물 태그 목록 조회
 */
export const getPostTagListApi = async (): Promise<IPostTag[]> => {
  const response = await fetch(POST.TAG_LIST);

  if (!response.ok) {
    throw new Error('태그 가져오기 오류');
  }

  return response.json();
};

/**
 * 게시물 추가
 */
export const addPostApi = async (
  newPost: IAddPost
): Promise<IAddPostResponse> => {
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
): Promise<IEditPostResponse> => {
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
