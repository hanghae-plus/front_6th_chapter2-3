import { apiClient } from "@/shared/api/apiClient"

import { User, UserQueryParams, UsersResponse } from "../model/types"

export const userApi = {
  async getAll(params: UserQueryParams) {
    return apiClient.get<UsersResponse>("/users", {
      params,
    })
  },
  async getById(userId: number) {
    return apiClient.get<User>(`/users/${userId}`)
  },
}
