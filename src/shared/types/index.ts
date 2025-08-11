import { Post as originPost } from "../../entities"


export interface Post extends originPost {
  author: Author
}

export interface Author {
  id: number
  username: string
  image: string
}

export interface Pagination {
  limit: number
  skip: number
  total: number
}

export interface NewComment {
  body: string
  postId: number | null
  userId: number
}