import { NewPostPayload, Post, Tag } from '../model/types';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/posts`;

interface FetchPostsParams {
  limit?: number;
  skip?: number;
  tag?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const fetchPosts = async (params: FetchPostsParams) => {
  const query = new URLSearchParams();

  if (params.limit) query.append('limit', String(params.limit));
  if (params.skip) query.append('skip', String(params.skip));
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('order', params.sortOrder);

  const endpoint = params.tag ? `${API_BASE_URL}/tag/${params.tag}` : API_BASE_URL;

  const response = await fetch(`${endpoint}?${query.toString()}`);

  if (!response.ok) throw new Error('Failed to fetch posts');

  const data = await response.json();
  return { posts: data.posts, total: data.total };
};
export const searchPosts = async (query: string) => {
  const response = await fetch(`${API_BASE_URL}/search?q=${query}`);
  if (!response.ok) throw new Error('Failed to search posts');
  const data = await response.json();
  return { posts: data.posts, total: data.total };
};

export const fetchPostsByTag = async (tag: string) => {
  const response = await fetch(`${API_BASE_URL}/tag/${tag}`);
  if (!response.ok) throw new Error('Failed to fetch posts by tag');
  const data = await response.json();
  return { posts: data.posts, total: data.total };
};

export const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch(`${API_BASE_URL}/tags`);
  if (!response.ok) throw new Error('Failed to fetch tags');
  return response.json();
};

export const addPost = async (newPost: NewPostPayload): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  });
  if (!response.ok) throw new Error('Failed to add post');
  return response.json();
};

export const updatePost = async (postToUpdate: Partial<Post> & { id: number }): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/${postToUpdate.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postToUpdate),
  });
  if (!response.ok) throw new Error('Failed to update post');
  return response.json();
};

export const deletePost = async (postId: number): Promise<{ isDeleted: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/${postId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete post');
  return response.json();
};
