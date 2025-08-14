import { updateURLSearchParams } from "../../../shared"
import { GetPostsListResponseType, PostPostRequestType, PutPostRequestType } from "../model"

export const getPosts = async (limit?: number, skip?: number, sortBy?: string, sortOrder?: string): Promise<GetPostsListResponseType> => {
  const query = updateURLSearchParams({ limit, skip, sortBy, sortOrder });
  const response = await fetch(`/api/posts?${query}`);
  return response.json();
}

export const postPost = async (post: PostPostRequestType) => {
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return response.json();
}

export const putPost = async (post: PutPostRequestType) => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return response.json();
}

export const deletePost = async (id: number) => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  });
  return response.json();
}