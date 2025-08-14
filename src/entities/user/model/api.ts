import type { User } from "@/entities/user/model/entity"
import type { PaginatedResponse } from "@/shared/api/types"

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

  export type Response = User
}
