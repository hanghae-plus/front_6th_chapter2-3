import { Post as originPost } from "../../entities"
import { Author } from "../../shared/types"

export interface Post extends originPost {
  author?: Author
}
