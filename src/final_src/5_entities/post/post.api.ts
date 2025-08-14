import {
  BaseFilterParams,
  DeletedPost,
  GetPostsResponse,
  ParamsWithSearch,
  ParamsWithTag,
  Post,
  POST_CONSTANTS,
  SORT_ORDER,
} from '@/entities/post';
import { ApiService } from '@/shared/lib';

export const getPosts = async ({
  limit = POST_CONSTANTS.DEFAULT_LIMIT,
  skip = POST_CONSTANTS.DEFAULT_SKIP,
  sortBy,
  sortOrder,
}: BaseFilterParams): Promise<GetPostsResponse> => {
  const params = {
    limit: limit.toString(),
    skip: skip.toString(),
    sortBy: sortBy || '',
    sortOrder: sortOrder || SORT_ORDER.ASC,
  };

  return ApiService.get<GetPostsResponse>('/posts', params);
};

export const getPostsByTag = async ({
  selectedTag,
  limit,
  skip,
  sortBy,
  sortOrder,
}: ParamsWithTag): Promise<GetPostsResponse> => {
  const params = {
    limit: limit?.toString() || '0',
    skip: skip?.toString() || '0',
    sortBy: sortBy || '',
    sortOrder: sortOrder || SORT_ORDER.ASC,
  };

  return ApiService.get<GetPostsResponse>(`/posts/tag/${selectedTag}`, params);
};

export const getPostsBySearch = async ({
  searchQuery,
  limit,
  skip,
  sortBy,
  sortOrder,
}: ParamsWithSearch): Promise<GetPostsResponse> => {
  const params = {
    limit: limit?.toString() || '0',
    skip: skip?.toString() || '0',
    searchQuery,
    sortBy: sortBy || '',
    sortOrder: sortOrder || SORT_ORDER.ASC,
  };

  return ApiService.get<GetPostsResponse>('/posts/search', params);
};

export const createPost = async (newPost: Omit<Post, 'id'>): Promise<Post> => {
  return ApiService.post<Post>('/posts/add', newPost);
};

export const putPost = async (updatedPost: Post): Promise<Post> => {
  return ApiService.put<Post>(`/posts/${updatedPost.id}`, updatedPost);
};

export const deletePost = async (postId: number): Promise<DeletedPost> => {
  return ApiService.delete(`/posts/${postId}`);
};
