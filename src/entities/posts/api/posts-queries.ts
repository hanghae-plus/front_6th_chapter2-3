import { useQueryClient } from '@tanstack/react-query';
import { postsApi } from './posts-api';
import { postsKeys } from './posts-keys';
import { CreatePostData, FetchPostsParams, Post } from '../model/types';

export const postsQueries = {
  // 게시물 목록 조회
  list: (params: FetchPostsParams) => ({
    queryKey: postsKeys.list(params),
    queryFn: () => postsApi.getPosts(params),
  }),

  // 태그 목록 조회
  tags: () => ({
    queryKey: postsKeys.tags(),
    queryFn: postsApi.getTags,
    staleTime: 1000 * 60 * 30, // 30분
  }),

  // 게시물 검색
  search: (query: string) => ({
    queryKey: postsKeys.search(query),
    queryFn: () => postsApi.searchPosts(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 2, // 2분
  }),

  // 태그별 게시물 조회
  byTag: (tag: string) => ({
    queryKey: postsKeys.byTag(tag),
    queryFn: () => postsApi.getPostsByTag(tag),
    enabled: tag.trim().length > 0,
  }),

  // 게시물 생성
  create: (queryClient: ReturnType<typeof useQueryClient>) => ({
    mutationFn: (postData: CreatePostData) => postsApi.create(postData),
    onSuccess: () => {
      // 모든 게시물 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
      // 태그 목록도 무효화 (새로운 태그가 추가될 수 있음)
      queryClient.invalidateQueries({ queryKey: postsKeys.tags() });
    },
  }),

  // 게시물 수정
  update: (queryClient: ReturnType<typeof useQueryClient>) => ({
    mutationFn: (postData: Post) => postsApi.update(postData),
    onSuccess: (updatedPost: Post) => {
      // 해당 게시물의 상세 정보 업데이트
      queryClient.setQueryData(
        postsKeys.detail(updatedPost.id),
        updatedPost
      );
      // 모든 게시물 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
      // 검색 결과도 무효화
      queryClient.invalidateQueries({ queryKey: [...postsKeys.all, 'search'] });
      // 태그별 게시물도 무효화
      queryClient.invalidateQueries({ queryKey: [...postsKeys.all, 'tag'] });
      // 태그 목록도 무효화 (태그가 변경될 수 있음)
      queryClient.invalidateQueries({ queryKey: postsKeys.tags() });
    },
  }),

  // 게시물 삭제
  delete: (queryClient: ReturnType<typeof useQueryClient>) => ({
    mutationFn: (id: number) => postsApi.delete(id),
    onSuccess: (_: any, deletedId: number) => {
      // 해당 게시물의 상세 정보 제거
      queryClient.removeQueries({ queryKey: postsKeys.detail(deletedId) });
      // 모든 게시물 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...postsKeys.all, 'search'] });
      queryClient.invalidateQueries({ queryKey: [...postsKeys.all, 'tag'] });
      // 태그 목록도 무효화 (삭제된 게시물의 태그가 마지막일 수 있음)
      queryClient.invalidateQueries({ queryKey: postsKeys.tags() });
    },
  }),
};