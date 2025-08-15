export interface getPostsParams {
  limit?: number
  skip?: string
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags: Array<string>
  reactions: {
    likes: number
    dislikes: number
  }
  views: number
}

export interface PostsData {
  posts: Array<Post>
  total: number
  skip: number
  limit: number
}

export interface PostsTags {
  slug: string
  name: string
  url: string
}

export type getPostsTagParams = getPostsParams

export interface getPostsSearchParams {
  limit: string
  skip: string
}
