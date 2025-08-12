import { z } from "zod"

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  age: z.number(),
  email: z.string().email(),
  phone: z.string(),
  image: z.string().url(),
  address: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
  }),
  company: z.object({
    name: z.string(),
    title: z.string(),
  }),
})

// 간단한 User 스키마 (Post 목록에서 사용)
export const AuthorSchema = z.object({
  id: z.number(),
  username: z.string(),
  image: z.string().url(),
})

// 타입 추출
export type User = z.infer<typeof UserSchema>
export type Author = z.infer<typeof AuthorSchema>
