import { commentSchema } from "@/entities/comments"
import { addPostRequestSchema, postSchema } from "@/entities/posts"
import { userDetailSchema, userSchema } from "@/entities/users"
import { z } from "zod"

export type User = z.infer<typeof userDetailSchema>

export type Comment = z.infer<typeof commentSchema>

// 기존 Post 타입에 존재하던 author 필드를 유지하기 위해 userSchema를 optional로 확장합니다.
export type Post = z.infer<typeof postSchema> & {
  author?: z.infer<typeof userSchema>
}

export type PostFormData = z.infer<typeof addPostRequestSchema>

// 댓글 작성 폼 데이터는 entities의 comment 스키마에서 필요한 필드만 선택해 구성합니다.
export type CommentFormData = Pick<z.infer<typeof commentSchema>, "body" | "postId"> & {
  userId: number
}
