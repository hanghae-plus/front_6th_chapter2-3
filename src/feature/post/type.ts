import { Post as originPost } from "../../entities"
import { Author } from "../../shared"

export interface Post extends originPost {
  author?: Author
}

export interface NewPost {
  title: string
  body: string
  userId: number
}

export interface DeletePost extends originPost {
  deletedOn: string
  isDeleted: boolean
}
