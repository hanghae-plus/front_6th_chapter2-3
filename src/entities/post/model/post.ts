import { User } from "@/entities/post/model/user"
import { PageData } from "@/shared/types"

/**게시물 좋아요, 싫어요 수 */
export interface Reactions {
  dislikes: number
  likes: number
}

/** post 정보 */
export interface Post {
  body: string
  id: number
  reactions: Reactions
  tags: string[]
  title: string
  userId: number
  views: number
}

/** post 테이블 컬럼 */
export interface PostWithUser extends Post {
  author?: User
}

/**게시물 목록 응답 */
export interface PostsResponse extends PageData {
  posts: Post[]
}

/**게시물 추가 */
export interface AddPost {
  body: string
  title: string
  userId: number
}

/**게시물 추가 응답 */
export interface AddPostResponse extends AddPost {
  id: number
}

/**게시물 목록 파라미터 */
export interface PostsParams {
  limit?: number
  order?: string
  skip?: number
  sortBy?: string
}

/**게시물 검색 파라미터 */
export interface PostSearchParams extends PostsParams {
  search?: string
  tag?: string
}

/**게시물 수정 */
export interface UpdatePost {
  body: string
  id: number
  title: string
}

export interface UpdatePostResponse extends UpdatePost {
  reactions: Reactions
  tags: string[]
  userId: number
}

/**게시물 테이블 */
export interface PostTableProps {
  onDeletePost: (id: number) => void
  onEditPost: (post: PostWithUser) => void
  onPostDetail: (post: PostWithUser) => void
  onTagClick: (tag: string) => void
  onUserClick: (user: User) => void
  posts: PostWithUser[]
  searchCondition: PostSearchParams
}
