import { axiosInstance } from "../../../shared/utils/axios"
import {
  CreateCommentsRequest,
  CreateCommentsResponse,
  UpdateCommentsResponse,
  UpdateCommentsLikesRequest,
  UpdateCommentsLikesResponse,
} from "./types"

export const createComments = async (data: CreateCommentsRequest) => {
  return axiosInstance.post<CreateCommentsResponse>(`/comments/add`, data)
}

export const updateComments = async (commentId: number, body: string) => {
  return axiosInstance.put<UpdateCommentsResponse>(`/comments/${commentId}`, {
    body,
  })
}

export const updateCommentsLikes = async (commentId: number, data: UpdateCommentsLikesRequest) => {
  return axiosInstance.patch<UpdateCommentsLikesResponse>(`/comments/${commentId}`, {
    data,
  })
}

export const deleteComments = async (commentId: number) => {
  return axiosInstance.delete(`/comments/${commentId}`)
}
