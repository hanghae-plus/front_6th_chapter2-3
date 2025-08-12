import { api } from "../../shared/api/client";
import type { Post, PostsResponse } from "./types";

interface GetPostsParams {
  limit: number;
  skip: number;
}
export const getPosts = async ({ limit, skip }: GetPostsParams): Promise<PostsResponse> => {
  return api<PostsResponse>(`/api/posts?limit=${limit}&skip=${skip}`);
};

interface GetPostBySearchParams {
  search: string;
}
export const getPostBySearch = async ({ search }: GetPostBySearchParams): Promise<PostsResponse> => {
  return api<PostsResponse>(`/api/posts/search?q=${search}`);
};

interface GetPostByTagParams {
  tag: string;
}
export const getPostByTag = async ({ tag }: GetPostByTagParams): Promise<PostsResponse> => {
  return api<PostsResponse>(`/api/posts/tag/${tag}`);
};

interface AddPostParams {
  post: Partial<Post>;
}
export const addPost = async ({ post }: AddPostParams): Promise<Post> => {
  return api<Post>(`/api/posts/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
};

interface UpdatePostParams {
  post: Post;
}
export const updatePost = async ({ post }: UpdatePostParams): Promise<Post> => {
  return api<Post>(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
};

interface DeletePostParams {
  id: number;
}
export const deletePost = async ({ id }: DeletePostParams): Promise<void> => {
  return api<void>(`/api/posts/${id}`, {
    method: "DELETE",
  });
};
