import { axiosInstance } from "../../../shared/utils/axios"
import { getUsersParams, getUsersData, UserInfo } from "./types"

export const getUsers = async (params: getUsersParams) => {
  const searchParams = new URLSearchParams({
    limit: params.limit?.toString() ?? "0",
    select: params.select ?? "username,image",
  })
  return axiosInstance.get<getUsersData>(`/users?${searchParams}`)
}

export const getUserInfo = async (userId: number) => {
  return axiosInstance.get<UserInfo>(`/users/${userId}`)
}
