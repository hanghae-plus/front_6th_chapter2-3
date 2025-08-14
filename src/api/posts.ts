import type { Post, PostsApiResponse } from "../types";

const API_BASE_URL = "/api";

export const fetchPosts = async (limit: number, skip: number): Promise<PostsApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/posts?limit=${limit}&skip=${skip}`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
};

export const searchPosts = async (query: string): Promise<PostsApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/posts/search?q=${query}`);
    if (!response.ok) throw new Error("Failed to search posts");
    return response.json();
};

export const fetchPostsByTag = async (tag: string): Promise<PostsApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/posts/tag/${tag}`);
    if (!response.ok) throw new Error(`Failed to fetch posts for tag: ${tag}`);
    return response.json();
};

export const addPost = async (postData: { title: string; body: string; userId: number }): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error("Failed to add post");
    return response.json();
};

export const updatePost = async (postId: number, postData: Partial<Post>): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error("Failed to update post");
    return response.json();
};

export const deletePost = async (postId: number): Promise<{ isDeleted: boolean }> => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete post");
    return response.json();
};
