import { User } from "../../user/model/types"

// 게시물 타입
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
  views: number
  author?: User // author 정보 추가
}

// 게시물 파라미터 타입
export interface FetchPostsParams {
  limit?: number
  skip?: number
  order?: string
  select?: string
}

// 게시물 목록 응답 타입
export interface PostListResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

// 게시물 추가 파라미터 타입
export interface CreatePostData {
  title: string
  body: string
  userId: number
  tags?: string[]
}