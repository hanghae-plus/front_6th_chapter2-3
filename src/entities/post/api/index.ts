import { updateURLSearchParams } from "../../../shared"
import { PostType } from "../model"

export const fetchPosts = async (limit?: number, skip?: number, sortBy?: string, sortOrder?: string) => {
  const query = updateURLSearchParams({ limit, skip, sortBy, sortOrder });
  const response = await fetch(`/api/posts?${query}`);
  return response.json();
}

export const addPost = async (post: PostType) => {
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return response.json();
}

export const updatePost = async (post: PostType) => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  return response.json();
}