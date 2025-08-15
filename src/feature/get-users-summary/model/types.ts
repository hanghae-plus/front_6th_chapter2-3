import { User } from "@/entities/user"

export interface UserSummary {
  id: number
  image?: string
  username?: string
}

export interface UserSummaryParams {
  limit: number
  select: (keyof User)[]
}
