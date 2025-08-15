import { Post } from "@/entities/post"
import { PostPagiantionReponse } from "@/entities/post/model/types"
import { UserSummary } from "@/feature/get-users-summary"

export interface PostWithUserSummary extends Post {
  author?: UserSummary
}

export type PostWithUserSummaryReseponse = PostPagiantionReponse<PostWithUserSummary>
