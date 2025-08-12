import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Post, Tag } from '../model/types';

const API_BASE_URL = '/api/posts';

const fetchPosts = async ({ limit, skip }: { limit: number; skip: number }) => {
  const response = await fetch(`${API_BASE_URL}?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error('Failed to fetch posts');
  const data = await response.json();
  return { posts: data.posts, total: data.total };
};

const searchPosts = async (query: string) => {
  const response = await fetch(`${API_BASE_URL}/search?q=${query}`);
  if (!response.ok) throw new Error('Failed to search posts');
  const data = await response.json();
  return { posts: data.posts, total: data.total };
};

const fetchPostsByTag = async (tag: string) => {
  const response = await fetch(`${API_BASE_URL}/tag/${tag}`);
  if (!response.ok) throw new Error('Failed to fetch posts by tag');
  const data = await response.json();
  return { posts: data.posts, total: data.total };
};

const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch(`${API_BASE_URL}/tags`);
  if (!response.ok) throw new Error('Failed to fetch tags');
  return response.json();
};

const addPost = async (newPost: Omit<Post, 'id' | 'author'>): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  });
  if (!response.ok) throw new Error('Failed to add post');
  return response.json();
};

const updatePost = async (postToUpdate: Partial<Post> & { id: number }): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/${postToUpdate.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postToUpdate),
  });
  if (!response.ok) throw new Error('Failed to update post');
  return response.json();
};

const deletePost = async (postId: number): Promise<{ isDeleted: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/${postId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete post');
  return response.json();
};

/**
 * @description 게시물 목록을 가져오는 useQuery 훅
 */
export const useFetchPosts = (limit: number, skip: number) => {
  return useQuery({
    queryKey: ['posts', { limit, skip }],
    queryFn: () => fetchPosts({ limit, skip }),
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
