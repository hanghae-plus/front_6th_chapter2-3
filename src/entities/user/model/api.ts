import type { PaginatedResponse } from "@/base/api/types"
import type { FullUser, User } from "@/entities/user/model/entity"

export namespace FetchUsers {
  export type Payload = {
    limit?: number
  }

  export type Response = PaginatedResponse<User, "users">
}

export namespace FetchUserById {
  export type Payload = {
    id: number
  }

  export type Response = FullUser
}
