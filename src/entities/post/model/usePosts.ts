import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchPosts,
  searchPosts,
  fetchPostsByTag,
  fetchTags,
  addPost,
  updatePost,
  deletePost,
} from '../api/postApi';

/**
 * @description 게시물 목록을 가져오는 useQuery 훅
 */
export const useFetchPosts = (limit: number, skip: number, sortBy: string, sortOrder: string) => {
  return useQuery({
    queryKey: ['posts', { limit, skip, sortBy, sortOrder }],
    queryFn: () => fetchPosts({ limit, skip, sortBy, sortOrder }),
  });
};

/**
 * @description 검색어로 게시물을 조회하는 useQuery 훅
 * @param query 검색어. 검색어가 없을 경우 쿼리는 비활성화됩니다.
 */
export const useSearchPosts = (query: string) => {
  return useQuery({
    queryKey: ['posts', 'search', query],
    queryFn: () => searchPosts(query),
    enabled: !!query,
  });
};

/**
 * @description 특정 태그로 게시물 목록을 가져오는 useQuery 훅
 * @param tag 태그 슬러그. 태그가 없으면 쿼리는 비활성화됩니다.
 */
export const useFetchPostsByTag = (tag: string) => {
  return useQuery({
    queryKey: ['posts', 'tag', tag],
    queryFn: () => fetchPostsByTag(tag),
    enabled: !!tag && tag !== 'all',
  });
};

/**
 * @description 모든 태그 목록을 가져오는 useQuery 훅
 */
export const useFetchTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });
};

/**
 * @description 새 게시물을 추가하는 useMutation 훅
 */
export const useAddPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

/**
 * @description 게시물을 수정하는 useMutation 훅
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

/**
 * @description 게시물을 삭제하는 useMutation 훅
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
