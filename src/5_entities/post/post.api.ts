import { GetPostsResponse, Post, POST_CONSTANTS } from '@/entities/post';

export interface GetPostsParams {
  limit: number;
  skip: number;
}

export const getPosts = async ({
  limit = POST_CONSTANTS.DEFAULT_LIMIT,
  skip = POST_CONSTANTS.DEFAULT_SKIP,
}: GetPostsParams): Promise<GetPostsResponse> => {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`);
  return response.json();
};

export const getPostsByTag = async ({
  tag,
}: {
  tag: string;
}): Promise<GetPostsResponse> => {
  const response = await fetch(`/api/posts/tag/${tag}`);
  return response.json();
};

export interface GetPostsBySearchParams {
  search: string;
}

export const getPostsBySearch = async ({
  search,
}: GetPostsBySearchParams): Promise<GetPostsResponse> => {
  const response = await fetch(`/api/posts/search?q=${search}`);
  return response.json();
};

export const createPost = async (newPost: Omit<Post, 'id'>): Promise<Post> => {
  const response = await fetch('/api/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  });
  return response.json();
};

export const putPost = async (updatedPost: Post): Promise<Post> => {
  const response = await fetch(`/api/posts/${updatedPost.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedPost),
  });
  return response.json();
};

export const deletePost = async (postId: number) => {
  const response = await fetch(`/api/posts/${postId}`, {
    method: 'DELETE',
  });
  return response.json();
};
