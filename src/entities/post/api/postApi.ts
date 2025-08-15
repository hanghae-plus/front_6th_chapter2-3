import { CreatePost, Post, UpdatePost } from '../model';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const postApi = {
  async getPosts(
    limit: number,
    skip: number
  ): Promise<{ posts: Post[]; total: number }> {
    const response = await fetch(`${API_BASE_URL}/posts?limit=${limit}&skip=${skip}`);
    return response.json();
  },

  async addPost(post: CreatePost): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    return response.json();
  },

  async updatePost(id: number, post: UpdatePost): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    return response.json();
  },

  async deletePost(id: number): Promise<void> {
    await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });
  },

  async searchPosts(query: string): Promise<{ posts: Post[]; total: number }> {
    const response = await fetch(`${API_BASE_URL}/posts/search?q=${query}`);
    return response.json();
  },

  async getPostsByTag(tag: string): Promise<{ posts: Post[]; total: number }> {
    const response = await fetch(`${API_BASE_URL}/posts/tag/${tag}`);
    return response.json();
  },
};
