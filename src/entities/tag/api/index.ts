import { apiClient } from "@/shared/api/apiClient"

import { Tag } from "../model/types"

export const TagApi = {
  async getAll() {
    return apiClient.get<Tag[]>("/posts/tags")
  },
}
