import { Post as originPost } from "../../entities"
import { Author } from "../../shared/types"

export interface Post extends originPost {
  author?: Author
}

export interface NewPost {
  title: string
  body: string
  userId: number
}
