import { z } from "zod"

// Post 스키마
export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
  tags: z.array(z.string()).optional(),
  reactions: z
    .object({
      likes: z.number(),
      dislikes: z.number(),
    })
    .optional(),
  author: z
    .object({
      id: z.number(),
      username: z.string(),
      image: z.string(),
    })
    .optional(),
})

// Post 생성 스키마
export const CreatePostSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다"),
  body: z.string().min(1, "내용은 필수입니다"),
  userId: z.number().positive("유효한 사용자 ID가 필요합니다"),
})

// Post 수정 스키마
export const UpdatePostSchema = CreatePostSchema.partial()

// Post 필터 스키마
export const PostFilterSchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  sortBy: z.enum(["id", "title", "reactions", "none"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  skip: z.number().min(0).optional(),
  limit: z.number().min(1).max(100).optional(),
})

// 페이지네이션 응답 스키마
export const PostPaginatedResponseSchema = z.object({
  posts: z.array(PostSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
  hasMore: z.boolean(),
})

// 타입 추출
export type Post = z.infer<typeof PostSchema>
export type CreatePost = z.infer<typeof CreatePostSchema>
export type UpdatePost = z.infer<typeof UpdatePostSchema>
export type PostFilter = z.infer<typeof PostFilterSchema>
export type PostPaginatedResponse = z.infer<typeof PostPaginatedResponseSchema>
