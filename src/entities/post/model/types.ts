// 게시물 도메인 타입 정의

import { User } from "../../user/model/types"

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  author?: User
}

// 생성용 타입
export interface NewPost {
  title: string
  body: string
  userId: number
}

// API 응답 타입
export interface PostsApiResponse {
  posts: Post[]
  total: number
}

// 태그 타입 (API에서 받아오는 태그 정보)
export interface Tag {
  slug: string
  url: string
}
