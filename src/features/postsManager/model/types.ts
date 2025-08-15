// PostsManager 피처 타입 정의
export interface NewPost {
  title: string
  body: string
  userId: number
}

export interface UpdatePost {
  title: string
  body: string
}

export interface NewComment {
  body: string
  postId: number
  userId: number
}

export interface UpdateComment {
  body: string
}
