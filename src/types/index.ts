// 기본 도메인 타입 정의

// 사용자 타입
export interface User {
  id: number
  username: string
  image: string
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
  address: {
    address: string
    city: string
    state: string
  }
  company: {
    name: string
    title: string
  }
}

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
  author?: User
}

// 댓글 타입
export interface Comment {
  id: number
  body: string
  postId: number
  userId: number
  likes: number
  user: {
    id: number
    username: string
  }
}

// 태그 타입 (API에서 받아오는 태그 정보)
export interface Tag {
  slug: string
  url: string
}

// 생성용 타입들
export interface NewPost {
  title: string
  body: string
  userId: number
}

export interface NewComment {
  body: string
  postId: number | null
  userId: number
}

// API 응답 타입들
export interface PostsApiResponse {
  posts: Post[]
  total: number
}

export interface UsersApiResponse {
  users: User[]
}