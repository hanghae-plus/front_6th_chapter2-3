// entities/post/model/hooks.ts
import { useQuery } from '@tanstack/react-query'
import { postApi } from '../api'
import { PostsResponse } from './types'

// 게시물 목록 조회
export const usePosts = (limit: number, skip: number) => {
  return useQuery<PostsResponse>({
    queryKey: ['posts', 'list', limit, skip],
    queryFn: () => postApi.getPosts(limit, skip),
  })
}

// 게시물 검색
export const useSearchPosts = (query: string) => {
  return useQuery<PostsResponse>({
    queryKey: ['posts', 'search', query],
    queryFn: () => postApi.searchPosts(query),
    enabled: !!query.trim(),
  })
}

// 태그별 게시물 조회
export const usePostsByTag = (tag: string) => {
  return useQuery<PostsResponse>({
    queryKey: ['posts', 'tag', tag],
    queryFn: () => postApi.getPostsByTag(tag),
    enabled: !!tag && tag !== 'all',
  })
}

// 단일 게시물 조회
export const usePost = (id: number) => {
  return useQuery({
    queryKey: ['posts', 'detail', id],
    queryFn: () => postApi.getPost(id),
    enabled: !!id,
  })
}
