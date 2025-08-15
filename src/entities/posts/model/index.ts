import { axiosInstance } from "../../../shared/utils/axios"
import {
  CreatePostsRequest,
  CreatePostsResponse,
  DeletePostsResponse,
  UpdatePostsRequest,
  UpdatePostsResponse,
} from "./types"

export const createPosts = async (data: CreatePostsRequest) => {
  return axiosInstance.post<CreatePostsResponse>(`/posts/add`, data)
}

export const updatePosts = async (postId: number, body: UpdatePostsRequest) => {
  return axiosInstance.put<UpdatePostsResponse>(`/posts/${postId}`, body)
}

export const deletePosts = async (postId: number) => {
  return axiosInstance.delete<DeletePostsResponse>(`/posts/${postId}`)
}
