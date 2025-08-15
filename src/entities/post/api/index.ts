import { GetPostsListResponseType, PostPostRequestType, PutPostRequestType } from '../model';

export const getPosts = async (
  limit?: number,
  skip?: number,
  sortBy?: string,
  sortOrder?: string,
): Promise<GetPostsListResponseType> => {
  const response = await fetch(`/api/posts`, {
    params: {
      limit,
      skip,
      sortBy,
      sortOrder,
    },
  });
  return response.json();
};

export const getPostsBySearch = async (search: string): Promise<GetPostsListResponseType> => {
  const response = await fetch(`/api/posts/search?q=${search}`);
  return response.json();
};

export const getPostsByTag = async (tag: string): Promise<GetPostsListResponseType> => {
  const response = await fetch(`/api/posts/tag/${tag}`);
  return response.json();
};

export const postPost = async (post: PostPostRequestType) => {
  const response = await fetch('/api/posts/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  return response.json();
};

export const putPost = async (post: PutPostRequestType) => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  return response.json();
};

export const deletePost = async (id: number) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

export * from './mutations';
export * from './queries';
