import { z } from "zod"

// Comment 스키마
export const CommentSchema = z.object({
  id: z.number(),
  body: z.string(),
  postId: z.number(),
  userId: z.number(),
  likes: z.number().default(0),
  dislikes: z.number().default(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    image: z.string().url().optional(),
  }),
})

// Comment 생성 스키마
export const CreateCommentSchema = z.object({
  body: z.string().min(1, "댓글 내용은 필수입니다"),
  postId: z.number().positive("유효한 게시물 ID가 필요합니다"),
  userId: z.number().positive("유효한 사용자 ID가 필요합니다"),
})

// Comment 수정 스키마
export const UpdateCommentSchema = z.object({
  body: z.string().min(1, "댓글 내용은 필수입니다"),
})

// Comment 필터 스키마
export const CommentFilterSchema = z.object({
  postId: z.number().optional(),
  userId: z.number().optional(),
  skip: z.number().min(0).optional(),
  limit: z.number().min(1).max(100).optional(),
})

// 페이지네이션 응답 스키마
export const CommentPaginatedResponseSchema = z.object({
  comments: z.array(CommentSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
  hasMore: z.boolean(),
})

// 댓글 반응 업데이트 스키마
export const CommentReactionSchema = z.object({
  likes: z.number().min(0),
  dislikes: z.number().min(0),
})

// 타입 추출
export type Comment = z.infer<typeof CommentSchema>
export type CreateComment = z.infer<typeof CreateCommentSchema>
export type UpdateComment = z.infer<typeof UpdateCommentSchema>
export type CommentFilter = z.infer<typeof CommentFilterSchema>
export type CommentPaginatedResponse = z.infer<typeof CommentPaginatedResponseSchema>
export type CommentReaction = z.infer<typeof CommentReactionSchema>
