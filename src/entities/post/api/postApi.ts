import { Post, PostsResponse, UpdatePostRequest, CreatePostRequest } from "../model/types"
import { api } from "../../../shared/api/axios"

export const getPosts = async (limit: number, skip: number): Promise<PostsResponse> => {
  return api.get(`/posts?limit=${limit}&skip=${skip}`)
}

export const getSearchPosts = async (searchQuery: string): Promise<PostsResponse> => {
  return api.get(`/posts/search?q=${searchQuery}`)
}

export const getPostByTag = async (tag: string):Promise<PostsResponse> => {
  return api.get(`/posts/tag/${tag}`)
}

export const createPost = async (newPost: CreatePostRequest): Promise<Post> => {
  return api.post("/posts", newPost)
}

export const updatePost = async (id: number, updatePost: UpdatePostRequest): Promise<Post> => {
  return api.put(`/posts/${id}`, updatePost)
}