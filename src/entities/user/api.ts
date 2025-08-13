import { apiRequest } from "@/shared/api/base"

import type { User, UserDetail } from "./model"

export const userApi = {
  getUsers: (params?: { limit?: number; select?: string }) => {
    const query = new URLSearchParams()
    if (params?.limit !== undefined) query.set("limit", params.limit.toString())
    if (params?.select) query.set("select", params.select)

    return apiRequest<{ users: User[] }>(`/users?${query.toString()}`)
  },

  getUserById: (id: number) => apiRequest<UserDetail>(`/users/${id}`),
}
